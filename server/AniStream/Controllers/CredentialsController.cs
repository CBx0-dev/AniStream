using System.Security.Claims;
using AniStream.API.Models;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;


[Route("api/credentials")]
[ApiController]
public class CredentialsController : ApiControllerBase 
{
    public const string LOGIN_ROUTE = "/api/credentials/login";
    public const string LOGOUT_ROUTE = "/api/credentials/logout";

    private ICredentialsService _credentialsService;

    public CredentialsController(ICredentialsService credentialsService)
    {
        _credentialsService = credentialsService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel credentials)
    {
        if (!_credentialsService.ValidateCredentials(credentials.Username, credentials.Password))
        {
            return Unauthorized("Credentials are wrong");
        }

        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, credentials.Username),
        };
        ClaimsIdentity identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        return Ok();
    }

    [HttpGet("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok();
    }
}