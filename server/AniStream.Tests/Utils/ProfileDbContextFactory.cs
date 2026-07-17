using AniStream.Contexts;
using AniStream.Utils;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Tests.Utils;

internal class ProfileDbContextFactory : DbContextFactory<ProfileDbContext>
{
    private readonly SqliteConnection _connection;
    private readonly DbContextOptions<ProfileDbContext> _options;
    private bool _migrated;

    public ProfileDbContextFactory(string migrationFolder) : base("sqlite", migrationFolder, "profile")
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        DbContextOptionsBuilder<ProfileDbContext> builder = new DbContextOptionsBuilder<ProfileDbContext>();
        builder.UseSqlite(_connection);

        _options = builder.Options;
        _migrated = false;
    }

    public override async Task<ProfileDbContext> GetContext()
    {
        ProfileDbContext context = new ProfileDbContext(_options);

        if (!_migrated)
        {
            await MigrateDatabaseIfRequired(context);
            _migrated = true;
        }

        return context;
    }
}