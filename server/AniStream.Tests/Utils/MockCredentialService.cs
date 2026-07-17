using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.Tests.Utils;

public sealed class MockCredentialService : ICredentialsService
{
    public const string MOCK_UUID = "test-tenant-id";

    public Task<ProfileModel?> ValidateCredentials(string username, string password)
    {
        throw new NotImplementedException();
    }

    public Task<string> GetCurrentUuid()
    {
        return Task.FromResult(MOCK_UUID);
    }
}
