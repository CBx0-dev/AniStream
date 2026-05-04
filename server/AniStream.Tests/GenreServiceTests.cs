using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class GenreServiceTests : TestBase
{
    private readonly IGenreService _genreService;
    private readonly ISeriesService _seriesService;

    public GenreServiceTests()
    {
        _genreService = GetService<IGenreService>();
        _seriesService = GetService<ISeriesService>();
    }

    [Fact]
    public async Task CreateGenre()
    {
        GenreModel genre = await _genreService.CreateGenre("action");

        Assert.Equal(1, genre.GenreId);
        Assert.Equal("action", genre.Key);
    }

    [Fact]
    public async Task CreateGenreToSeries()
    {
        SeriesModel series = await _seriesService.CreateSeries("s-1", "Series", "Description", null);
        GenreModel genre = await _genreService.CreateGenre("main");

        await _genreService.CreateGenreToSeries(genre.GenreId, series.SeriesId, true);

        GenreModel? mainGenre = await _genreService.GetMainGenreOfSeries(series.SeriesId);

        Assert.NotNull(mainGenre);
        Assert.Equal(genre.GenreId, mainGenre!.GenreId);
    }

    [Fact]
    public async Task GetGenres()
    {
        GenreModel genre = await _genreService.CreateGenre("action");

        GenreModel[] genres = await _genreService.GetGenres();

        Assert.Single(genres);
        Assert.Equal(genre.GenreId, genres[0].GenreId);
    }

    [Fact]
    public async Task GetGenreById()
    {
        GenreModel genre = await _genreService.CreateGenre("action");

        GenreModel? byId = await _genreService.GetGenre(genre.GenreId);

        Assert.NotNull(byId);
        Assert.Equal(genre.GenreId, byId!.GenreId);
    }

    [Fact]
    public async Task GetGenreByKey()
    {
        GenreModel genre = await _genreService.CreateGenre("action");

        GenreModel? byKey = await _genreService.GetGenre(genre.Key);

        Assert.NotNull(byKey);
        Assert.Equal(genre.Key, byKey!.Key);
    }

    [Fact]
    public async Task GetMainGenreOfSeries()
    {
        await InsertSeriesWithGenres();

        GenreModel? mainGenre = await _genreService.GetMainGenreOfSeries(1);

        Assert.NotNull(mainGenre);
        Assert.Equal(1, mainGenre.GenreId);
    }

    [Fact]
    public async Task GetNonMainGenresOfSeries()
    {
        await InsertSeriesWithGenres();

        GenreModel[] nonMainGenres = await _genreService.GetNonMainGenresOfSeries(1);

        Assert.Single(nonMainGenres);
        Assert.Equal(2, nonMainGenres[0].GenreId);
    }

    private async Task InsertSeriesWithGenres()
    {
        SeriesModel series = await _seriesService.CreateSeries("s-1", "Series", "Description", null);
        GenreModel main = await _genreService.CreateGenre("main");
        GenreModel side = await _genreService.CreateGenre("side");

        await _genreService.CreateGenreToSeries(main.GenreId, series.SeriesId, true);
        await _genreService.CreateGenreToSeries(side.GenreId, series.SeriesId, false);

        Assert.Equal(1, series.SeriesId);

        Assert.Equal(1, main.GenreId);
        Assert.Equal(2, side.GenreId);
    }
}