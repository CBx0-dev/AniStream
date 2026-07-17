using AniStream.Models;

namespace AniStream.Contracts;

public interface IEpisodeService
{
    public Task<EpisodeModel?> GetEpisode(int episodeId);

    public Task<EpisodeModel[]> GetEpisodes(int seasonId);

    public Task<EpisodeModel> CreateEpisode(
        int seasonId,
        int episodeNumber,
        string germanTitle,
        string englishTitle,
        string description
    );

    public Task<EpisodeModel> UpdateEpisode(
        int episodeId,
        int? seasonId = null,
        int? episodeNumber = null,
        string? germanTitle = null,
        string? englishTitle = null,
        string? description = null  
    );

    public Task<EpisodeModel> UpdateEpisode(
        EpisodeModel episode,
        int? seasonId = null,
        int? episodeNumber = null,
        string? germanTitle = null,
        string? englishTitle = null,
        string? description = null  
    );

}
