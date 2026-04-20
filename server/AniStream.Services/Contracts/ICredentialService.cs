namespace AniStream.Contracts;

public interface ICredentialsService
{
    public bool ValidateCredentials(string username, string password);
}