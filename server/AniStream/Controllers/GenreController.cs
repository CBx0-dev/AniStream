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

    [HttpGet("{genreId}")]
    public async Task<ActionResult<GenreModel>> GetGenre(int genreId)
    {
        Models.GenreModel? genre = await _genreService.GetGenre(genreId);
        if (genre is null)
        {
            return NotFound($"Genre with the ID '{genreId}' not found");
        }

        return Ok(genre.ToDTO());
    }

    [HttpGet("key/{genreKey}")]
    public async Task<ActionResult<GenreModel>> GetGenre(string genreKey)
    {
        Models.GenreModel? genre = await _genreService.GetGenre(genreKey);
        if (genre is null)
        {
            return NotFound($"Genre with the key '{genreKey}' not found");
        }

        return Ok(genre.ToDTO());
    }

    [HttpGet("series/{seriesId}")]
    public async Task<GenreModel[]> GetGenresOfSeries(int seriesId)
    {
        Models.GenreModel[] genres = await _genreService.GetNonMainGenresOfSeries(seriesId);

        return genres.Select(genre => genre.ToDTO()).ToArray();
    }

    [HttpGet("series/{seriesId}/main")]
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