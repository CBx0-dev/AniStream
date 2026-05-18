using System.ComponentModel.DataAnnotations;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;

namespace AniStream.Services;

public sealed class SeriesSerivceImpl : ISeriesService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ICredentialsService _credentialsService;

    public SeriesSerivceImpl(DbContextFactory<MetadataDbContext> dbFactory, ICredentialsService credentialsService)
    {
        _dbFactory = dbFactory;
        _credentialsService = credentialsService;
    }

    public async Task<SeriesModel> CreateSeries(string guid, string title, string description, string? previewImage)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SeriesModel series = new SeriesModel(guid, title, description, previewImage);

        db.Series.Add(series);
        await db.SaveChangesAsync();

        return series;
    }

    public async Task<SeriesModel?> GetSeries(int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where series.SeriesId == seriesId select series;
        return query.FirstOrDefault();
    }

    public async Task<SeriesModel?> GetSeries(string guid)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where series.Guid == guid select series;
        return query.FirstOrDefault();
    }

    public async Task<SeriesModel[]> GetSeriesByIds(int[] seriesIds)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where seriesIds.Contains(series.SeriesId) select series;
        return query.ToArray();
    }

    public async Task<SeriesModel[]> GetSeriesChunk(
        int offset,
        int limit,
        string? searchText,
        int[]? genreIds
    )
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = db.Series.AsQueryable();

        if (searchText is not null)
        {
            query = query.Where(s => s.Title.Contains(searchText));
        }

        if (genreIds is not null)
        {
            query = from s in query where db.GenresToSeries.Any(gs => gs.SeriesId == s.SeriesId && genreIds.Contains(gs.GenreId)) select s;
        }

        return query
            .OrderBy(s => s.Title)
            .Skip(offset)
            .Take(limit)
            .ToArray();
    }

    public async Task<SeriesModel[]> GetStartedSeries()
    {
        string tenantId = await _credentialsService.GetCurrentUuid();

        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = db.Series
            .Join(
                db.Seasons.Where(se => se.SeasonNumber > 0),
                s => s.SeriesId,
                se => se.SeriesId,
                (s, se) => new
                {
                    s,
                    se
                })
            .Join(
                db.Episodes,
                x => x.se.SeasonId,
                e => e.SeasonId,
                (x, e) => new
                {
                    x.s,
                    x.se,
                    e
                })
            .GroupJoin(
                db.WatchTimes.Where(wt => wt.TenantId == tenantId),
                x => x.e.EpisodeId,
                wt => wt.EpisodeId,
                (x, wt) => new
                {
                    x.s,
                    x.e,
                    wt
                })
            .SelectMany(
                x => x.wt.DefaultIfEmpty(),
                (x, wt) => new
                {
                    x.s,
                    x.e,
                    wt
                })
            .GroupBy(x => x.s)
            .Where(g =>
                g.Max(x => x.wt != null
                    ? x.wt.PercentageWatched
                    : 0
                ) >
                0 &&
                g.Min(x => x.wt != null
                    ? x.wt.PercentageWatched
                    : 0
                ) <=
                80)
            .Select(g => g.Key);

        return query.ToArray();
    }
}