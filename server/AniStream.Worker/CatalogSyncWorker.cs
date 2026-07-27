using AniStream.Contracts;
using AniStream.Models;
using AniStream.Worker.Jobs;

namespace AniStream.Worker;

internal sealed class CatalogSyncWorker : ScopedBackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromMinutes(1);

    private readonly ILogger<CatalogSyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ICatalogSyncService _syncService;

    private readonly CatalogSyncJob _job;

    public CatalogSyncWorker(IServiceScopeFactory scopeFactory) : base(scopeFactory)
    {
        _logger = GetRequiredService<ILogger<CatalogSyncWorker>>();
        _providerService = GetRequiredService<IProviderService>();
        _syncService = GetRequiredService<ICatalogSyncService>();

        ILoggerFactory loggerFactory = GetRequiredService<ILoggerFactory>();
        ISeriesService seriesService = GetRequiredService<ISeriesService>();
        IGenreService genreService = GetRequiredService<IGenreService>();
        
        _job = new CatalogSyncJob(loggerFactory, _providerService, seriesService, genreService);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Catalog sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogInformation("Catalog sync worker running at: {Time}", DateTimeOffset.Now);

            try
            {
                await ProcessPendingTaskAsync(cancellationToken);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error during sync pickup");
            }
            
            _logger.LogInformation("Catalog sync worker completed run at: {Time}", DateTimeOffset.Now);
            await Task.Delay(PollInterval, cancellationToken);
        }
    }

    private async Task ProcessPendingTaskAsync(CancellationToken cancellationToken)
    {
        foreach (string provider in _providerService.GetProviders())
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            
            _providerService.SetActiveProvider(provider);

            SyncCatalogJobModel[] jobs = await _syncService.GetSyncJobs(SyncJobStatus.Queued);
            if (jobs.Length == 0)
            {
                continue;
            }
            
            _logger.LogInformation("Found {Count} queued jobs for provider {Provider}", jobs.Length, provider);

            CancellationScope<SyncCatalogJobModel> scope = new CancellationScope<SyncCatalogJobModel>(jobs, async jobs =>
            {
                foreach (SyncCatalogJobModel job in jobs)
                {
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Queued);
                }
            }, cancellationToken);

            foreach (SyncCatalogJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);
            }

            foreach (SyncCatalogJobModel job in jobs)
            {
                if (await scope.IsCancelledAsync())
                {
                    return;
                }

                try
                {
                    await _job.SyncCatalogAsync(job);
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
                    
                    _logger.LogError(e, "Catalog sync failed for job {Job}", job.SyncCatalogJobId);
                    await _syncService.UpdateSyncJob(job, SyncJobStatus.Failed, DateTime.UtcNow, message);
                }
            }
        }
    }
}