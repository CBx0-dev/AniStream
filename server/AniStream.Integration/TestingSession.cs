using Microsoft.Data.Sqlite;

namespace AniStream.Integration;

public sealed class TestingSession : IDisposable
{
    public readonly SqliteConnection MetadataConnection;
    public readonly SqliteConnection ProfileConnection;

    private int _metadataMigrated;
    private int _profileMigrated;

    public TestingSession()
    {
        MetadataConnection = new SqliteConnection("DataSource=:memory:");
        MetadataConnection.Open();

        ProfileConnection = new SqliteConnection("DataSource=:memory:");
        ProfileConnection.Open();
    }

    public bool ClaimMetadataMigration() => Interlocked.Exchange(ref _metadataMigrated, 1) == 0;
    public bool ClaimProfileMigration() => Interlocked.Exchange(ref _profileMigrated, 1) == 0;

    public void Dispose()
    {
        MetadataConnection.Dispose();
        ProfileConnection.Dispose();
    }
}