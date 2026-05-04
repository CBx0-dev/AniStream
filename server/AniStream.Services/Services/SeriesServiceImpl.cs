using System.ComponentModel.DataAnnotations;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;

namespace AniStream.Services;

public sealed class SeriesSerivceImpl : ISeriesService
{
    private DbContextFactory<MetadataDbContext> _dbFactory;

    public SeriesSerivceImpl(DbContextFactory<MetadataDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<SeriesModel> CreateSeries(string guid, string title, string description, string? previewImage)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SeriesModel series = new SeriesModel(guid, title, description, previewImage);

        db.Series.Add(series);
        await db.SaveChangesAsync();

        return series;
    }

    public async Task<SeriesModel?> GetSeries(int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where series.SeriesId == seriesId select series;
        return query.FirstOrDefault();
    }

    public async Task<SeriesModel?> GetSeries(string guid)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where series.Guid == guid select series;
        return query.FirstOrDefault();
    }

    public async Task<SeriesModel[]> GetSeriesByIds(int[] seriesIds)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series where seriesIds.Contains(series.SeriesId) select series;
        return query.ToArray();
    }

    public async Task<SeriesModel[]> GetSeriesChunk(
        int offset,
        int limit,
        string? searchText,
        int[]? genreIds
    )
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = db.Series.AsQueryable();

        if (searchText is not null)
        {
            query = query.Where(s => s.Title.Contains(searchText));
        }

        if (genreIds is not null)
        {
            query = from s in query where db.GenresToSeries.Any(gs => gs.SeriesId == s.SeriesId && genreIds.Contains(gs.GenreId)) select s;
        }

        return query
            .OrderBy(s => s.Title)
            .Skip(offset)
            .Take(limit)
            .ToArray();
    }

    public Task<SeriesModel[]> GetStartedSeries()
    {
        throw new NotImplementedException();
    }
}