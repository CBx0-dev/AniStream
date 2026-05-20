using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.API.Serivces;

public sealed class CredentialsService : ICredentialsService
{
    private readonly IUserService _userService;
    private readonly IHttpContextAccessor  _context;

    public CredentialsService(IUserService userService, IHttpContextAccessor  context)
    {
        _userService = userService;
        _context = context;
    }

    public async Task<ProfileModel?> ValidateCredentials(string username, string password)
    {
        ProfileModel? profile = await _userService.GetProfileByUsername(username);
        if (profile is null)
        {
            return null;
        }

        // TODO check password
        return profile;
    }

    public Task<string> GetCurrentUuid()
    {
        string? guid = _context.HttpContext?.User.Identity?.Name ?? null;
        if (guid is null)
        {
            return Task.FromException<string>(new Exception("Trying to access user in a non-authorized context"));
        }

        return Task.FromResult(guid);
    }
}