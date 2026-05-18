using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("/api/profiles")]
[ApiController]
[Authorize]
public sealed class ProfileController : ApiControllerBase
{
    private readonly IUserService _userService;

    public ProfileController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ProfileModel[]>> GetProfiles()
    {
        Models.ProfileModel[] profiles = await _userService.GetProfiles();

        return profiles.Select(profile => profile.ToDTO()).ToArray();
    }

    [HttpGet("{profileId}")]
    [Authorize]
    public async Task<ActionResult<ProfileModel>> GetProfile(int profileId)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(profileId);
        if (profile is null)
        {
            return NotFound($"Profile with ID '{profileId}' not found");
        }

        return Ok(profile.ToDTO());
    }

    [HttpGet("{uuid}/uuid")]
    [Authorize]
    public async Task<ActionResult<ProfileModel>> GetProfile(string uuid)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(uuid);
        if (profile is null)
        {
            return NotFound($"Profile with UUID '{uuid}' not found");
        }

        return Ok(profile.ToDTO());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProfileModel>> CreateProfile([FromBody] ProfileCreateModel data)
    {
        string uuid = Guid.NewGuid().ToString();

        Models.ProfileModel profileModel = await _userService.CreateProfile(
            uuid,
            data.Name,
            data.BackgroundColor,
            data.Eye,
            data.Mouth,
            data.Theme,
            data.Lang,
            false,
            false
        );

        return profileModel.ToDTO();
    }
}