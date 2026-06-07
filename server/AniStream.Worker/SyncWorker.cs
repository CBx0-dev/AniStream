using AniStream.Contracts;
using AniStream.Models;
using AniStream.Shared;
using AniStream.Worker.Sidecar;

namespace AniStream.Worker;

internal sealed class SyncWorker : BackgroundService
{
    private static readonly TimeSpan _pollInterval = TimeSpan.FromSeconds(30);

    private readonly ILogger<SyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ISyncService _syncService;
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;

    private readonly Sidecar.Worker _worker;

    public SyncWorker(ILogger<SyncWorker> logger, IProviderService providerService, ISyncService syncService, ISeriesService seriesService,
        ISeasonService seasonService, IEpisodeService episodeService)
    {
        _logger = logger;
        _providerService = providerService;
        _syncService = syncService;
        _seriesService = seriesService;
        _seasonService = seasonService;
        _episodeService = episodeService;

        _worker = new Sidecar.Worker(AppConfig.CurrentConfig.SidecarPath);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogInformation("Sync worker running at: {Time}", DateTimeOffset.Now);

            try
            {
                await ProcessPendingTasksAsync(cancellationToken);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error during sync pickup");
            }

            _logger.LogInformation("Sync worker completed run at: {Time}", DateTimeOffset.Now);
            await Task.Delay(_pollInterval, cancellationToken);
        }
    }

    private async Task ProcessPendingTasksAsync(CancellationToken cancellationToken)
    {
        foreach (string provider in _providerService.GetProviders())
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }

            _providerService.SetActiveProvider(provider);

            SyncJobModel[] jobs = await _syncService.GetSyncJobs(SyncJobStatus.Queued);
            if (jobs.Length == 0)
            {
                continue;
            }

            _logger.LogInformation("Found {Count} queued jobs for provider {Provider}", jobs.Length, provider);

            State state = new State(_syncService, await _syncService.GetSyncJobs(SyncJobStatus.Queued), cancellationToken);

            foreach (SyncJobModel job in jobs)
            {
                if (await state.IsCancelledAsync())
                {
                    return;
                }

                await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);
            }

            foreach (SyncJobModel job in jobs)
            {
                if (await state.IsCancelledAsync())
                {
                    return;
                }

                try
                {
                    await PerformJobAsync(job, state);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Completed, DateTime.UtcNow);
                }
                catch (Exception e)
                {
                    List<string> messages = new List<string>();

                    Exception? ex = e;
                    
                    while (ex is not null)
                    {
                        messages.Add(e.Message);
                        ex = ex.InnerException;
                    }

                    string message = string.Join("\n", messages);
                    
                    _logger.LogError(e, "Sync failed for job {job}", job.SyncJobId);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Failed, DateTime.UtcNow, message);
                }
            }
        }
    }

    private async Task PerformJobAsync(SyncJobModel job, State state)
    {
        SeriesModel? series = await _seriesService.GetSeries(job.SeriesId);

        if (series is null)
        {
            throw new InvalidOperationException($"Series with id {job.SeriesId} does not exist");
        }

        SeasonModel[] existingSeasons = await _seasonService.GetSeasons(job.SeriesId);
        SeasonDto[] allSeasons = await _worker.SeasonsAsync(_providerService.GetActiveProvider(), series.Guid);

        foreach (SeasonDto season in allSeasons)
        {
            SeasonModel? existingSeason = existingSeasons.FirstOrDefault(s => s.SeasonNumber == season.SeasonNumber);
            EpisodeDto[] episodes = await _worker.EpisodesAsync(_providerService.GetActiveProvider(), series.Guid, season.SeasonNumber);

            if (existingSeason is null)
            {
                await SyncNewSeasonAsync(series.SeriesId, season.SeasonNumber, episodes);
            }
            else
            {
                await SyncExistingSeasonAsync(existingSeason, episodes);
            }
        }
    }

    private async Task SyncExistingSeasonAsync(SeasonModel season, EpisodeDto[] episodes)
    {
        EpisodeModel[] existingEpisodes = await _episodeService.GetEpisodes(season.SeasonId);

        foreach (EpisodeDto episode in episodes)
        {
            EpisodeModel? existingEpisode = existingEpisodes.FirstOrDefault(s => s.EpisodeNumber == episode.EpisodeNumber);
            if (existingEpisode is null)
            {
                await _episodeService.CreateEpisode(
                    season.SeasonId,
                    episode.EpisodeNumber,
                    episode.GermanTitle,
                    episode.EnglishTitle,
                    episode.Description
                );
                continue;
            }

            await _episodeService.UpdateEpisode(
                existingEpisode.EpisodeId,
                germanTitle: episode.GermanTitle,
                englishTitle: episode.EnglishTitle,
                description: episode.Description
            );
        }
    }

    private async Task SyncNewSeasonAsync(int seriesId, int seasonNumber, EpisodeDto[] episodes)
    {
        SeasonModel season = await _seasonService.CreateSeason(seriesId, seasonNumber);

        foreach (EpisodeDto episode in episodes)
        {
            await _episodeService.CreateEpisode(
                season.SeasonId,
                episode.EpisodeNumber,
                episode.GermanTitle,
                episode.EnglishTitle,
                episode.Description
            );
        }
    }

    private class State
    {
        private readonly ISyncService _syncService;

        private readonly SyncJobModel[] _jobs;
        private readonly CancellationToken _cancellationToken;

        public State(ISyncService syncService, SyncJobModel[] jobs, CancellationToken cancellationToken)
        {
            _syncService = syncService;
            _jobs = jobs;
            _cancellationToken = cancellationToken;
        }

        public async Task<bool> IsCancelledAsync()
        {
            if (!_cancellationToken.IsCancellationRequested)
            {
                return false;
            }

            foreach (SyncJobModel job in _jobs.Where(job => job.Status == SyncJobStatus.Processing))
            {
                await _syncService.UpdateSyncJob(job, SyncJobStatus.Queued);
            }

            return true;
        }
    }
}