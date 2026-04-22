using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace AniStream.API.Controllers;

[Route("api/{provider}/genres")]
[ApiController]
[Authorize]
public sealed class GenreController : ApiControllerBase
{
    private readonly IGenreService _genreService;

    public GenreController(IGenreService genreService)
    {
        _genreService = genreService;
    }

    [HttpGet]
    public async Task<GenreModel[]> GetGenres()
    {
        Models.GenreModel[] genres = await _genreService.GetGenres();

        return genres.Select(genre => genre.ToDTO()).ToArray();
    }

    [HttpGet("{seriesId}")]
    public async Task<GenreModel[]> GetGenresOfSeries(int seriesId)
    {
        Models.GenreModel[] genres = await _genreService.GetNonMainGenresOfSeries(seriesId);
        
        return genres.Select(genre => genre.ToDTO()).ToArray();
    }

    [HttpGet("{seriesId}/main")]
    public async Task<ActionResult<GenreModel>> GetMainGenreOfSeries(int seriesId)
    {
        Models.GenreModel? genre = await _genreService.GetMainGenreOfSeries(seriesId);
        if (genre is null)
        {
            return NotFound("Series dont have a main genre");
        }

        return Ok(genre);
    }
}