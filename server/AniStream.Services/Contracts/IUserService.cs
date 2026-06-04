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

    public Task<ProfileModel?> GetProfileByUsername(string username);

    public Task<ProfileModel?> GetProfile(string uuid);

    public Task<ProfileModel?> GetProfile(int profileId);

    public Task<ProfileModel> UpdateProfile(
        int profileId,
        string? name = null,
        string? backgroundColor = null,
        string? eye = null,
        string? mouth = null,
        string? theme = null,
        string? lang = null,
        bool? tosAccepted = null,
        bool? syncCatalog = null
    );

    public Task<ProfileModel> UpdateProfile(
        ProfileModel profile,
        string? name = null,
        string? backgroundColor = null,
        string? eye = null,
        string? mouth = null,
        string? theme = null,
        string? lang = null,
        bool? tosAccepted = null,
        bool? syncCatalog = null
    );
}