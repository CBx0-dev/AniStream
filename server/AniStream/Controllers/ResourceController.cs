using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/resources")]
[ApiController]
[Authorize]
public sealed class ResourceController : ApiControllerBase
{
    private readonly IResourceService _resourceService;

    public ResourceController(IResourceService resourceService)
    {
        _resourceService = resourceService;
    }

    [HttpGet("{hash}")]
    public ActionResult<Stream> GetResource(string hash)
    {
        Stream? resource = _resourceService.GetResource(hash);
        if (resource is null)
        {
            return NotFound($"Resource with hash '{hash}' not found");
        }

        return File(resource, "application/octet-stream");
    }
}