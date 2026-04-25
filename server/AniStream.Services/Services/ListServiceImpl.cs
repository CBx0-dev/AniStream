using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.Services;

public sealed class ListServiceImpl : IListService
{
    private MetadataDbContextFactory _dbFactory;

    public ListServiceImpl(MetadataDbContextFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<ListModel[]> GetLists()
    {
        throw new NotImplementedException();
    }

    public Task<ListModel?> GetList(int listId)
    {
        throw new NotImplementedException();
    }

    public Task<ListModel[]> GetListsOfSeries(int seriesId)
    {
        throw new NotImplementedException();
    }

    public Task<ListModel> CreateList(string name)
    {
        throw new NotImplementedException();
    }

    public Task<ListModel> UpdateList(int listId, string name)
    {
        throw new NotImplementedException();
    }

    public Task<ListModel> UpdateList(ListModel list, string name)
    {
        throw new NotImplementedException();
    }

    public Task DeleteList(int listId)
    {
        throw new NotImplementedException();
    }

    public Task DeleteList(ListModel list)
    {
        throw new NotImplementedException();
    }

    public Task<SeriesModel[]> GetSeries(int listId)
    {
        throw new NotImplementedException();
    }

    public Task AddSeriesToList(int listId, int seriesId)
    {
        throw new NotImplementedException();
    }

    public Task RemoveSeriesFromList(int listId, int seriesId)
    {
        throw new NotImplementedException();
    }

    public Task<string[]> GetPreviewImages(int listId)
    {
        throw new NotImplementedException();
    }
}