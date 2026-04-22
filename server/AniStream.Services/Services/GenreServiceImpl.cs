using System.Threading.Tasks;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class GenreServiceImpl : IGenreService
{
    private readonly MetadataDbContextFactory _dbFactory;

    public GenreServiceImpl(MetadataDbContextFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public Task<GenreModel> CreateGenre(string key)
    {
        throw new NotImplementedException();
    }

    public Task CreateGenreToSeries(int genreId, int seriesId, bool mainGenre)
    {
        throw new NotImplementedException();
    }

    public Task<GenreModel> GetGenreByKey(string key)
    {
        throw new NotImplementedException();
    }

    public async Task<GenreModel[]> GetGenres()
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();
        return await db.Genres.ToArrayAsync();
    }

    public Task<GenreModel?> GetMainGenreOfSeries(int seriesId)
    {
        throw new NotImplementedException();
    }

    public Task<GenreModel[]> GetNonMainGenresOfSeries(int seriesId)
    {
        throw new NotImplementedException();
    }
}