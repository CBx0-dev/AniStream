using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.Worker;

internal sealed class SyncWorker : BackgroundService
{
    private static readonly TimeSpan _pollInterval = TimeSpan.FromSeconds(30);

    private readonly ILogger<SyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ISyncService _syncService;

    public SyncWorker(ILogger<SyncWorker> logger, IProviderService providerService, ISyncService syncService)
    {
        _logger = logger;
        _providerService = providerService;
        _syncService = syncService;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingTasksAsync(cancellationToken);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error during sync pickup");
            }

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
                    _logger.LogError(e, "Sync failed for job {job}", job.SyncJobId);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Failed, DateTime.UtcNow, e.Message);
                }
            }
        }
    }

    private async Task PerformJobAsync(SyncJobModel job, State state)
    {
        // TODO implement sync logic
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