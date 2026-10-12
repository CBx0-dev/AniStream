using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class ProviderSyncServiceTests : TestBase
{
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;
    private readonly IProviderSyncService _syncService;

    public ProviderSyncServiceTests()
    {
        _seriesService = GetService<ISeriesService>();
        _seasonService = GetService<ISeasonService>();
        _episodeService = GetService<IEpisodeService>();
        _syncService = GetService<IProviderSyncService>();
    }

    [Fact]
    public async Task GetSyncJobByEpisode_ReturnsQueuedJob()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "");

        await _syncService.RequestSync(episode);

        SyncProviderJobModel? job = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(job);
        Assert.Equal(SyncJobStatus.Queued, job.Status);
        Assert.Null(job.Expires);
    }

    [Fact]
    public async Task GetSyncJobByEpisode_ReturnsProcessingJob()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "");

        await _syncService.RequestSync(episode);
        SyncProviderJobModel? job = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(job);

        await _syncService.UpdateSyncJob(job, SyncJobStatus.Processing);

        SyncProviderJobModel? processingJob = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(processingJob);
        Assert.Equal(SyncJobStatus.Processing, processingJob.Status);
        Assert.Null(processingJob.Expires);
    }

    [Fact]
    public async Task GetSyncJobByEpisode_ReturnsActiveCompletedJob()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "");

        await _syncService.RequestSync(episode);
        SyncProviderJobModel? job = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(job);

        DateTime futureExpires = DateTime.UtcNow.AddHours(1);
        await _syncService.UpdateSyncJob(job, SyncJobStatus.Completed, DateTime.UtcNow, futureExpires);

        SyncProviderJobModel? completedJob = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(completedJob);
        Assert.Equal(SyncJobStatus.Completed, completedJob.Status);
        Assert.Equal(futureExpires, completedJob.Expires);
    }

    [Fact]
    public async Task GetSyncJobByEpisode_ReturnsNullWhenExpired()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "");

        await _syncService.RequestSync(episode);
        SyncProviderJobModel? job = await _syncService.GetSyncJobByEpisode(episode);
        Assert.NotNull(job);

        DateTime pastExpires = DateTime.UtcNow.AddHours(-1);
        await _syncService.UpdateSyncJob(job, SyncJobStatus.Completed, DateTime.UtcNow.AddHours(-2), pastExpires);

        SyncProviderJobModel? expiredJob = await _syncService.GetSyncJobByEpisode(episode);
        Assert.Null(expiredJob);
    }

    [Fact]
    public async Task RequestSync_DoesNotSpawnDuplicateWhenAlreadySyncing()
    {
        SeriesModel series = await _seriesService.CreateSeries("test-series", "Test Series", "", null);
        SeasonModel season = await _seasonService.CreateSeason(series.SeriesId, 1);
        EpisodeModel episode = await _episodeService.CreateEpisode(season.SeasonId, 1, "DE", "EN", "");

        await _syncService.RequestSync(episode);
        await _syncService.RequestSync(episode);

        SyncProviderJobModel[] jobs = await _syncService.GetSyncJobs();
        Assert.Single(jobs, j => j.EpisodeId == episode.EpisodeId);
    }
}
