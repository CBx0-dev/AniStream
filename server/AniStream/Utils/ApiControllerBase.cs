
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Utils;

public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult Unauthorized(string message)
    {
        return Problem(
            title: "Unauthorized",
            detail: message,
            statusCode: StatusCodes.Status401Unauthorized
        );
    }
}