using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Contexts;

public sealed class MetadataDbContext : DbContext
{
    public MetadataDbContext(DbContextOptions<MetadataDbContext> options) : base(options)
    {
    }
}

public sealed class MetadataDbContextFactory : DbContextFactory<MetadataDbContext>
{
    private readonly string _connectionString;

    public MetadataDbContextFactory(string dbType, string migrationFolder, string connectionString) : base(dbType, migrationFolder, "metadata")
    {
        _connectionString = connectionString;
    }

    public async Task<MetadataDbContext> GetContext(string providerName)
    {
        string actualConnString = String.Format(_connectionString, providerName);

        DbContextOptionsBuilder<MetadataDbContext> builder = new DbContextOptionsBuilder<MetadataDbContext>();
        UseDbVariant(builder, actualConnString);

        MetadataDbContext context = new MetadataDbContext(builder.Options);
        await MigrateDatabaseIfRequired(context);

        return context;
    }
}