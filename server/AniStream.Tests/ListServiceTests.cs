using AniStream.Contracts;
using AniStream.Models;
using AniStream.Tests.Utils;

namespace AniStream.Tests;

public sealed class ListServiceTests : TestBase
{
    private readonly IListService _listService;
    private readonly ISeriesService _seriesService;

    public ListServiceTests()
    {
        _listService = GetService<IListService>();
        _seriesService = GetService<ISeriesService>();
    }

    [Fact]
    public async Task GetLists()
    {
        await _listService.CreateList("watchlist");
        await _listService.CreateList("favorites");

        ListModel[] lists = await _listService.GetLists();

        Assert.Equal(2, lists.Length);
        Assert.Contains(lists, l => l.Name == "watchlist");
        Assert.Contains(lists, l => l.Name == "favorites");
    }

    [Fact]
    public async Task GetList()
    {
        ListModel created = await _listService.CreateList("watchlist");

        ListModel? list = await _listService.GetList(created.ListId);

        Assert.NotNull(list);
        Assert.Equal(created.ListId, list!.ListId);
        Assert.Equal("watchlist", list.Name);
    }

    [Fact]
    public async Task GetListsOfSeries()
    {
        await CreateSeries();
        ListModel list1 = await _listService.CreateList("list1");
        ListModel list2 = await _listService.CreateList("list2");

        await _listService.AddSeriesToList(list1.ListId, 1);
        await _listService.AddSeriesToList(list2.ListId, 1);

        ListModel[] lists = await _listService.GetListsOfSeries(1);

        Assert.Equal(2, lists.Length);
        Assert.Contains(lists, l => l.Name == "list1");
        Assert.Contains(lists, l => l.Name == "list2");
    }

    [Fact]
    public async Task CreateList()
    {
        ListModel list = await _listService.CreateList("watchlist");

        Assert.Equal(1, list.ListId);
        Assert.Equal("watchlist", list.Name);
        Assert.Equal(MockCredentialService.MOCK_UUID, list.TenantId);
    }

    [Fact]
    public async Task UpdateListById()
    {
        ListModel created = await _listService.CreateList("watchlist");

        ListModel updated = await _listService.UpdateList(created.ListId, "updated");

        Assert.Equal("updated", updated.Name);

        ListModel? fetched = await _listService.GetList(created.ListId);
        Assert.Equal("updated", fetched!.Name);
    }

    [Fact]
    public async Task UpdateListByModel()
    {
        ListModel created = await _listService.CreateList("watchlist");

        ListModel updated = await _listService.UpdateList(created, "updated");

        Assert.Equal("updated", updated.Name);
    }

    [Fact]
    public async Task DeleteListById()
    {
        ListModel created = await _listService.CreateList("watchlist");

        await _listService.DeleteList(created.ListId);

        ListModel? list = await _listService.GetList(created.ListId);
        Assert.Null(list);
    }

    [Fact]
    public async Task DeleteListByModel()
    {
        ListModel created = await _listService.CreateList("watchlist");

        await _listService.DeleteList(created);

        ListModel? list = await _listService.GetList(created.ListId);
        Assert.Null(list);
    }

    [Fact]
    public async Task GetSeriesById()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list.ListId, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list.ListId);

        Assert.Single(seriesInList);
        Assert.Equal(1, seriesInList[0].SeriesId);
    }

    [Fact]
    public async Task GetSeriesByModel()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list);

        Assert.Single(seriesInList);
        Assert.Equal(1, seriesInList[0].SeriesId);
    }

    [Fact]
    public async Task AddSeriesToListById()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();

        await _listService.AddSeriesToList(list.ListId, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list.ListId);
        Assert.Single(seriesInList);
    }

    [Fact]
    public async Task AddSeriesToListByModel()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();

        await _listService.AddSeriesToList(list, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list.ListId);
        Assert.Single(seriesInList);
    }

    [Fact]
    public async Task RemoveSeriesFromListById()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list.ListId, 1);

        await _listService.RemoveSeriesFromList(list.ListId, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list.ListId);
        Assert.Empty(seriesInList);
    }

    [Fact]
    public async Task RemoveSeriesFromListByModel()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list.ListId, 1);

        await _listService.RemoveSeriesFromList(list, 1);

        SeriesModel[] seriesInList = await _listService.GetSeries(list.ListId);
        Assert.Empty(seriesInList);
    }

    [Fact]
    public async Task GetPreviewImagesById()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list.ListId, 1);

        string[] images = await _listService.GetPreviewImages(list.ListId);

        Assert.Single(images);
        Assert.Equal("ABCDEFG", images[0]);
    }

    [Fact]
    public async Task GetPreviewImagesByModel()
    {
        ListModel list = await _listService.CreateList("watchlist");
        await CreateSeries();
        await _listService.AddSeriesToList(list.ListId, 1);

        string[] images = await _listService.GetPreviewImages(list);

        Assert.Single(images);
        Assert.Equal("ABCDEFG", images[0]);
    }

    private async Task CreateSeries()
    {
        SeriesModel series = await _seriesService.CreateSeries(Guid.NewGuid().ToString(), "Title", "Desc", "ABCDEFG");
        Assert.Equal(1, series.SeriesId);
    }
}