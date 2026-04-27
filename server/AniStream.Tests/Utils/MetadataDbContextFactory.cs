using AniStream.Contexts;
using AniStream.Utils;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Tests.Utils;

internal class MetadataDbContextFactory : DbContextFactory<MetadataDbContext>
{
    private readonly SqliteConnection _connection;
    private readonly DbContextOptions<MetadataDbContext> _options;
    private bool _migrated;

    public MetadataDbContextFactory(string migrationFolder) : base("sqlite", migrationFolder, "metadata")
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        DbContextOptionsBuilder<MetadataDbContext> builder = new DbContextOptionsBuilder<MetadataDbContext>();
        builder.UseSqlite(_connection);

        _options = builder.Options;
        _migrated = false;
    }

    public override async Task<MetadataDbContext> GetContext()
    {
        MetadataDbContext context = new MetadataDbContext(_options);

        if (!_migrated)
        {
            await MigrateDatabaseIfRequired(context);
            _migrated = true;
        }

        return context;
    }
}