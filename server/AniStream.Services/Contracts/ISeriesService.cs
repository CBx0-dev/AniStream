using AniStream.Models;

namespace AniStream.Contracts;

public interface ISeriesService
{
    public Task<SeriesModel?> GetSeries(int seriesId);

    public Task<SeriesModel?> GetSeries(string guid);

    public Task<SeriesModel> CreateSeries(
        string guid,
        string title,
        string description,
        string? previewImage
    );

    public Task<SeriesModel[]> GetSeriesChunk(
        int offset,
        int limit,
        string? searchText,
        int[]? genreIds
    );

    public Task<SeriesModel[]> GetStartedSeries();

    public Task<SeriesModel[]> GetSeriesByIds(int[] seriesIds);
}