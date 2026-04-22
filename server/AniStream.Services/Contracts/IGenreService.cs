using AniStream.Models;

namespace AniStream.Contracts;

public interface IGenreService
{
    public Task<GenreModel> GetGenreByKey(string key);

    public Task<GenreModel> CreateGenre(string key);

    public Task CreateGenreToSeries(int genreId, int seriesId, bool mainGenre);

    public Task<GenreModel[]> GetGenres();

    public Task<GenreModel?> GetMainGenreOfSeries(int seriesId);

    public Task<GenreModel[]> GetNonMainGenresOfSeries(int seriesId);
}