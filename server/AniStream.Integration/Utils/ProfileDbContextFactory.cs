using AniStream.Contexts;
using AniStream.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Integration.Utils;

public sealed class ProfileDbContextFactory : DbContextFactory<ProfileDbContext>
{
    private readonly IHttpContextAccessor _http;
    private readonly TestingSessionStore _store;

    public ProfileDbContextFactory(
        string migrationPath,
        IHttpContextAccessor http,
        TestingSessionStore store
    ) : base("sqlite", migrationPath, "profile")
    {
        _http = http;
        _store = store;
    }

    public override async Task<ProfileDbContext> GetContext()
    {
        string? testingId = _http.HttpContext?.Items[TestingMiddleware.ITEM_KEY] as string;

        if (testingId is null)
        {
            throw new Exception("Missing testing ID");
        }

        TestingSession session = _store.GetOrCreate(testingId);

        DbContextOptionsBuilder<ProfileDbContext> builder = new DbContextOptionsBuilder<ProfileDbContext>();
        builder.UseSqlite(session.ProfileConnection);

        ProfileDbContext context = new ProfileDbContext(builder.Options);

        if (session.ClaimProfileMigration())
        {
            await MigrateDatabaseIfRequired(context);
        }

        return context;
    }
}