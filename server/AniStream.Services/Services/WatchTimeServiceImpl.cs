using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class WatchTimeServiceImpl : IWatchTimeService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ICredentialsService _credentialsService;

    public WatchTimeServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, ICredentialsService credentialsService)
    {
        _dbFactory = dbFactory;
        _credentialsService = credentialsService;
    }

    public async Task<WatchTimeModel?> GetWatchTime(int episodeId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<WatchTimeModel> query = from watchtime in db.WatchTimes
            where watchtime.TenantId == tenantId && watchtime.EpisodeId == episodeId
            select watchtime;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<WatchTimeModel[]> GetWatchTimesOfSeries(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<WatchTimeModel> query = from watchtime in db.WatchTimes
            join episode in db.Episodes on watchtime.EpisodeId equals episode.EpisodeId
            join season in db.Seasons on episode.SeasonId equals season.SeasonId
            where watchtime.TenantId == tenantId && season.SeriesId == seriesId
            select watchtime;

        return await query.ToArrayAsync();
    }

    public async Task<WatchTimeModel[]> GetWatchTimesOfSeason(int seasonId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<WatchTimeModel> query = from watchtime in db.WatchTimes
            join episode in db.Episodes on watchtime.EpisodeId equals episode.EpisodeId
            where watchtime.TenantId == tenantId && episode.SeasonId == seasonId
            select watchtime;

        return await query.ToArrayAsync();
    }

    public async Task<WatchTimeModel?> GetWatchTimeOfEpisode(int episodeId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<WatchTimeModel> query = from watchtime in db.WatchTimes
            where watchtime.TenantId == tenantId && watchtime.EpisodeId == episodeId
            select watchtime;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<int> GetTotalWatchProgression(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<Tuple<int, int>> query = from episode in db.Episodes
            join watchtime in db.WatchTimes on episode.EpisodeId equals watchtime.EpisodeId into watchtimeGroup
            from watchtime in watchtimeGroup.DefaultIfEmpty()
            join season in db.Seasons on episode.SeasonId equals season.SeasonId into seasonGroup
            from season in seasonGroup.DefaultIfEmpty()
            where season.SeriesId == seriesId && season.SeasonNumber > 0
            group new
            {
                episode,
                watchtime
            } by 1
            into g
            select new Tuple<int, int>(
                g.Select(x => x.episode.EpisodeId).Distinct().Count(),
                g.Sum(x => x.watchtime != null && x.watchtime.TenantId == tenantId && x.watchtime.PercentageWatched > 80
                    ? 1
                    : 0)
            );

        (int totalEpisodes, int completedEpisodes) = await query.FirstOrDefaultAsync() ?? new Tuple<int, int>(0, 0);

        if (totalEpisodes == 0)
        {
            return 0;
        }

        return (int)Math.Round(100.0 * completedEpisodes / totalEpisodes);
    }

    public async Task<WatchTimeModel> CreateWatchTime(int episodeId, int percentageWatched, double stoppedTime)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        WatchTimeModel watchtime = new WatchTimeModel(episodeId, percentageWatched, stoppedTime, tenantId);

        db.WatchTimes.Add(watchtime);
        await db.SaveChangesAsync();

        return watchtime;
    }

    public async Task<WatchTimeModel> UpdateWatchTime(int watchtimeId, int? percentageWatched = null, double? stoppedTime = null)
    {
        WatchTimeModel? watchtime = await GetWatchTime(watchtimeId);
        if (watchtime is null)
        {
            throw new ArgumentException($"WatchTime with ID '{watchtimeId}' dont exist", nameof(watchtimeId));
        }

        return await UpdateWatchTime(watchtime, percentageWatched, stoppedTime);
    }

    public async Task<WatchTimeModel> UpdateWatchTime(WatchTimeModel watchtime, int? percentageWatched = null, double? stoppedTime = null)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        if (percentageWatched is not null)
        {
            watchtime.PercentageWatched = (int)percentageWatched;
        }

        if (stoppedTime is not null)
        {
            watchtime.StoppedTime = (double)stoppedTime;
        }

        db.Update(watchtime);
        await db.SaveChangesAsync();

        return watchtime;
    }

    public async Task UpdateWatchTimes(WatchTimeModel[] watchTimes, int? percentageWatched = null, double? stoppedTime = null)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        foreach (WatchTimeModel watchtime in watchTimes)
        {
            if (percentageWatched is not null)
            {
                watchtime.PercentageWatched = (int)percentageWatched;
            }

            if (stoppedTime is not null)
            {
                watchtime.StoppedTime = (double)stoppedTime;
            }

            db.Update(watchtime);
        }

        await db.SaveChangesAsync();
    }

    public async Task UpdateWatchTimeOfEpisode(int episodeId, int? percentageWatched = null, double? stoppedTime = null)
    {
        WatchTimeModel? watchtime = await GetWatchTimeOfEpisode(episodeId);
        if (watchtime is null)
        {
            throw new ArgumentException($"WatchTime of Episode with ID '{episodeId}' dont exist", nameof(episodeId));
        }

        await UpdateWatchTime(watchtime, percentageWatched, stoppedTime);
    }

    public async Task UpdateWatchTimeOfSeason(int seasonId, int? percentageWatched = null, double? stoppedTime = null)
    {
        WatchTimeModel[] watchTimes = await GetWatchTimesOfSeason(seasonId);

        if (watchTimes.Length == 0)
        {
            return;
        }

        await UpdateWatchTimes(watchTimes, percentageWatched, stoppedTime);
    }

    public async Task UpdateWatchTimeOfSeries(int seriesId, int? percentageWatched = null, double? stoppedTime = null)
    {
        WatchTimeModel[] watchTimes = await GetWatchTimesOfSeries(seriesId);

        if (watchTimes.Length == 0)
        {
            return;
        }

        await UpdateWatchTimes(watchTimes, percentageWatched, stoppedTime);
    }
}