using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Services;
using AniStream.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Tests.Utils;

public abstract class TestBase : IDisposable
{
    private readonly ServiceCollection _services;
    private readonly ServiceProvider _provider;

    private readonly IServiceScope _scope;

    public TestBase(bool setProvider = true)
    {
        // TODO resolve dynamically
        const string MIGRATION_PATH = "/home/christoph/Documents/Workbench/rust/AniStream/migration";
        _services = new ServiceCollection();

        AutoLoader.LoadServices(_services, new AutoLoader.Options
        {
            DatabaseDriver = "sqlite",
            MigrationPath = MIGRATION_PATH,
            DatabaseMetadataConnectionString = "DataSource=:memory:",
            DatabaseProfileConnectionString = "DataSource=:memory:"
        });

        // Overwrite DB handlers so that each Fact uses one DB-Connection
        _services.AddScoped<DbContextFactory<MetadataDbContext>>(_ => new MetadataDbContextFactory(MIGRATION_PATH));
        _services.AddScoped<DbContextFactory<ProfileDbContext>>(_ => new ProfileDbContextFactory(MIGRATION_PATH));

        // TODO inject credentials service mock
        _provider = _services.BuildServiceProvider();
        _scope = _provider.CreateScope();

        if (setProvider)
        {
            IProviderService providerService = GetService<IProviderService>();
            providerService.SetActiveProvider("sto");
        }
    }

    protected T GetService<T>() where T : class
    {
        return _scope.ServiceProvider.GetRequiredService<T>();
    }

    public void Dispose()
    {
        _scope.Dispose();
    }
}