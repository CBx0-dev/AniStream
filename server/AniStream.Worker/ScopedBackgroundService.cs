namespace AniStream.Worker;

public abstract class ScopedBackgroundService : BackgroundService
{
    private readonly IServiceScope _scope;

    protected ScopedBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scope = scopeFactory.CreateScope();
    }

    protected T GetRequiredService<T>() where T : notnull
    {
        return _scope.ServiceProvider.GetRequiredService<T>();
    }

    public override void Dispose()
    {
        _scope.Dispose();

        base.Dispose();
    }
}