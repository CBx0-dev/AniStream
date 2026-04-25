using AniStream.Models;

namespace AniStream.Contracts;

public interface IListService
{
    public Task<ListModel[]> GetLists();

    public Task<ListModel?> GetList(int listId);

    public Task<ListModel[]> GetListsOfSeries(int seriesId);

    public Task<ListModel> CreateList(string name);

    public Task<ListModel> UpdateList(int listId, string name);

    public Task<ListModel> UpdateList(ListModel list, string name);

    public Task DeleteList(int listId);

    public Task DeleteList(ListModel list);

    public Task<SeriesModel[]> GetSeries(int listId);

    public Task AddSeriesToList(int listId, int seriesId);

    public Task RemoveSeriesFromList(int listId, int seriesId);

    public Task<string[]> GetPreviewImages(int listId);
}