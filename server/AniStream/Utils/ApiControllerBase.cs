
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Utils;

public abstract class ApiControllerBase : ControllerBase
{
    public ObjectResult Ok(string message)
    {
        return Ok(new
        {
            message
        });
    }

    protected ObjectResult Unauthorized(string message)
    {
        return Problem(
            title: "Unauthorized",
            detail: message,
            statusCode: StatusCodes.Status401Unauthorized
        );
    }

    protected ObjectResult NotFound(string message)
    {
        return Problem(
            title: "Not found",
            detail: message,
            statusCode: StatusCodes.Status404NotFound
        );
    }

    
}