using AniStream.Contracts;

namespace AniStream.API.Serivces;

public sealed class CredentialsService : ICredentialsService
{
    public bool ValidateCredentials(string username, string password)
    {
        // TODO connect with EF
        if (username == "admin" && password == "admin")
        {
            return true;
        }

        return false;
    }
}