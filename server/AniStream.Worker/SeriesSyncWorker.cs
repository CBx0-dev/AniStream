using AniStream.Contracts;
using AniStream.Models;
using AniStream.Worker.Jobs;

namespace AniStream.Worker;

internal sealed class SeriesSyncWorker : BackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(10);

    private readonly ILogger<SeriesSyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ISyncService _syncService;

    private readonly SeriesSyncJob _job;

    public SeriesSyncWorker(
        ILogger<SeriesSyncWorker> logger,
        IProviderService providerService,
        ISyncService syncService,
        ISeriesService seriesService,
        ISeasonService seasonService,
        IEpisodeService episodeService
    )
    {
        _logger = logger;
        _providerService = providerService;
        _syncService = syncService;

        _job = new SeriesSyncJob(providerService, seriesService, seasonService, episodeService);
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
            await Task.Delay(PollInterval, cancellationToken);
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

            CancellationScope<SyncJobModel> scope = new CancellationScope<SyncJobModel>(await _syncService.GetSyncJobs(SyncJobStatus.Queued), async jobs =>
            {
                foreach (SyncJobModel job in jobs.Where(job => job.Status == SyncJobStatus.Processing))
                {
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Queued);
                }
            }, cancellationToken);

            foreach (SyncJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);
            }

            foreach (SyncJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                try
                {
                    await _job.SyncSeriesAsync(job);
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
}