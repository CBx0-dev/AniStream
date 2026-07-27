using AniStream.Contracts;

namespace AniStream.Worker;

public sealed class MidnightSyncWorker : ScopedBackgroundService
{
    private readonly ILogger<MidnightSyncWorker> _logger;
    private readonly IProviderService _providerService;
    private readonly ICatalogSyncService _catalogSyncService;
    
    public MidnightSyncWorker(IServiceScopeFactory scopeFactory) : base(scopeFactory)
    {
        _logger = GetRequiredService<ILogger<MidnightSyncWorker>>();
        _providerService = GetRequiredService<IProviderService>();
        _catalogSyncService = GetRequiredService<ICatalogSyncService>();
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Midnight sync worker started");

        while (!cancellationToken.IsCancellationRequested)
        {
            DateTime now = DateTime.UtcNow;
            DateTime nextRun = now.Date.AddDays(1);
            TimeSpan delay = nextRun - now;
            
            _logger.LogInformation("Next run scheduled at {NextRun} UTC (in {Delay})", nextRun, delay);

            await Task.Delay(delay, cancellationToken);

            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            
            _logger.LogInformation("Midnight sync worker running at: {Time}", DateTimeOffset.Now);

            
            await ProcessPendingTasksAsync(cancellationToken);
            
            _logger.LogInformation("Midnight sync worker completed run at: {Time}", DateTimeOffset.Now);

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
            
            await _catalogSyncService.RequestSync();
        }
    }
}