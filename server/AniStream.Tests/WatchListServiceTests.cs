using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class WatchListServiceTests : TestBase
{
    private readonly IWatchListService _watchListService;
    private readonly ISeriesService _seriesService;

    public WatchListServiceTests()
    {
        _watchListService = GetService<IWatchListService>();
        _seriesService = GetService<ISeriesService>();
    }

    [Fact]
    public async Task AddSeriesToWatchList()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "Description", null);

        await _watchListService.AddSeries(series.SeriesId);

        bool isOnList = await _watchListService.IsSeriesOnList(series.SeriesId);
        Assert.True(isOnList);
    }

    [Fact]
    public async Task RemoveSeriesFromWatchList()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "Description", null);
        await _watchListService.AddSeries(series.SeriesId);

        await _watchListService.RemoveSeries(series.SeriesId);

        bool isOnList = await _watchListService.IsSeriesOnList(series.SeriesId);
        Assert.False(isOnList);
    }

    [Fact]
    public async Task GetSeriesIds()
    {
        SeriesModel series1 = await _seriesService.CreateSeries("series-1", "Series 1", "", null);
        SeriesModel series2 = await _seriesService.CreateSeries("series-2", "Series 2", "", null);

        await _watchListService.AddSeries(series1.SeriesId);
        await _watchListService.AddSeries(series2.SeriesId);

        int[] seriesIds = await _watchListService.GetSeriesIds();

        Assert.Contains(series1.SeriesId, seriesIds);
        Assert.Contains(series2.SeriesId, seriesIds);
        Assert.Equal(2, seriesIds.Length);
    }

    [Fact]
    public async Task IsSeriesOnList()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "Description", null);

        bool isOnList = await _watchListService.IsSeriesOnList(series.SeriesId);
        Assert.False(isOnList);

        await _watchListService.AddSeries(series.SeriesId);

        isOnList = await _watchListService.IsSeriesOnList(series.SeriesId);
        Assert.True(isOnList);
    }
}