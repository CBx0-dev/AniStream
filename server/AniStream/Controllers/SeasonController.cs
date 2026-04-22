using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("{provider}/seasons")]
[ApiController]
[Authorize]
public class SeasonController : ApiControllerBase
{
    private readonly ISeasonService _seasonService;

    public SeasonController(ISeasonService seasonService)
    {
        _seasonService = seasonService;
    }

    [HttpGet("{seasonId}")]
    public async Task<ActionResult<SeasonModel>> GetSeason(int seasonId)
    {
        Models.SeasonModel? season = await _seasonService.GetSeason(seasonId);
        if (season is null)
        {
            return NotFound($"Season with ID '{seasonId}' not found");
        }

        return Ok(season.ToDTO());
    }

    [HttpGet("series/{seriesId}")]
    public async Task<SeasonModel[]> GetSeasonsOfSeries(int seriesId)
    {
        Models.SeasonModel[] seasons = await _seasonService.GetSeasons(seriesId);
        return seasons.Select(season => season.ToDTO()).ToArray();
    }
}