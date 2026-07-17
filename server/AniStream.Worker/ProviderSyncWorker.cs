using AniStream.Contracts;
using AniStream.Models;
using AniStream.Worker.Jobs;

namespace AniStream.Worker;

public sealed class ProviderSyncWorker : ScopedBackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(5);

    private readonly ILogger<ProviderSyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly IProviderSyncService _syncService;

    private readonly ProviderSyncJob _job;

    public ProviderSyncWorker(IServiceScopeFactory scopeFactory) : base(scopeFactory)
    {
        _logger = GetRequiredService<ILogger<ProviderSyncWorker>>();
        _providerService = GetRequiredService<IProviderService>();
        _syncService = GetRequiredService<IProviderSyncService>();

        ILoggerFactory loggerFactory = GetRequiredService<ILoggerFactory>();
        ISeriesService seriesService = GetRequiredService<ISeriesService>();
        ISeasonService seasonService = GetRequiredService<ISeasonService>();
        IEpisodeService episodeService = GetRequiredService<IEpisodeService>();
        IProviderSyncService syncService = GetRequiredService<IProviderSyncService>();

        _job = new ProviderSyncJob(loggerFactory, _providerService, seriesService, seasonService, episodeService, syncService);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Provider sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogInformation("Provider sync worker running at: {Time}", DateTimeOffset.Now);

            try
            {
                await ProcessPendingTasksAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during sync pickup");
            }

            _logger.LogInformation("Provider sync worker completed run at: {Time}", DateTimeOffset.Now);
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

            SyncProviderJobModel[] jobs = await _syncService.GetSyncJobs(SyncJobStatus.Queued);
            if (jobs.Length == 0)
            {
                continue;
            }

            _logger.LogInformation("Found {Count} jobs for provider {Provider}", jobs.Length, provider);

            CancellationScope<SyncProviderJobModel> scope = new CancellationScope<SyncProviderJobModel>(jobs, async jobs =>
            {
                foreach (SyncProviderJobModel job in jobs.Where(job => job.Status == SyncJobStatus.Processing))
                {
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Queued);
                }
            }, cancellationToken);

            foreach (SyncProviderJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);
            }

            foreach (SyncProviderJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                try
                {
                    await _job.SyncEpisodeProviderAsync(job);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Completed, DateTime.UtcNow, DateTime.UtcNow.AddDays(1));
                }
                catch (Exception e)
                {
                    List<string> messages = new List<string>();

                    Exception? ex = e;

                    while (ex is not null)
                    {
                        messages.Add(ex.Message);
                        ex = ex.InnerException;
                    }

                    string message = string.Join("\n", messages);
                    _logger.LogError(e, "Provider sync failed for job {Job}", job.SyncProviderJobId);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Failed, DateTime.UtcNow, error: message);
                }
            }
        }
    }
}