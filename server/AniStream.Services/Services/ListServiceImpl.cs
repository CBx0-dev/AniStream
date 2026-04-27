using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class ListServiceImpl : IListService
{
    private DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ICredentialsService _credentialsService;

    public ListServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, ICredentialsService credentialsService)
    {
        _dbFactory = dbFactory;
        _credentialsService = credentialsService;
    }

    public async Task<ListModel[]> GetLists()
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<ListModel> query = from list in db.Lists where list.TenantId == tenantId select list;

        return await query.ToArrayAsync();
    }

    public async Task<ListModel?> GetList(int listId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<ListModel> query = from list in db.Lists where list.ListId == listId select list;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<ListModel[]> GetListsOfSeries(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<ListModel> query = from listToSeries in db.ListsToSeries
            join list in db.Lists on listToSeries.ListId equals list.ListId
            where listToSeries.SeriesId == seriesId && list.TenantId == tenantId
            select list;

        return await query.ToArrayAsync();
    }

    public async Task<ListModel> CreateList(string name)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        await using MetadataDbContext db = await _dbFactory.GetContext();

        ListModel list = new ListModel(name, tenantId);

        db.Lists.Add(list);
        await db.SaveChangesAsync();

        return list;
    }

    public async Task<ListModel> UpdateList(int listId, string name)
    {
        ListModel? list = await GetList(listId);
        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        return await UpdateList(list, name);
    }

    public async Task<ListModel> UpdateList(ListModel list, string name)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        list.Name = name;

        db.Lists.Update(list);
        await db.SaveChangesAsync();

        return list;
    }

    public async Task DeleteList(int listId)
    {
        ListModel? list = await GetList(listId);
        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        await DeleteList(list);
    }

    public async Task DeleteList(ListModel list)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        db.Lists.Remove(list);
        await db.SaveChangesAsync();
    }

    public async Task<SeriesModel[]> GetSeries(int listId)
    {
        ListModel? list = await GetList(listId);

        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        return await GetSeries(list);
    }

    public async Task<SeriesModel[]> GetSeries(ListModel list)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from listToSeries in db.ListsToSeries
            join series in db.Series on listToSeries.SeriesId equals series.SeriesId
            where listToSeries.ListId == list.ListId
            select series;

        return await query.ToArrayAsync();
    }

    public async Task AddSeriesToList(int listId, int seriesId)
    {
        ListModel? list = await GetList(listId);
        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        await AddSeriesToList(list, seriesId);
    }

    public async Task AddSeriesToList(ListModel list, int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        ListToSeriesModel listToSeries = new ListToSeriesModel(list.ListId, seriesId);

        db.ListsToSeries.Add(listToSeries);
        await db.SaveChangesAsync();
    }

    public async Task RemoveSeriesFromList(int listId, int seriesId)
    {
        ListModel? list = await GetList(listId);
        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        await RemoveSeriesFromList(list, seriesId);
    }

    public async Task RemoveSeriesFromList(ListModel list, int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<ListToSeriesModel> query = from lts in db.ListsToSeries
            where lts.ListId == list.ListId && lts.SeriesId == seriesId
            select lts;

        ListToSeriesModel? listToSeries = await query.FirstOrDefaultAsync();
        if (listToSeries is null)
        {
            return;
        }

        db.ListsToSeries.Remove(listToSeries);
        await db.SaveChangesAsync();
    }

    public async Task<string[]> GetPreviewImages(int listId)
    {
        ListModel? list = await GetList(listId);
        if (list is null)
        {
            throw new Exception($"List with ID '{listId}' not found");
        }

        return await GetPreviewImages(list);
    }

    public async Task<string[]> GetPreviewImages(ListModel list)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<string> query = from listToSeries in db.ListsToSeries
            join series in db.Series on listToSeries.SeriesId equals series.SeriesId
            where listToSeries.ListId == list.ListId
            select series.PreviewImage;

        return await query.ToArrayAsync();
    }
}