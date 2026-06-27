using AniStream.Contracts;
using AniStream.Models;
using AniStream.Worker.Jobs;

namespace AniStream.Worker;

internal sealed class SeriesSyncWorker : ScopedBackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(10);

    private readonly ILogger<SeriesSyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ISeriesSyncService _syncService;

    private readonly SeriesSyncJob _job;

    public SeriesSyncWorker(IServiceScopeFactory scopeFactory) : base(scopeFactory)
    {
        _logger = GetRequiredService<ILogger<SeriesSyncWorker>>();
        _providerService = GetRequiredService<IProviderService>();
        _syncService = GetRequiredService<ISeriesSyncService>();

        ILoggerFactory loggerFactory = GetRequiredService<ILoggerFactory>();
        ISeriesService seriesService = GetRequiredService<ISeriesService>();
        ISeasonService seasonService = GetRequiredService<ISeasonService>();
        IEpisodeService episodeService = GetRequiredService<IEpisodeService>();

        _job = new SeriesSyncJob(loggerFactory, _providerService, seriesService, seasonService, episodeService);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Series sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogInformation("Series sync worker running at: {Time}", DateTimeOffset.Now);

            try
            {
                await ProcessPendingTasksAsync(cancellationToken);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error during sync pickup");
            }

            _logger.LogInformation("Series sync worker completed run at: {Time}", DateTimeOffset.Now);
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

            SyncSeriesJobModel[] jobs = await _syncService.GetSyncJobs(SyncJobStatus.Queued);
            if (jobs.Length == 0)
            {
                continue;
            }

            _logger.LogInformation("Found {Count} queued jobs for provider {Provider}", jobs.Length, provider);

            CancellationScope<SyncSeriesJobModel> scope = new CancellationScope<SyncSeriesJobModel>(jobs, async jobs =>
            {
                foreach (SyncSeriesJobModel job in jobs.Where(job => job.Status == SyncJobStatus.Processing))
                {
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Queued);
                }
            }, cancellationToken);

            foreach (SyncSeriesJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);
            }

            foreach (SyncSeriesJobModel job in jobs)
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

                    _logger.LogError(e, "Series sync failed for job {Job}", job.SyncSeriesJobId);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Failed, DateTime.UtcNow, message);
                }
            }
        }
    }
}