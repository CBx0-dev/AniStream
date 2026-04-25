using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public class UserServiceImpl : IUserService
{
    private readonly ProfileDbContextFactory _dbFactory;


    public UserServiceImpl(ProfileDbContextFactory dbFactory)
    {
        _dbFactory = dbFactory;
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