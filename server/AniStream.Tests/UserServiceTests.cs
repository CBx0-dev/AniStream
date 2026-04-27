using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class UserServiceTests : TestBase
{
    private readonly IUserService _userService;

    public UserServiceTests()
    {
        _userService = GetService<IUserService>();
    }

    [Fact]
    public async Task CreateProfile()
    {
        Guid johnGuid = Guid.NewGuid();
        ProfileModel john = await _userService.CreateProfile(johnGuid.ToString(), "john", "fff", "eye-1", "mouth-1", "dark", "en", true, false);

        Assert.Equal(1, john.ProfileId);
        Assert.Equal("john", john.Name);
    }

    [Fact]
    public async Task GetProfiles()
    {
        Guid johnGuid = Guid.NewGuid();
        Guid janeGuid = Guid.NewGuid();
        await _userService.CreateProfile(johnGuid.ToString(), "john", "fff", "eye-1", "mouth-1", "dark", "en", true, false);
        await _userService.CreateProfile(janeGuid.ToString(), "jane", "000", "eye-2", "mouth-2", "light", "de", true, true);

        ProfileModel[] profiles = await _userService.GetProfiles();

        Assert.Equal(2, profiles.Length);
    }

    [Fact]
    public async Task GetProfileByName()
    {
        Guid johnGuid = Guid.NewGuid();
        Guid janeGuid = Guid.NewGuid();
        await _userService.CreateProfile(johnGuid.ToString(), "john", "fff", "eye-1", "mouth-1", "dark", "en", true, false);
        await _userService.CreateProfile(janeGuid.ToString(), "jane", "000", "eye-2", "mouth-2", "light", "de", true, true);

        ProfileModel? profileByName = await _userService.GetProfile("jane");

        Assert.NotNull(profileByName);
        Assert.Equal("jane", profileByName!.Name);
    }

    [Fact]
    public async Task GetProfileById()
    {
        Guid johnGuid = Guid.NewGuid();
        ProfileModel john = await _userService.CreateProfile(johnGuid.ToString(), "john", "fff", "eye-1", "mouth-1", "dark", "en", true, false);

        ProfileModel? profileById = await _userService.GetProfile(john.ProfileId);

        Assert.NotNull(profileById);
        Assert.Equal("john", profileById!.Name);
    }

    [Fact]
    public async Task GetActiveProfile_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _userService.GetActiveProfile());
    }
}