using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;

namespace AniStream.Services;

public class SeasonServiceImpl : ISeasonService
{
    private DbContextFactory<MetadataDbContext> _dbFactory;

    public SeasonServiceImpl(DbContextFactory<MetadataDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<SeasonModel?> GetSeason(int seasonId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeasonModel> query = from season in db.Seasons where season.SeasonId == seasonId select season;
        return query.FirstOrDefault();
    }

    public async Task<SeasonModel[]> GetSeasons(int seriesId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SeasonModel> query = from season in db.Seasons where season.SeriesId == seriesId select season;

        return query.ToArray();
    }

    public async Task<SeasonModel> CreateSeason(int seriesId, int seasonNumber)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SeasonModel season = new SeasonModel(seriesId, seasonNumber);
        db.Seasons.Add(season);

        await db.SaveChangesAsync();

        return season;
    }
}