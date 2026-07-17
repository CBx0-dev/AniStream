using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/series")]
[ApiController]
[Authorize]
public class SeriesController : ApiControllerBase
{
    private readonly ISeriesService _seriesService;
    private readonly ISeriesSyncService _syncService;

    public SeriesController(ISeriesService seriesService, ISeriesSyncService syncService)
    {
        _seriesService = seriesService;
        _syncService = syncService;
    }

#if TESTING_ENABLED
    [HttpPost]
    public async Task<SeriesModel> CreateSeries([FromBody] SeriesCreateModel data)
    {
        Models.SeriesModel series = await _seriesService.CreateSeries(
            data.Guid,
            data.Title,
            data.Description,
            data.PreviewImage
        );

        return series.ToDTO();
    }
#endif

    [HttpGet("{seriesId}")]
    public async Task<ActionResult<SeriesModel>> GetSeries(int seriesId)
    {
        Models.SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            return NotFound($"Series with ID '{seriesId}' not found");
        }

        return series.ToDTO();
    }

    [HttpGet("{seriesId}/sync")]
    public async Task<IActionResult> GetSeriesSync(int seriesId)
    {
        Models.SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            return NotFound($"Series with ID '{seriesId}' not found");
        }

        bool requiresSync = await _seriesService.RequiresSync(seriesId);
        Models.SyncSeriesJobModel? job = await _syncService.GetSyncJobBySeries(series);

        return Ok(new SeriesSyncModel
        {
            RequiresSync = requiresSync,
            Status = job?.Status ?? null
        });
    }

    [HttpPost("{seriesId}/sync")]
    public async Task<ActionResult<SeriesSyncModel>> SyncSeries(int seriesId)
    {
        Models.SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            return NotFound($"Series with ID '{seriesId}' not found");
        }

        await _syncService.RequestSync(series);
        return Ok("Sync successfully queued");
    }

    [HttpPost("chunk")]
    public async Task<SeriesModel[]> GetSeriesChunk([FromBody] SeriesFilterModel options)
    {
        Models.SeriesModel[] series = await _seriesService.GetSeriesChunk(options.Offset, options.Limit, options.SearchText, options.GenreIds);
        return series.Select(series => series.ToDTO()).ToArray();
    }

    [HttpGet]
    public async Task<ActionResult<SeriesModel[]>> GetSeriesByIds([FromQuery] int[] seriesIds)
    {
        Models.SeriesModel[] series = await _seriesService.GetSeriesByIds(seriesIds);

        return series.Select(series => series.ToDTO()).ToArray();
    }

    [HttpGet("guid/{guid}")]
    public async Task<ActionResult<SeriesModel>> GetSeries(string guid)
    {
        Models.SeriesModel? series = await _seriesService.GetSeries(guid);
        if (series is null)
        {
            return NotFound($"Series with GUID '{guid}' not found");
        }

        return series.ToDTO();
    }

    [HttpGet("started")]
    public async Task<ActionResult<SeriesModel[]>> GetStartedSeries()
    {
        Models.SeriesModel[] series = await _seriesService.GetStartedSeries();

        return series.Select(series => series.ToDTO()).ToArray();
    }
}