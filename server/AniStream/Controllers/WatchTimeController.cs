using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/watchtime")]
[ApiController]
[Authorize]
public sealed class WatchTimeController : ApiControllerBase
{
    private readonly IWatchTimeService _watchTimeService;

    public WatchTimeController(IWatchTimeService watchTimeService)
    {
        _watchTimeService = watchTimeService;
    }

    [HttpPost]
    public async Task<ActionResult<WatchTimeModel>> CreateWatchTime(WatchTimeCreateModel data)
    {
        Models.WatchTimeModel watchtime = await _watchTimeService.CreateWatchTime(data.EpisodeId, data.PercentageWatched, data.StoppedTime);

        return Ok(watchtime.ToDTO());
    }

    [HttpGet("{watchtimeId}")]
    public async Task<ActionResult<WatchTimeModel>> GetWatchTime(int watchtimeId)
    {
        Models.WatchTimeModel? watchtime = await _watchTimeService.GetWatchTime(watchtimeId);
        if (watchtime is null)
        {
            return NotFound($"Watchtime with ID '{watchtimeId}' not found");
        }

        return Ok(watchtime.ToDTO());
    }

    [HttpPut("{watchtimeId}")]
    public async Task<ActionResult<WatchTimeModel>> UpdateWatchTime(int watchtimeId, WatchTimeUpdateModel data)
    {
        Models.WatchTimeModel? watchtime = await _watchTimeService.GetWatchTime(watchtimeId);
        if (watchtime is null)
        {
            return NotFound($"Watchtime with ID '{watchtimeId}' not found");
        }

        await _watchTimeService.UpdateWatchTime(watchtime, data.PercentageWatched, data.StoppedTime);

        return Ok(watchtime.ToDTO());
    }

    [HttpGet("{episodeId}/episode")]
    public async Task<ActionResult<WatchTimeModel>> GetWatchTimeOfEpisode(int episodeId)
    {
        Models.WatchTimeModel? watchtime = await _watchTimeService.GetWatchTimeOfEpisode(episodeId);
        if (watchtime is null)
        {
            return NotFound($"WatchTime of Episode with ID '{episodeId}' dont exist");
        }

        return Ok(watchtime.ToDTO());
    }

    [HttpPut("{episodeId}/episode")]
    public async Task<ActionResult<WatchTimeModel>> UpdateWatchTimeOfEpisode(int episodeId, WatchTimeUpdateModel data)
    {
        Models.WatchTimeModel? watchtime = await _watchTimeService.GetWatchTimeOfEpisode(episodeId);
        if (watchtime is null)
        {
            return NotFound($"WatchTime of Episode with ID '{episodeId}' dont exist");
        }

        await _watchTimeService.UpdateWatchTime(watchtime, data.PercentageWatched, data.StoppedTime);
        return Ok(watchtime.ToDTO());
    }

    [HttpPut("{seasonId}/season")]
    public async Task<IActionResult> UpdateWatchTimeOfSeason(int seasonId, WatchTimeUpdateModel data)
    {
        await _watchTimeService.UpdateWatchTimeOfSeason(seasonId, data.PercentageWatched, data.StoppedTime);
        return Ok("Watchtime of season updated successfully");
    }

    [HttpGet("{seriesId}/total")]
    public async Task<ActionResult<WatchTimeTotalModel>> GetTotalWatchTimeOfSeries(int seriesId)
    {
        int totalProgression = await _watchTimeService.GetTotalWatchProgression(seriesId);

        return Ok(new WatchTimeTotalModel
        {
            TotalProgression = totalProgression
        });
    }

    [HttpGet("{seriesId}/series")]
    public async Task<ActionResult<WatchTimeModel[]>> GetWatchTimeOfSeries(int seriesId)
    {
        Models.WatchTimeModel[] watchTimes = await _watchTimeService.GetWatchTimesOfSeries(seriesId);

        return Ok(watchTimes.Select(watchtime => watchtime.ToDTO()));
    }

    [HttpPut("{seriesId}/series")]
    public async Task<IActionResult> UpdateWatchTimeOfSeries(int seriesId, WatchTimeUpdateModel data)
    {
        await _watchTimeService.UpdateWatchTimeOfSeries(seriesId, data.PercentageWatched, data.StoppedTime);
        return Ok("Watchtime of series updated successfully");
    }
}