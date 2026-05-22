using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/episodes")]
[ApiController]
[Authorize]
public sealed class EpisodeController : ApiControllerBase
{
    private readonly IEpisodeService _episodeService;

    public EpisodeController(IEpisodeService episodeService)
    {
        _episodeService = episodeService;
    }

#if TESTING_ENABLED
    [HttpPost]
    public async Task<ActionResult<EpisodeModel>> CreateEpisode([FromBody] EpisodeCreateModel data)
    {
        Models.EpisodeModel episode = await _episodeService.CreateEpisode(
            data.SeasonId,
            data.EpisodeNumber,
            data.GermanTitle,
            data.EnglishTitle,
            data.Description
        );

        return Ok(episode.ToDTO());
    }
#endif

    [HttpGet("{episodeId}")]
    public async Task<ActionResult<EpisodeModel>> GetEpisode(int episodeId)
    {
        Models.EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            return NotFound($"Episode with the ID '{episodeId}' not found");
        }

        return Ok(episode.ToDTO());
    }

#if TESTING_ENABLED
    [HttpPut("{episodeId}")]
    public async Task<ActionResult<EpisodeModel>> UpdateEpisode(int episodeId, [FromBody] EpisodeUpdateModel data)
    {
        Models.EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            return NotFound($"Episode with ID '{episodeId}' not found");
        }

        await _episodeService.UpdateEpisode(episode, germanTitle: data.GermanTitle, englishTitle: data.EnglishTitle, description: data.Description);

        return Ok(episode.ToDTO());
    }
#endif

    [HttpGet("season/{seasonId}")]
    public async Task<ActionResult<EpisodeModel[]>> GetEpisodes(int seasonId)
    {
        Models.EpisodeModel[] episodes = await _episodeService.GetEpisodes(seasonId);

        return episodes.Select(episode => episode.ToDTO()).ToArray();
    }
}