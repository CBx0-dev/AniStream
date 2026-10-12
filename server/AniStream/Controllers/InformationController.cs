using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using AniStream.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/information")]
[ApiController]
[Authorize(Roles = Roles.Dashboard)]
public sealed class InformationController : ApiControllerBase
{
    private readonly IInformationService _informationService;
    private readonly IUserService _userService;
    private readonly IProviderService _providerService;
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;
    private readonly ICatalogSyncService _catalogSyncService;
    private readonly ISeriesSyncService _seriesSyncService;
    private readonly IProviderSyncService _providerSyncService;

    public InformationController(
        IInformationService informationService,
        IUserService userService,
        IProviderService providerService,
        ISeriesService seriesService,
        ISeasonService seasonService,
        IEpisodeService episodeService,
        ICatalogSyncService catalogSyncService,
        ISeriesSyncService seriesSyncService,
        IProviderSyncService providerSyncService
    )
    {
        _informationService = informationService;
        _userService = userService;
        _providerService = providerService;
        _seriesService = seriesService;
        _seasonService = seasonService;
        _episodeService = episodeService;
        _catalogSyncService = catalogSyncService;
        _seriesSyncService = seriesSyncService;
        _providerSyncService = providerSyncService;
    }

    [HttpGet("client")]
    [AllowAnonymous]
    public async Task<IActionResult> GetClientLatestVersion()
    {
        string? latestJsonUrl = await _informationService.GetClientUpdateInformation();
        if (latestJsonUrl is null)
        {
            // Tauri-Updater expects a 204 response message
            return NoContent();
        }

        return RedirectPermanent(latestJsonUrl);
    }

    [HttpGet("server")]
    [AllowAnonymous]
    public async Task<ActionResult<BackendInformation>> GetBackedInformation()
    {
        return await _informationService.GetBackendUpdateInformation();
    }

    [HttpGet("stats")]
    public async Task<StatsModel> GetStats()
    {
        int totalProfiles = await _userService.GetProfileCount();
        int totalSeries = 0;
        int dayJobs = 0;
        int dayJobsCompleted = 0;
        int dayJobsFailed = 0;


        foreach (string provider in _providerService.GetProviders())
        {
            _providerService.SetActiveProvider(provider);

            totalSeries += await _seriesService.GetSeriesCount();

            SyncJobStats providerStats = await _providerSyncService.GetStats();
            SyncJobStats seriesStats = await _seriesSyncService.GetStats();
            SyncJobStats catalogStats = await _catalogSyncService.GetStats();

            dayJobs += providerStats.Total + seriesStats.Total + catalogStats.Total;
            dayJobsCompleted += providerStats.Completed + seriesStats.Completed + catalogStats.Completed;
            dayJobsFailed += providerStats.Failed + seriesStats.Failed + catalogStats.Failed;
        }

        return new StatsModel
        {
            TotalProfiles = totalProfiles,
            TotalSeries = totalSeries,
            DayJobs = dayJobs,
            DayJobsCompleted = dayJobsCompleted,
            DayJobsFailed = dayJobsFailed
        };
    }

    [HttpGet("audits")]
    public async Task<ActionResult<Paged<AuditModel>>> GetAudits(int page, AuditKind kinds, SyncJobStatus? status, [FromQuery] string[] providers)
    {
        if (page < 1)
        {
            return BadRequest("'page' must be greater equals 1");
        }

        Dictionary<int, Models.SeriesModel?> seriesCache = new Dictionary<int, Models.SeriesModel?>();
        Dictionary<int, Models.SeasonModel?> seasonCache = new Dictionary<int, Models.SeasonModel?>();
        Dictionary<int, Models.EpisodeModel?> episodeCache = new Dictionary<int, Models.EpisodeModel?>();

        List<AuditModel> audits = new List<AuditModel>();
        int totalRunning = 0;
        int totalQueued = 0;
        int totalCompleted = 0;
        int totalFailed = 0;

        void CountStatus(SyncJobStatus status)
        {
            switch (status)
            {
                case SyncJobStatus.Queued:
                    totalQueued++;
                    return;
                case SyncJobStatus.Processing:
                    totalRunning++;
                    return;
                case SyncJobStatus.Completed:
                    totalCompleted++;
                    return;
                case SyncJobStatus.Failed:
                    totalFailed++;
                    return;
                default:
                    throw new ArgumentOutOfRangeException(nameof(status), status, null);
            }
        }

        foreach (string provider in _providerService.GetProviders())
        {
            if (providers.Length > 0 && !providers.Contains(provider))
            {
                continue;
            }

            _providerService.SetActiveProvider(provider);

            if (kinds.HasFlag(AuditKind.Catalog))
            {
                foreach (SyncCatalogJobModel job in await _catalogSyncService.GetSyncJobs())
                {
                    CountStatus(job.Status);
                    audits.Add(new AuditModel
                    {
                        JobId = job.SyncCatalogJobId,
                        Kind = AuditKind.Catalog,
                        JobName = "Syncing catalog",
                        Provider = provider,
                        Status = job.Status,
                        StartedAt = job.Started,
                        FinishedAt = job.Completed,
                        Error = job.Error,
                        Expires = null
                    });
                }
            }

            if (kinds.HasFlag(AuditKind.Series))
            {
                foreach (SyncSeriesJobModel job in await _seriesSyncService.GetSyncJobs())
                {
                    if (!seriesCache.TryGetValue(job.SeriesId, out Models.SeriesModel? series))
                    {
                        series = await _seriesService.GetSeries(job.SeriesId);
                        seriesCache[job.SeriesId] = series;
                    }

                    if (series is null)
                    {
                        continue;
                    }

                    CountStatus(job.Status);
                    audits.Add(new AuditModel
                    {
                        JobId = job.SyncSeriesJobId,
                        Kind = AuditKind.Series,
                        JobName = $"Syncing series '{series.Title}'",
                        Provider = provider,
                        Status = job.Status,
                        StartedAt = job.Started,
                        FinishedAt = job.Completed,
                        Error = job.Error,
                        Expires = null
                    });
                }
            }

            if (kinds.HasFlag(AuditKind.Provider))
            {
                foreach (SyncProviderJobModel job in await _providerSyncService.GetSyncJobs())
                {
                    if (!episodeCache.TryGetValue(job.EpisodeId, out Models.EpisodeModel? episode))
                    {
                        episode = await _episodeService.GetEpisode(job.EpisodeId);
                        episodeCache[job.EpisodeId] = episode;
                    }

                    if (episode is null)
                    {
                        continue;
                    }

                    if (!seasonCache.TryGetValue(episode.SeasonId, out Models.SeasonModel? season))
                    {
                        season = await _seasonService.GetSeason(episode.SeasonId);
                        seasonCache[episode.SeasonId] = season;
                    }

                    if (season is null)
                    {
                        continue;
                    }

                    if (seriesCache.TryGetValue(season.SeriesId, out Models.SeriesModel? series))
                    {
                        series = await _seriesService.GetSeries(season.SeriesId);
                        seriesCache[season.SeriesId] = series;
                    }

                    if (series is null)
                    {
                        continue;
                    }

                    CountStatus(job.Status);
                    audits.Add(new AuditModel
                    {
                        JobId = job.SyncProviderJobId,
                        Kind = AuditKind.Provider,
                        JobName = $"Syncing providers '{series.Title}' S{season.SeasonNumber}E{episode.EpisodeNumber}",
                        Provider = provider,
                        Status = job.Status,
                        StartedAt = job.Started,
                        FinishedAt = job.Completed,
                        Error = job.Error,
                        Expires = job.Expires
                    });
                }
            }
        }

        audits.Sort((a, b) => a.StartedAt > b.StartedAt
            ? -1
            : 1
        );

        IEnumerable<AuditModel> filterPipeline = audits;
        if (status is not null)
        {
            filterPipeline = filterPipeline.Where(audit => audit.Status == status);
        }

        List<AuditModel> filtered = filterPipeline.ToList();

        int count = Math.Min(filtered.Count - (page - 1) * 15, 15);

        return Ok(new Paged<AuditModel>
        {
            Items = filtered.GetRange((page - 1) * 15, count).ToArray(),
            Count = count,
            Start = page,
            Total = new TotalInformation
            {
                Items = filtered.Count,
                Running = totalRunning,
                Queued = totalQueued,
                Completed = totalCompleted,
                Failed = totalFailed
            }
        });
    }
}