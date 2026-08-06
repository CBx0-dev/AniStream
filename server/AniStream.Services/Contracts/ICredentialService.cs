using AniStream.Models;

namespace AniStream.Contracts;

public interface ICredentialsService
{
    public Task<ProfileModel?> ValidateCredentials(string uuid, string password);

    public Task<string> GetCurrentUuid();

    public void HashPassword(string password, out string hash, out string salt);
}