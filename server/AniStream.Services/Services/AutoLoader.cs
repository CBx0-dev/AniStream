using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Services;

public static class AutoLoader
{
    public static void LoadServices(IServiceCollection services, Options options)
    {
        services.AddScoped<DbContextFactory<ProfileDbContext>>(_ =>
            new ProfileDbContextFactory(
                options.DatabaseDriver,
                options.MigrationPath,
                options.DatabaseProfileConnectionString
            )
        );

        services.AddScoped<DbContextFactory<MetadataDbContext>>(sp =>
        {
            IProviderService providerService = sp.GetRequiredService<IProviderService>();

            return new MetadataDbContextFactory(
                options.DatabaseDriver,
                options.MigrationPath,
                options.DatabaseMetadataConnectionString,
                providerService
            );
        });

        services.AddScoped<IProviderService, ProviderServiceImpl>();

        services.AddScoped<IUserService, UserServiceImpl>();
        services.AddScoped<IListService, ListServiceImpl>();
        services.AddScoped<IGenreService, GenreServiceImpl>();
        services.AddScoped<ISeriesService, SeriesServiceImpl>();
        services.AddScoped<ISeasonService, SeasonServiceImpl>();
        services.AddScoped<IEpisodeService, EpisodeServiceImpl>();
        services.AddScoped<IResourceService, ResourceServiceImpl>();
        services.AddScoped<IWatchListService, WatchListServiceImpl>();
        services.AddScoped<IWatchTimeService, WatchTimeServiceImpl>();
        services.AddScoped<ISeriesSyncService, SeriesSyncServiceImpl>();
        services.AddScoped<IProviderSyncService, ProviderSyncServiceImpl>();
        
        ResourceServiceImpl.AssetsPath = options.AssetsPath;
    }

    public struct Options
    {
        public string DatabaseDriver;

        public string AssetsPath;

        public string MigrationPath;

        public string DatabaseProfileConnectionString;

        public string DatabaseMetadataConnectionString;
    }
}