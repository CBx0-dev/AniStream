using AniStream.Contracts;
using AniStream.Models;
using AniStream.Shared;
using AniStream.Worker.Sidecars;

namespace AniStream.Worker.Jobs;

public sealed class ProviderSyncJob
{
    private readonly IProviderService _providerService;
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;
    private readonly IProviderSyncService _syncService;
    

    private readonly WorkerClient _worker;

    public ProviderSyncJob(
        ILoggerFactory loggerFactory,
        IProviderService providerService,
        ISeriesService seriesService,
        ISeasonService seasonService,
        IEpisodeService episodeService,
        IProviderSyncService syncService
    )
    {
        _providerService = providerService;
        _seriesService = seriesService;
        _seasonService = seasonService;
        _episodeService = episodeService;
        _syncService = syncService;

        _worker = new WorkerClient(loggerFactory.CreateLogger<WorkerClient>(), AppConfig.CurrentConfig.SidecarPath);
    }

    public async Task SyncEpisodeProviderAsync(SyncProviderJobModel job)
    {
        EpisodeModel? episode = await _episodeService.GetEpisode(job.EpisodeId);
        if (episode is null)
        {
            throw new InvalidOperationException($"Episode with ID {job.EpisodeId} does not exist");
        }

        SeasonModel? season = await _seasonService.GetSeason(episode.SeasonId);
        if (season is null)
        {
            throw new InvalidOperationException($"Season with ID {episode.SeasonId} does not exist");
        }

        SeriesModel? series = await _seriesService.GetSeries(season.SeriesId);
        if (series is null)
        {
            throw new InvalidOperationException($"Series with ID {season.SeriesId} does not exist");
        }
        
        ProviderFetchModel[] providers = await _worker.ProvidersAsync(_providerService.GetActiveProvider(), series.Guid, season.SeasonNumber, episode.EpisodeNumber);
        foreach (ProviderFetchModel provider in providers)
        {
            await _syncService.CreateSyncResult(job.SyncProviderJobId, provider.Name, provider.EmbeddedUrl, (int)provider.Language);
        }
    }
}