using AniStream.Contracts;

namespace AniStream.Services;

public sealed class ResourceServiceImpl : IResourceService
{
    public static string? AssetsPath = null;

    private readonly IProviderService _providerService;

    public ResourceServiceImpl(IProviderService providerService)
    {
        _providerService = providerService;
    }

    public Stream? GetResource(string hash)
    {
        if (AssetsPath is null)
        {
            throw new InvalidOperationException("Assets path is not set.");
        }

        string provider = _providerService.GetActiveProvider();

        string path = Path.Combine(AssetsPath, provider, hash);
        if (!File.Exists(path))
        {
            return null;
        }

        return File.OpenRead(path);
    }
}