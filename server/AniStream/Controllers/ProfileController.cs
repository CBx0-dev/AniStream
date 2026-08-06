using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("/api/profiles")]
[ApiController]
[Authorize(Roles = Roles.Dashboard + "," + Roles.Client)]
public sealed class ProfileController : ApiControllerBase
{
    private readonly IUserService _userService;
    private readonly ICredentialsService _credentialService;

    public ProfileController(IUserService userService, ICredentialsService credentialService)
    {
        _userService = userService;
        _credentialService = credentialService;
    }

    [HttpGet]
    [Authorize(Roles = Roles.Dashboard)]
    public async Task<ActionResult<ProfileModel[]>> GetProfiles()
    {
        Models.ProfileModel[] profiles = await _userService.GetProfiles();

        return profiles.Select(profile => profile.ToDTO()).ToArray();
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<ActionResult<ProfilePublicModel[]>> GetProfilesPublic()
    {
        Models.ProfileModel[] profiles = await _userService.GetPublicProfiles();

        return profiles.Select(profile => profile.ToPublicDTO()).ToArray();
    }

    [HttpGet("{profileId}")]
    public async Task<ActionResult<ProfileModel>> GetProfile(int profileId)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(profileId);
        if (profile is null)
        {
            return NotFound($"Profile with ID '{profileId}' not found");
        }

        return Ok(profile.ToDTO());
    }

    [HttpPut("{profileId}")]
    public async Task<ActionResult<ProfileModel>> UpdateProfile(int profileId, [FromBody] ProfileUpdateModel data)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(profileId);
        if (profile is null)
        {
            return NotFound($"Profile with ID '{profileId}' not found");
        }

        bool? dashboardUser = null;
        bool? clientUser = null;

        if (HttpContext.User.IsInRole(Roles.Dashboard))
        {
            dashboardUser = data.DashboardUser;
            clientUser = data.ClientUser;
        }

        await _userService.UpdateProfile(
            profile,
            data.Name,
            data.BackgroundColor,
            data.Eye,
            data.Mouth,
            data.Theme,
            data.Lang,
            data.TosAccepted,
            dashboardUser,
            clientUser
        );

        return Ok(profile.ToDTO());
    }

    [HttpGet("{uuid}/uuid")]
    public async Task<ActionResult<ProfileModel>> GetProfile(string uuid)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(uuid);
        if (profile is null)
        {
            return NotFound($"Profile with UUID '{uuid}' not found");
        }

        return Ok(profile.ToDTO());
    }

    [HttpPut("{uuid}/uuid")]
    public async Task<ActionResult<ProfileModel>> UpdateProfile(string uuid, [FromBody] ProfileUpdateModel data)
    {
        Models.ProfileModel? profile = await _userService.GetProfile(uuid);
        if (profile is null)
        {
            return NotFound($"Profile with UUID '{uuid}' not found");
        }

        await _userService.UpdateProfile(
            profile,
            data.Name,
            data.BackgroundColor,
            data.Eye,
            data.Mouth,
            data.Theme,
            data.Lang,
            data.TosAccepted
        );

        return Ok(profile.ToDTO());
    }

    [HttpPost]
    [Authorize(Roles = Roles.Dashboard)]
    public async Task<ActionResult<ProfileModel>> CreateProfile([FromBody] ProfileCreateModel data)
    {
        string uuid = Guid.NewGuid().ToString();
        _credentialService.HashPassword(data.Password, out string hash, out string salt);

        Models.ProfileModel profileModel = await _userService.CreateProfile(
            uuid,
            data.Name,
            hash,
            salt,
            data.BackgroundColor,
            data.Eye,
            data.Mouth,
            data.Theme,
            data.Lang,
            false,
            data.DashboardUser,
            data.ClientUser
        );

        return profileModel.ToDTO();
    }
}