using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Services;

public sealed class AutoLoader
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

        services.AddScoped<DbContextFactory<MetadataDbContext>>(sp => {
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
        services.AddScoped<ISeriesService, SeriesSerivceImpl>();
        services.AddScoped<ISeasonService, SeasonServiceImpl>();
        services.AddScoped<IEpisodeService, EpisodeServiceImpl>();
    }

    public struct Options
    {
        public string DatabaseDriver;

        public string MigrationPath;

        public string DatabaseProfileConnectionString;

        public string DatabaseMetadataConnectionString;
    }
}