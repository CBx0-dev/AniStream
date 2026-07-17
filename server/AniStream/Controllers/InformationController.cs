using AniStream.API.DTO;
using AniStream.API.Utils;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/information")]
[ApiController]
public sealed class InformationController : ApiControllerBase
{
    [HttpGet]
    public InformationModel GetInformation()
    {
        return new InformationModel
        {
            MinVersion = Program.MinVersion,
            MaxVersion = Program.MaxVersion
        };
    }
}