using AniStream.Contracts;
using AniStream.Models;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public class UserService : IUserService
{
    private AppDbContext _db;
    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public Task<ProfileModel> GetActiveProfile()
    {
        throw new NotImplementedException();
    }

    public async Task<ProfileModel[]> GetProfiles()
    {
        return _db.Profiles.ToArray();
    }
}