using AniStream.Contracts;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class ProviderServiceTests : TestBase
{
    private readonly IProviderService _providerService;

    public ProviderServiceTests() : base(false)
    {
        _providerService = GetService<IProviderService>();
    }

    [Fact]
    public void RejectsGettingNotSetProvider()
    {
        Assert.Throws<Exception>(() => _providerService.GetActiveProvider());
    }

    [Fact]
    public void SetActiveProvider()
    {
        _providerService.SetActiveProvider("aniworld");

        Assert.Equal("aniworld", _providerService.GetActiveProvider());
    }

    [Fact]
    public void RejectsSettingInvalidProvider()
    {
        Assert.Throws<ArgumentException>(() => _providerService.SetActiveProvider("unknown"));
    }
}