using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class EpisodeServiceTests : TestBase
{
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;

    public EpisodeServiceTests()
    {
        _seriesService = GetService<ISeriesService>();
        _seasonService = GetService<ISeasonService>();
        _episodeService = GetService<IEpisodeService>();
    }

    [Fact]
    public async Task CreateEpisode()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);

        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "Desc");

        Assert.Equal(1, episode.EpisodeId);
        Assert.Equal(season.SeasonId, episode.SeasonId);
        Assert.Equal(1, episode.EpisodeNumber);
    }

    [Fact]
    public async Task GetEpisode()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "Desc");

        EpisodeModel? loaded = await _episodeService.GetEpisode(episode.EpisodeId);

        Assert.NotNull(loaded);
        Assert.Equal(episode.EpisodeId, loaded!.EpisodeId);
    }

    [Fact]
    public async Task GetEpisodes()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "Desc");

        EpisodeModel[] episodes = await _episodeService.GetEpisodes(season.SeasonId);

        Assert.Single(episodes);
        Assert.Equal(1, episodes[0].EpisodeNumber);
    }

    [Fact]
    public async Task UpdateEpisodeById()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "Desc");

        EpisodeModel updated = await _episodeService.UpdateEpisode(episode.EpisodeId, episodeNumber: 2, englishTitle: "EN2");

        Assert.Equal(2, updated.EpisodeNumber);
        Assert.Equal("EN2", updated.EnglishTitle);
    }

    [Fact]
    public async Task UpdateEpisodeByModel()
    {
        SeriesModel series = await _seriesService.CreateSeries("a-series", "A Seris", "Desc", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "Desc");

        EpisodeModel updated = await _episodeService.UpdateEpisode(episode, episodeNumber: 2, englishTitle: "EN2");

        Assert.Equal(2, updated.EpisodeNumber);
        Assert.Equal("EN2", updated.EnglishTitle);
    }

    [Fact]
    public async Task UpdateEpisodeByIdThrowsForUnknownEpisode()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _episodeService.UpdateEpisode(999, englishTitle: "X"));
    }
}