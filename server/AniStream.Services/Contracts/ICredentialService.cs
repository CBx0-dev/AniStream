using AniStream.Models;

namespace AniStream.Contracts;

public interface ICredentialsService
{
    public Task<ProfileModel?> ValidateCredentials(string username, string password);

    public Task<string> GetCurrentUuid();
}