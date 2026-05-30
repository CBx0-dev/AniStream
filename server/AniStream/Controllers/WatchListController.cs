using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/watchlist")]
[ApiController]
[Authorize]
public sealed class WatchListController : ApiControllerBase
{
    private readonly IWatchListService _watchListService;

    public WatchListController(IWatchListService watchListService)
    {
        _watchListService = watchListService;
    }

    [HttpGet("series")]
    public async Task<ActionResult<int[]>> GetSeries()
    {
        return await _watchListService.GetSeriesIds();
    }

    [HttpGet("series/{seriesId}")]
    public async Task<IActionResult> SeriesOnList(int seriesId)
    {
        if (await _watchListService.IsSeriesOnList(seriesId))
        {
            return Ok($"Series '{seriesId}' is on the watchlist");
        }

        return NotFound($"Series '{seriesId}' is not on the watchlist");
    }

    [HttpPost("series/{seriesId}")]
    public async Task<IActionResult> AddSeries(int seriesId)
    {
        await _watchListService.AddSeries(seriesId);
        return Ok($"Series '{seriesId}' added to the watchlist");
    }

    [HttpDelete("series/{seriesId}")]
    public async Task<IActionResult> RemoveSeries(int seriesId)
    {
        await _watchListService.RemoveSeries(seriesId);
        return Ok($"Series '{seriesId}' removed from the watchlist");
    }
}