using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using AniStream.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EpisodeModel = AniStream.API.DTO.EpisodeModel;

namespace AniStream.API.Controllers;

[Route("api/{provider}/episodes")]
[ApiController]
[Authorize]
public sealed class EpisodeController : ApiControllerBase
{
    private readonly IEpisodeService _episodeService;
    private readonly IProviderSyncService _syncService;

    public EpisodeController(IEpisodeService episodeService, IProviderSyncService syncService)
    {
        _episodeService = episodeService;
        _syncService = syncService;
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

    [HttpGet("{episodeId}/providers")]
    public async Task<ActionResult<EpisodeSyncModel>> GetProviders(int episodeId)
    {
        Models.EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            return NotFound($"Episode with the ID '{episodeId}' not found");
        }

        SyncProviderJobResultModel[] results = await _syncService.GetSyncResults(episodeId);
        SyncProviderJobModel? job = await _syncService.GetSyncJobByEpisode(episode);

        SyncJobStatus? status = job?.Status ?? null;

        if (results.Length == 0 && status != SyncJobStatus.Queued)
        {
            await _syncService.RequestSync(episode);
            status = SyncJobStatus.Queued;
        }
        
        return Ok(new EpisodeSyncModel
        {
            Status = status,
            Providers = results.Select(result => new EpisodeProviderModel
            {
                Name = result.Provider,
                Url = result.Url,
                LanguageCode = result.LanguageCode
            }).ToArray()
        });
    }
}