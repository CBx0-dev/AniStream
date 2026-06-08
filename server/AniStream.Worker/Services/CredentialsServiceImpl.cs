using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.Worker.Services;

internal sealed class CredentialsServiceImpl : ICredentialsService
{
    public Task<ProfileModel?> ValidateCredentials(string uuid, string password)
    {
        throw new NotSupportedException();
    }

    public Task<string> GetCurrentUuid()
    {
        throw new NotSupportedException();
    }
}