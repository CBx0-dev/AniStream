namespace AniStream.Contracts;

public interface IProviderService
{
    public string GetActiveProvider();

    public void SetActiveProvider(string providerName);
}