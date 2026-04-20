using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Contexts;

public sealed class ProfileDbContext : DbContext
{
    public ProfileDbContext(DbContextOptions<ProfileDbContext> options) : base(options)
    {
    }

    public DbSet<ProfileModel> Profiles { get; set; }
}

public sealed class ProfileDbContextFactory : DbContextFactory<ProfileDbContext>
{
    private readonly string _connectionString;

    public ProfileDbContextFactory(string dbType, string migrationFolder, string connectionString) : base(dbType, migrationFolder, "profile")
    {
        _connectionString = connectionString;
    }

    public async Task<ProfileDbContext> GetContext()
    {
        DbContextOptionsBuilder<ProfileDbContext> builder = new DbContextOptionsBuilder<ProfileDbContext>();
        UseDbVariant(builder, _connectionString);

        ProfileDbContext context = new ProfileDbContext(builder.Options);
        await MigrateDatabaseIfRequired(context);

        return context;
    }
}