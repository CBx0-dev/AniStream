using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/catalog")]
[ApiController]
[Authorize(Roles = Roles.Dashboard)]
public sealed class CatalogController : ApiControllerBase
{
    private readonly ICatalogSyncService _catalogSyncService;

    public CatalogController(ICatalogSyncService catalogSyncService)
    {
        _catalogSyncService = catalogSyncService;
    }
    
    [HttpPost]
    [Authorize(Roles = Roles.Dashboard)]
    public async Task<IActionResult> SyncCatalog()
    {
        await _catalogSyncService.RequestSync();
        return Ok("Sync job queued");
    }
}