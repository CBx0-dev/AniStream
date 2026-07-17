namespace AniStream.Contracts;

public interface IWatchListService
{
    public Task<int[]> GetSeriesIds();

    public Task<bool> IsSeriesOnList(int seriesId);

    public Task AddSeries(int seriesId);

    public Task RemoveSeries(int seriesId);
}