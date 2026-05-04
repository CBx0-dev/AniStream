using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public class UserServiceImpl : IUserService
{
    private readonly DbContextFactory<ProfileDbContext> _dbFactory;

    public UserServiceImpl(DbContextFactory<ProfileDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<ProfileModel> CreateProfile(
        string uuid,
        string name,
        string backgroundColor,
        string eye,
        string mouth,
        string theme,
        string lang,
        bool tosAccepted,
        bool syncCatalog
    )
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        ProfileModel profile = new ProfileModel(uuid, name, backgroundColor, eye, mouth, theme, lang, tosAccepted, syncCatalog);

        db.Profiles.Add(profile);
        await db.SaveChangesAsync();

        return profile;
    }

    public Task<ProfileModel> GetActiveProfile()
    {
        throw new NotImplementedException();
    }

    public async Task<ProfileModel[]> GetProfiles()
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        return db.Profiles.ToArray();
    }

    public async Task<ProfileModel?> GetProfile(string username)
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        IQueryable<ProfileModel> query = from profile in db.Profiles where profile.Name == username select profile;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ProfileModel?> GetProfile(int profileId)
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        IQueryable<ProfileModel> query = from profile in db.Profiles where profile.ProfileId == profileId select profile;
        return await query.FirstOrDefaultAsync();
    }
}