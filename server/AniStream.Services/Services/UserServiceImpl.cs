using AniStream.Contexts;
using AniStream.Contracts;

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
        await using ProfileDbContext db = _dbFactory.GetContext();

        return db.Profiles.ToArray();
    }
}