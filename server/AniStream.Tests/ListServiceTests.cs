using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class ListServiceTests : TestBase
{
    private readonly IListService _listService;

    public ListServiceTests()
    {
        _listService = GetService<IListService>();
    }

    [Fact]
    public async Task GetLists_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.GetLists());
    }

    [Fact]
    public async Task GetList_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.GetList(1));
    }

    [Fact]
    public async Task GetListsOfSeries_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.GetListsOfSeries(1));
    }

    [Fact]
    public async Task CreateList_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.CreateList("watchlist"));
    }

    [Fact]
    public async Task UpdateListById_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.UpdateList(1, "updated"));
    }

    [Fact]
    public async Task UpdateListByModel_ThrowsNotImplementedException()
    {
        ListModel list = new ListModel("watchlist", "");

        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.UpdateList(list, "updated"));
    }

    [Fact]
    public async Task DeleteListById_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.DeleteList(1));
    }

    [Fact]
    public async Task DeleteListByModel_ThrowsNotImplementedException()
    {
        ListModel list = new ListModel("watchlist", "");

        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.DeleteList(list));
    }

    [Fact]
    public async Task GetSeries_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.GetSeries(1));
    }

    [Fact]
    public async Task AddSeriesToList_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.AddSeriesToList(1, 1));
    }

    [Fact]
    public async Task RemoveSeriesFromList_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.RemoveSeriesFromList(1, 1));
    }

    [Fact]
    public async Task GetPreviewImages_ThrowsNotImplementedException()
    {
        await Assert.ThrowsAsync<NotImplementedException>(() => _listService.GetPreviewImages(1));
    }
}