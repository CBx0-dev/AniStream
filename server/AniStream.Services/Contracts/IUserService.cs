using AniStream.Models;

namespace AniStream.Contracts;

public interface IUserService
{
    public Task<ProfileModel> CreateProfile(
        string uuid,
        string name,
        string backgroundColor,
        string eye,
        string mouth,
        string theme,
        string lang,
        bool tosAccepted,
        bool syncCatalog
    );

    public Task<ProfileModel> GetActiveProfile();

    public Task<ProfileModel[]> GetProfiles();

    public Task<ProfileModel?> GetProfile(string username);

    public Task<ProfileModel?> GetProfile(int profileId);
}