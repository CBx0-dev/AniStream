namespace AniStream.Contracts;

public interface IInformationService
{
    public Task<BackendInformation> GetBackendUpdateInformation();

    public Task<string?> GetClientUpdateInformation();
}