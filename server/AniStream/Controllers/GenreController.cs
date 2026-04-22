using AniStream.API.DTO;
using AniStream.API.Utils;
using AniStream.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}