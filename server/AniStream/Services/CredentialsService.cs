using AniStream.Contracts;

namespace AniStream.API.Serivces;

public sealed class CredentialsService : ICredentialsService
{
    private readonly IUserService _userService;

    public CredentialsService(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<bool> ValidateCredentials(string username, string password)
    {
        ProfileModel? profile = await _userService.GetProfileByUsernameOrDefault(username);
        if (profile is null)
        {
            return false;
        }

        // TODO check password
        return true;
    }
}