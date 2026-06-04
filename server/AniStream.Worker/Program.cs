using AniStream.Services;
using AniStream.Shared;

namespace AniStream.Worker;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);
        builder.Services.AddHostedService<SyncWorker>();


        IHost host = builder.Build();
        await host.RunAsync();
    }

    private static void SetupDependencyInjection(HostApplicationBuilder builder)
    {
        // Proprietary services


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