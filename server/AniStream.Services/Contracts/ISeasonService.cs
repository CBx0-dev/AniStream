using AniStream.Models;

namespace AniStream.Contracts;

public interface ISeasonService
{
    public Task<SeasonModel?> GetSeason(int seasonId);

    public Task<SeasonModel[]> GetSeasons(int seriesId);

    public Task<SeasonModel> CreateSeason(int seriesId, int seasonNumber);
}