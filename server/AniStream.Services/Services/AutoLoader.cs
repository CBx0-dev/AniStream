using AniStream.Contexts;
using AniStream.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Services;

public sealed class AutoLoader
{
    public static void LoadServices(IServiceCollection services, Options options)
    {
        services.AddScoped(sp =>
            new ProfileDbContextFactory(
                options.DatabaseDriver,
                options.MigrationPath,
                options.DatabaseProfileConnectionString
            )
        );
        services.AddScoped(sp => {
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
        services.AddScoped<IGenreService, GenreServiceImpl>();
    }

    public struct Options
    {
        public string DatabaseDriver;

        public string MigrationPath;

        public string DatabaseProfileConnectionString;

        public string DatabaseMetadataConnectionString;
    }
}