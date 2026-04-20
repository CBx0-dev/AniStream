namespace AniStream.Contracts;

public interface ICredentialsService
{
    public Task<bool> ValidateCredentials(string username, string password);
}