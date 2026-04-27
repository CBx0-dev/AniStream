using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API.Controllers;

[Route("api/{provider}/lists")]
[ApiController]
[Authorize]
public sealed class ListController : ApiControllerBase
{
    private readonly IListService _listService;

    public ListController(IListService listService)
    {
        _listService = listService;
    }

    [HttpGet]
    public async Task<ListModel[]> GetLists()
    {
        Models.ListModel[] lists = await _listService.GetLists();

        return lists.Select(list => list.ToDTO()).ToArray();
    }

    [HttpPost]
    public async Task<ListModel> CreateList([FromBody] ListCreateModel data)
    {
        Models.ListModel list = await _listService.CreateList(data.Name);

        return list.ToDTO();
    }

    [HttpGet("{listId}")]
    public async Task<ActionResult<ListModel>> GetList(int listId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        return Ok(list.ToDTO());
    }

    [HttpPut("{listId}")]
    public async Task<ActionResult<ListModel>> UpdateList(int listId, [FromBody] ListUpdateModel data)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        await _listService.UpdateList(list, data.Name);

        return Ok(list.ToDTO());
    }

    [HttpDelete("{listId}")]
    public async Task<IActionResult> DeleteList(int listId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        await _listService.DeleteList(list);
        return Ok();
    }

    [HttpGet("series/{seriesId}")]
    public async Task<ListModel[]> GetListsOfSeries(int seriesId)
    {
        Models.ListModel[] lists = await _listService.GetListsOfSeries(seriesId);

        return lists.Select(list => list.ToDTO()).ToArray();
    }

    [HttpGet("{listId}/series")]
    public async Task<ActionResult<SeriesModel[]>> GetSeries(int listId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        Models.SeriesModel[] series = await _listService.GetSeries(list);

        return Ok(series.Select(series => series.ToDTO()).ToArray());
    }

    [HttpPost("{listId}/series/{seriesId}")]
    public async Task<IActionResult> AddSeriesToList(int listId, int seriesId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        await _listService.AddSeriesToList(list, seriesId);
        return Ok();
    }

    [HttpDelete("{listId}/series/{seriesId}")]
    public async Task<IActionResult> RemoveSeriesFromList(int listId, int seriesId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        await _listService.RemoveSeriesFromList(list, seriesId);
        return Ok();
    }

    [HttpGet("{listId}/preview")]
    public async Task<ActionResult<string[]>> GetPreviewImages(int listId)
    {
        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        return Ok(await _listService.GetPreviewImages(list));
    }
}