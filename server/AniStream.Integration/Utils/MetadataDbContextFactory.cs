using AniStream.Contexts;
using AniStream.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Integration.Utils;

internal sealed class MetadataDbContextFactory : DbContextFactory<MetadataDbContext>
{
    private readonly IHttpContextAccessor _http;
    private readonly TestingSessionStore _store;

    public MetadataDbContextFactory(
        string migrationPath,
        IHttpContextAccessor http,
        TestingSessionStore store
    ) : base("sqlite", migrationPath, "metadata")
    {
        _http = http;
        _store = store;
    }

    public override async Task<MetadataDbContext> GetContext()
    {
        string? testingId = _http.HttpContext?.Items[TestingMiddleware.ITEM_KEY] as string;

        if (testingId is null)
        {
            throw new Exception("Missing testing ID");
        }

        TestingSession session = _store.GetOrCreate(testingId);

        DbContextOptionsBuilder<MetadataDbContext> builder = new DbContextOptionsBuilder<MetadataDbContext>();
        builder.UseSqlite(session.MetadataConnection);

        MetadataDbContext context = new MetadataDbContext(builder.Options);

        if (session.ClaimMetadataMigration())
        {
            await MigrateDatabaseIfRequired(context);
        }

        return context;
    }
}