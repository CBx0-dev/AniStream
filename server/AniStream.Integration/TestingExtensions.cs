using AniStream.Contexts;
using AniStream.Integration.Utils;
using AniStream.Services;
using AniStream.Utils;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AniStream.Integration;

public static class TestingExtensions
{
    public static WebApplicationBuilder AddTestingMode(
        this WebApplicationBuilder builder,
        AutoLoader.Options options
    )
    {
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddSingleton<TestingSessionStore>();

        builder.Services.Replace(ServiceDescriptor.Scoped<DbContextFactory<MetadataDbContext>>(sp =>
            new MetadataDbContextFactory(
                options.MigrationPath,
                sp.GetRequiredService<IHttpContextAccessor>(),
                sp.GetRequiredService<TestingSessionStore>()
            )
        ));

        builder.Services.Replace(ServiceDescriptor.Scoped<DbContextFactory<ProfileDbContext>>(sp =>
            new ProfileDbContextFactory(
                options.MigrationPath,
                sp.GetRequiredService<IHttpContextAccessor>(),
                sp.GetRequiredService<TestingSessionStore>()
            )
        ));

        return builder;
    }
}