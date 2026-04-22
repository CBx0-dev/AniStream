using AniStream.Contracts;

namespace AniStream.Services;

public sealed class ProviderServiceImpl : IProviderService
{
    public string? _providerName = null;

    public string GetActiveProvider()
    {
        if (_providerName is null)
        {
            throw new Exception("Active provider is not set. Did you forget to set it?");
        }

        return _providerName;
    }

    public void SetActiveProvider(string providerName)
    {
        // TODO maybe resolve dynamic
        if (providerName != "aniworld" && providerName != "sto")
        {
            throw new ArgumentException($"Invalid provider name '{providerName}'", nameof(providerName));
        }

        _providerName = providerName;
    }
}