using System.Data.Common;
using System.Reflection.Metadata.Ecma335;
using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

class EpisodeServiceImpl : IEpisodeService
{
    private readonly MetadataDbContextFactory _dbFactory;

    public EpisodeServiceImpl(MetadataDbContextFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<EpisodeModel> CreateEpisode(int seasonId, int episodeNumber, string germanTitle, string englishTitle, string description)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        EpisodeModel episode = new EpisodeModel(seasonId, episodeNumber, germanTitle, englishTitle, description);

        db.Episodes.Add(episode);
        await db.SaveChangesAsync();

        return episode;
    }

    public async Task<EpisodeModel?> GetEpisode(int episodeId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<EpisodeModel> query = from episode in db.Episodes where episode.EpisodeId == episodeId select episode;
        
        return query.FirstOrDefault();
    }

    public async Task<EpisodeModel[]> GetEpisodes(int seasonId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<EpisodeModel> query = from episode in db.Episodes where episode.SeasonId == seasonId select episode;

        return query.ToArray();
    }

    public async Task<EpisodeModel> UpdateEpisode(
        int episodeId,
        int? seasonId = null,
        int? episodeNumber = null,
        string? germanTitle = null,
        string? englishTitle = null,
        string? description = null
    )
    {
        EpisodeModel? episode = await GetEpisode(episodeId);
        if (episode is null)
        {
            throw new ArgumentException($"Episode with ID '{episodeId}' dont exist", nameof(episodeId));
        }

        return await UpdateEpisode(
            episode,
            seasonId,
            episodeNumber,
            germanTitle,
            englishTitle,
            description
        );
    }

    public async Task<EpisodeModel> UpdateEpisode(
        EpisodeModel episode,
        int? seasonId = null,
        int? episodeNumber = null,
        string? germanTitle = null,
        string? englishTitle = null,
        string? description = null
    )
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        if (seasonId is not null)
        {
            episode.SeasonId = (int)seasonId;
        }
        if (episodeNumber is not null)
        {
            episode.EpisodeNumber = (int)episodeNumber;
        }
        if (germanTitle is not null)
        {
            episode.GermanTitle = germanTitle;
        }
        if (englishTitle is not null)
        {
            episode.EnglishTitle = englishTitle;
        }
        if (description is not null)
        {
            episode.Description = description;
        }

        db.Episodes.Update(episode);
        await db.SaveChangesAsync();

        return episode;
    }

    
}