using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;

namespace AniStream.Services;

public sealed class WatchListServiceImpl : IWatchListService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ICredentialsService _credentialsService;

    public WatchListServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, ICredentialsService credentialsService)
    {
        _dbFactory = dbFactory;
        _credentialsService = credentialsService;
    }

    public async Task<int[]> GetSeriesIds()
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<int> query = from watchlist in db.WatchLists
            where watchlist.TenantId == tenantId
            select watchlist.SeriesId;
        return query.ToArray();
    }

    public async Task<bool> IsSeriesOnList(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<int> query = from watchlist in db.WatchLists
            where watchlist.TenantId == tenantId && watchlist.SeriesId == seriesId
            select watchlist.SeriesId;
        return query.Any();
    }

    public async Task AddSeries(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        WatchListModel watchlist = new WatchListModel(seriesId, tenantId);

        db.WatchLists.Add(watchlist);
        await db.SaveChangesAsync();
    }

    public async Task RemoveSeries(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<WatchListModel> query = from w in db.WatchLists
            where w.TenantId == tenantId && w.SeriesId == seriesId
            select w;

        WatchListModel? watchlist = query.FirstOrDefault();
        if (watchlist is null)
        {
            return;
        }

        db.WatchLists.Remove(watchlist);
        await db.SaveChangesAsync();
    }
}