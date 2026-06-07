using AniStream.Contracts;
using AniStream.Services;
using AniStream.Shared;
using AniStream.Worker.Services;

namespace AniStream.Worker;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        AppConfig.Initialize();
        
        HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);
        builder.Services.AddHostedService<SyncWorker>();

        SetupDependencyInjection(builder);
        
        IHost host = builder.Build();
        await host.RunAsync();
    }

    private static void SetupDependencyInjection(HostApplicationBuilder builder)
    {
        // Proprietary services
        builder.Services.AddScoped<ICredentialsService, CredentialsServiceImpl>();

        // BL Layer
        AutoLoader.LoadServices(builder.Services, new AutoLoader.Options
        {
            DatabaseDriver = AppConfig.CurrentConfig.DatabaseDriver,
            MigrationPath = AppConfig.CurrentConfig.MigrationPath,
            DatabaseMetadataConnectionString = AppConfig.CurrentConfig.DatabaseMetadataConnectionString,
            DatabaseProfileConnectionString = AppConfig.CurrentConfig.DatabaseProfileConnectionString,
            AssetsPath = AppConfig.CurrentConfig.AssetsPath
        });
    }
}