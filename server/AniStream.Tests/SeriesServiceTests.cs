using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;
using AniStream.Utils;

namespace AniStream.Tests;

public sealed class SeriesServiceTests : TestBase
{
    private readonly ISeriesService _seriesService;
    private readonly IGenreService _genreService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;

    public SeriesServiceTests()
    {
        _seriesService = GetService<ISeriesService>();
        _genreService = GetService<IGenreService>();
        _seasonService = GetService<ISeasonService>();
        _episodeService = GetService<IEpisodeService>();
        _dbFactory = GetService<DbContextFactory<MetadataDbContext>>();
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
        Assert.Equal(created.SeriesId, series.SeriesId);
    }

    [Fact]
    public async Task GetSeriesByGuid()
    {
        SeriesModel created = await _seriesService.CreateSeries("g-a", "Alpha Show", "", null);

        SeriesModel? series = await _seriesService.GetSeries(created.Guid);

        Assert.NotNull(series);
        Assert.Equal(created.SeriesId, series.SeriesId);
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
    public async Task GetStartedSeries()
    {
        // Series A: Started (One episode 50%, one 0%) -> Should be returned
        SeriesModel seriesA = await _seriesService.CreateSeries("series-a", "Series A", "", null);

        await using (MetadataDbContext db = await _dbFactory.GetContext())
        {
            SeasonModel seasonA = new SeasonModel(seriesA.SeriesId, 1);
            db.Seasons.Add(seasonA);
            await db.SaveChangesAsync();
            
            EpisodeModel epA1 = new EpisodeModel(1, seasonA.SeasonId, "A1", "A1", "");
            EpisodeModel epA2 = new EpisodeModel(2, seasonA.SeasonId, "A2", "A2", "");
            db.Episodes.AddRange(epA1, epA2);
            await db.SaveChangesAsync();

            // Series B: Finished (All episodes > 80%) -> Should NOT be returned
            SeriesModel seriesB = new SeriesModel("series-b", "Series B", "", null);
            db.Series.Add(seriesB);
            await db.SaveChangesAsync();
            SeasonModel seasonB = new SeasonModel(seriesB.SeriesId, 1);
            db.Seasons.Add(seasonB);
            await db.SaveChangesAsync();
            EpisodeModel epB1 = new EpisodeModel(1, seasonB.SeasonId, "B1", "B1", "");
            EpisodeModel epB2 = new EpisodeModel(2, seasonB.SeasonId, "B2", "B2", "");
            db.Episodes.AddRange(epB1, epB2);
            await db.SaveChangesAsync();

            // Series C: Not started (All episodes 0%) -> Should NOT be returned
            SeriesModel seriesC = new SeriesModel("series-c", "Series C", "", null);
            db.Series.Add(seriesC);
            await db.SaveChangesAsync();
            SeasonModel seasonC = new SeasonModel(seriesC.SeriesId, 1);
            db.Seasons.Add(seasonC);
            await db.SaveChangesAsync();
            EpisodeModel epC1 = new EpisodeModel(1, seasonC.SeasonId, "C1", "C1", "");
            db.Episodes.Add(epC1);
            await db.SaveChangesAsync();

            // Series D: Special case -> Should NOT be returned
            SeriesModel seriesD = new SeriesModel("series-d", "Series D", "", null);
            db.Series.Add(seriesD);
            await db.SaveChangesAsync();
            SeasonModel seasonD = new SeasonModel(seriesD.SeriesId, 0);
            db.Seasons.Add(seasonD);
            await db.SaveChangesAsync();
            EpisodeModel epD1 = new EpisodeModel(1, seasonD.SeasonId, "D1", "D1", "");
            db.Episodes.Add(epD1);
            await db.SaveChangesAsync();

            // Seed WatchTimes
            db.WatchTimes.AddRange(
                new WatchTimeModel(epA1.EpisodeId, 50, 100, MockCredentialService.MOCK_UUID),
                new WatchTimeModel(epA2.EpisodeId, 0, 0, MockCredentialService.MOCK_UUID),
                new WatchTimeModel(epB1.EpisodeId, 90, 200, MockCredentialService.MOCK_UUID),
                new WatchTimeModel(epB2.EpisodeId, 85, 190, MockCredentialService.MOCK_UUID),
                new WatchTimeModel(epC1.EpisodeId, 0, 0, MockCredentialService.MOCK_UUID),
                new WatchTimeModel(epD1.EpisodeId, 50, 100, MockCredentialService.MOCK_UUID)
            );
            await db.SaveChangesAsync();
        }

        SeriesModel[] started = await _seriesService.GetStartedSeries();

        Assert.Single(started);
        Assert.Equal(seriesA.SeriesId, started[0].SeriesId);
    }
}