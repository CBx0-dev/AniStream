using System.Threading.Tasks;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class GenreServiceImpl : IGenreService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;

    public GenreServiceImpl(DbContextFactory<MetadataDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<GenreModel> CreateGenre(string key)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();
        GenreModel model = new GenreModel(key);

        db.Genres.Add(model);
        await db.SaveChangesAsync();

        return model;
    }

    public async Task CreateGenreToSeries(int genreId, int seriesId, bool mainGenre)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        GenreToSeries genreToSeries = new GenreToSeries(genreId, seriesId, mainGenre);
        db.GenresToSeries.Add(genreToSeries);

        await db.SaveChangesAsync();
    }

    public async Task<GenreModel[]> GetGenres()
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();
        return await db.Genres.ToArrayAsync();
    }

    public async Task<GenreModel?> GetGenre(int genreId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<GenreModel> query = from genre in db.Genres where genre.GenreId == genreId select genre;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<GenreModel?> GetGenre(string key)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<GenreModel> query = from genre in db.Genres where genre.Key == key select genre;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<GenreModel?> GetMainGenreOfSeries(int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<GenreModel> query = from gs in db.GenresToSeries
            join g in db.Genres on gs.GenreId equals g.GenreId
            where gs.SeriesId == seriesId && gs.MainGenre
            select g;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<GenreModel[]> GetNonMainGenresOfSeries(int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<GenreModel> query = from gs in db.GenresToSeries
            join g in db.Genres on gs.GenreId equals g.GenreId
            where gs.SeriesId == seriesId && !gs.MainGenre
            select g;
        return await query.ToArrayAsync();
    }
}