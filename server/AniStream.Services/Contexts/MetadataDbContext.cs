using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Contexts;

public sealed class MetadataDbContext : DbContext
{
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Conventions.Add(_ => new SnakeCaseConvention());
    }

    public MetadataDbContext(DbContextOptions<MetadataDbContext> options) : base(options)
    {
    }

    public DbSet<GenreModel> Genres { get; set; }

    public DbSet<GenreToSeries> GenresToSeries { get; set; }

    public DbSet<SeriesModel> Series { get; set; }

    public DbSet<SeasonModel> Seasons { get; set; }

    public DbSet<EpisodeModel> Episodes { get; set; }
}

public sealed class MetadataDbContextFactory : DbContextFactory<MetadataDbContext>
{
    private readonly string _connectionString;
    private readonly IProviderService _providerService;

    public MetadataDbContextFactory(string dbType, string migrationFolder, string connectionString, IProviderService providerService) : base(dbType, migrationFolder, "metadata")
    {
        _connectionString = connectionString;
        _providerService = providerService;
    }

    public async Task<MetadataDbContext> GetContext()
    {
        string providerName = _providerService.GetActiveProvider();
        string actualConnString = String.Format(_connectionString, providerName);

        DbContextOptionsBuilder<MetadataDbContext> builder = new DbContextOptionsBuilder<MetadataDbContext>();
        UseDbVariant(builder, actualConnString);

        MetadataDbContext context = new MetadataDbContext(builder.Options);
        await MigrateDatabaseIfRequired(context);

        return context;
    }
}