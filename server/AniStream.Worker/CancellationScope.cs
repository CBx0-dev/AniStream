namespace AniStream.Worker;

internal sealed class CancellationScope<T>
{
    private readonly T[] _snapshot;
    private readonly Func<T[], Task> _callback;
    private readonly CancellationToken _cancellationToken;

    private  bool _executedCallback;

    public CancellationScope(T[] snapshot, Func<T[], Task> callback, CancellationToken cancellationToken)
    {
        _snapshot = snapshot;
        _callback = callback;
        _cancellationToken = cancellationToken;
        
        _executedCallback = false;
    }

    public async Task<bool> IsCancelledAsync()
    {
        if (!_cancellationToken.IsCancellationRequested)
        {
            return false;
        }

        _executedCallback = true;
        
        await _callback(_snapshot);
        return true;
    }
}