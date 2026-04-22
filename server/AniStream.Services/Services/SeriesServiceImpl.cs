using System.ComponentModel.DataAnnotations;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;

namespace AniStream.Services;

public sealed class SeriesSerivceImpl : ISeriesService
{
    private MetadataDbContextFactory _dbFactory;

    public SeriesSerivceImpl(MetadataDbContextFactory dbFactory)
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

    public async Task<SeriesModel[]> GetSeriesChunk(int offset, int limit)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series orderby series.Title select series;
        return query.Skip(offset).Take(limit).ToArray();
    }

    public async Task<SeriesModel[]> GetSeriesChunk(
        int offset,
        int limit,
        string searchText
    )
    {
        searchText = searchText.ToLower();

        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series orderby series.Title where series.Title.ToLower().Contains(searchText) select series;
        return query.Skip(offset).Take(limit).ToArray();
    }

    public async Task<SeriesModel[]> GetSeriesChunk(
        int offset,
        int limit,
        string searchText,
        int[] genreIds
    )
    {
        searchText = searchText.ToLower();

        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeriesModel> query = from series in db.Series join genre in db.GenresToSeries on series.SeriesId equals genre.GenreId orderby series.Title where series.Title.ToLower().Contains(searchText) && genreIds.Contains(genre.GenreId) select series;
        return query.Skip(offset).Take(limit).ToArray();
    }

    public Task<SeriesModel[]> GetStartedSeries()
    {
        throw new NotImplementedException();
    }
}