using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class SeasonServiceTests : TestBase
{
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;

    public SeasonServiceTests()
    {
        _seriesService = GetService<ISeriesService>();
        _seasonService = GetService<ISeasonService>();
    }

    [Fact]
    public async Task CreateSeason()
    {
        SeriesModel series = await _seriesService.CreateSeries("g-ep", "Episodes", "Desc", null);
        Assert.Equal(1, series.SeriesId);

        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        Assert.Equal(1, season.SeasonId);
        Assert.Equal(series.SeriesId, season.SeriesId);
        Assert.Equal(1, season.SeasonNumber);
    }


    [Fact]
    public async Task GetSeasons()
    {
        SeriesModel series = await _seriesService.CreateSeries("g-ep", "Episodes", "Desc", null);
        await _seasonService.CreateSeason(series.SeriesId, 1);

        SeasonModel[] bySeriesId = await _seasonService.GetSeasons(series.SeriesId);

        Assert.Single(bySeriesId);
        Assert.Equal(1, bySeriesId[0].SeasonId);
        Assert.Equal(1, bySeriesId[0].SeasonNumber);
    }

    [Fact]
    public async Task GetSeason()
    {
        SeriesModel series = await _seriesService.CreateSeries("g-ep", "Episodes", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);

        SeasonModel? byId = await _seasonService.GetSeason(season.SeasonId);

        Assert.NotNull(byId);
        Assert.Equal(season.SeasonId, byId.SeasonId);
        Assert.Equal(season.SeasonNumber, byId.SeasonNumber);
    }
}