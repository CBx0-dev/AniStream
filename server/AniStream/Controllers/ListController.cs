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
    private readonly ICredentialsService _credentialsService;

    public ListController(IListService listService, ICredentialsService credentialsService)
    {
        _listService = listService;
        _credentialsService = credentialsService;
    }

    [HttpGet]
    public async Task<ListModel[]> GetLists()
    {
        string tenantId = await _credentialsService.GetCurrentUuid();

        Models.ListModel[] lists = await _listService.GetLists();

        return lists.Select(list => list.ToDTO(tenantId)).ToArray();
    }

    [HttpPost]
    public async Task<ListModel> CreateList([FromBody] ListCreateModel data)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();

        Models.ListModel list = await _listService.CreateList(data.Name);

        return list.ToDTO(tenantId);
    }

    [HttpGet("{listId}")]
    public async Task<ActionResult<ListModel>> GetList(int listId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();

        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        return Ok(list.ToDTO(tenantId));
    }

    [HttpPut("{listId}")]
    public async Task<ActionResult<ListModel>> UpdateList(int listId, [FromBody] ListUpdateModel data)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();

        Models.ListModel? list = await _listService.GetList(listId);
        if (list is null)
        {
            return NotFound($"List with ID '{listId}' not found");
        }

        await _listService.UpdateList(list, data.Name);

        return Ok(list.ToDTO(tenantId));
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
        return Ok("List deleted");
    }

    [HttpGet("series/{seriesId}")]
    public async Task<ListModel[]> GetListsOfSeries(int seriesId)
    {
        string tenantId = await _credentialsService.GetCurrentUuid();
        Models.ListModel[] lists = await _listService.GetListsOfSeries(seriesId);

        return lists.Select(list => list.ToDTO(tenantId)).ToArray();
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
        return Ok("Series added to list");
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
        return Ok("Series removed from list");
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