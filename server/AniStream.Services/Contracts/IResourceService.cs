namespace AniStream.Contracts;

public interface IResourceService
{
    public Stream? GetResource(string hash);
}