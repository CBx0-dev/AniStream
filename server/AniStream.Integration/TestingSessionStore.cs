using System.Collections.Concurrent;

namespace AniStream.Integration;

public sealed class TestingSessionStore : IDisposable
{
    private readonly ConcurrentDictionary<string, TestingSession> _sessions;

    public TestingSession GetOrCreate(string testingId) => _sessions.GetOrAdd(testingId, _ => new TestingSession());

    public TestingSessionStore()
    {
        _sessions = new ConcurrentDictionary<string, TestingSession>();
    }

    public void Dispose()
    {
        foreach (TestingSession session in _sessions.Values)
        {
            session.Dispose();
        }
    }
}