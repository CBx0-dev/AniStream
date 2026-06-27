using System.Security.Cryptography;
using System.Text;
using AniStream.Contracts;
using AniStream.Models;
using Konscious.Security.Cryptography;

namespace AniStream.API.Serivces;

public sealed class CredentialsService : ICredentialsService
{
    private readonly IUserService _userService;
    private readonly IHttpContextAccessor _context;

    public CredentialsService(IUserService userService, IHttpContextAccessor context)
    {
        _userService = userService;
        _context = context;
    }

    public async Task<ProfileModel?> ValidateCredentials(string uuid, string password)
    {
        ProfileModel? profile = await _userService.GetProfile(uuid);
        if (profile is null)
        {
            return null;
        }

        if (!VerifyPassword(password, profile.Password, profile.PasswordSalt))
        {
            return null;
        }

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

    private bool VerifyPassword(string input, string passwordB64, string saltB64)
    {
        if (input.Length == 0)
        {
            return false;
        }
        
        byte[] salt = Convert.FromBase64String(saltB64);
        byte[] password = Convert.FromBase64String(passwordB64);

        Argon2id argon2 = new Argon2id(Encoding.UTF8.GetBytes(input))
        {
            Salt = salt,
            DegreeOfParallelism = 4,
            MemorySize = 1024 * 1024,
            Iterations = 3
        };

        byte[] computedHash = argon2.GetBytes(32);

        return CryptographicOperations.FixedTimeEquals(computedHash, password);
    }
}