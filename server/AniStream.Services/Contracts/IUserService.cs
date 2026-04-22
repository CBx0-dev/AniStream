using AniStream.Models;

namespace AniStream.Contracts;

public interface IUserService
{
    public Task<ProfileModel> GetActiveProfile();

    public Task<ProfileModel[]> GetProfiles();

    public Task<ProfileModel?> GetProfileByUsernameOrDefault(string username);
}