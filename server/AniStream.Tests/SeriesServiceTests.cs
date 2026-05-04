using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class SeriesServiceTests : TestBase
{
    private readonly ISeriesService _seriesService;
    private readonly IGenreService _genreService;

    public SeriesServiceTests()
    {
        _seriesService = GetService<ISeriesService>();
        _genreService = GetService<IGenreService>();
    }

    [Fact]
    public async Task CreateSeries()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        Assert.Equal(1, series.SeriesId);
        Assert.Equal("A Seris", series.Title);
        Assert.Equal("Desc", series.Description);
        Assert.Null(series.PreviewImage);
    }

    [Fact]
    public async Task GetSeriesById()
    {
        SeriesModel created = await _seriesService.CreateSeries("g-a", "Alpha Show", "", null);

        SeriesModel? series = await _seriesService.GetSeries(created.SeriesId);

        Assert.NotNull(series);
        Assert.Equal(created.SeriesId, series!.SeriesId);
    }

    [Fact]
    public async Task GetSeriesByGuid()
    {
        SeriesModel created = await _seriesService.CreateSeries("g-a", "Alpha Show", "", null);

        SeriesModel? series = await _seriesService.GetSeries(created.Guid);

        Assert.NotNull(series);
        Assert.Equal(created.SeriesId, series!.SeriesId);
    }

    [Fact]
    public async Task GetSeriesByIds()
    {
        SeriesModel alpha = await _seriesService.CreateSeries("g-a", "Alpha Show", "", null);
        await _seriesService.CreateSeries("g-b", "Beta Show", "", null);
        SeriesModel gamma = await _seriesService.CreateSeries("g-c", "Gamma", "", null);

        SeriesModel[] series = await _seriesService.GetSeriesByIds([alpha.SeriesId, gamma.SeriesId]);

        Assert.Equal(["Alpha Show", "Gamma"], series.OrderBy(s => s.Title).Select(s => s.Title).ToArray());
    }

    [Fact]
    public async Task GetSeriesChunk()
    {
        SeriesModel alpha = await _seriesService.CreateSeries("g-a", "Alpha Show", "", null);
        await _seriesService.CreateSeries("g-b", "Beta Show", "", null);
        SeriesModel gamma = await _seriesService.CreateSeries("g-c", "Gamma", "", null);
        GenreModel adventure = await _genreService.CreateGenre("adventure");
        await _genreService.CreateGenreToSeries(adventure.GenreId, alpha.SeriesId, true);
        await _genreService.CreateGenreToSeries(adventure.GenreId, gamma.SeriesId, false);

        SeriesModel[] filtered = await _seriesService.GetSeriesChunk(0, 10, "a", [adventure.GenreId]);
        SeriesModel[] paged = await _seriesService.GetSeriesChunk(1, 1, null, null);

        Assert.Equal(["Alpha Show", "Gamma"], filtered.Select(s => s.Title).ToArray());
        Assert.Single(paged);
        Assert.Equal("Beta Show", paged[0].Title);
    }

    [Fact]
    public async Task GetStartedSeries_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _seriesService.GetStartedSeries());
    }
}