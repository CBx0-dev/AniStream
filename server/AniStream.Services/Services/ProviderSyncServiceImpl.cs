using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class ProviderSyncServiceImpl : IProviderSyncService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly IEpisodeService _episodeService;

    public ProviderSyncServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, IEpisodeService episodeService)
    {
        _dbFactory = dbFactory;
        _episodeService = episodeService;
    }

    public async Task<SyncProviderJobModel?> GetSyncJob(int syncProviderJobId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncProviderJobModel> query = from job in db.SyncProviderJobs where job.SyncProviderJobId == syncProviderJobId select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<SyncProviderJobModel?> GetSyncJobByEpisode(int episodeId)
    {
        EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            throw new ArgumentException($"Episode with ID {episodeId} not found", nameof(episodeId));
        }

        return await GetSyncJobByEpisode(episode);
    }

    public async Task<SyncProviderJobModel?> GetSyncJobByEpisode(EpisodeModel episode)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncProviderJobModel> query = from job in db.SyncProviderJobs
            where job.EpisodeId == episode.EpisodeId
            select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task RequestSync(int episodeId)
    {
        EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            throw new ArgumentException($"Episode with ID {episodeId} not found", nameof(episodeId));
        }

        await RequestSync(episode);
    }

    public async Task RequestSync(EpisodeModel episode)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SyncProviderJobModel job = new SyncProviderJobModel(episode.EpisodeId, SyncJobStatus.Queued, DateTime.UtcNow, null, null, null);

        db.SyncProviderJobs.Add(job);
        await db.SaveChangesAsync();
    }

    public async Task<bool> IsSyncing(int episodeId)
    {
        EpisodeModel? episode = await _episodeService.GetEpisode(episodeId);
        if (episode is null)
        {
            throw new ArgumentException($"Episode with ID {episodeId} not found", nameof(episodeId));
        }

        return await IsSyncing(episode);
    }

    public async Task<bool> IsSyncing(EpisodeModel episode)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncProviderJobModel> query = from job in db.SyncProviderJobs
            where job.EpisodeId == episode.EpisodeId &&
                  job.Status != SyncJobStatus.Completed &&
                  job.Status != SyncJobStatus.Failed
            select job;

        return await query.AnyAsync();
    }

    public async Task<SyncProviderJobModel[]> GetSyncJobs(SyncJobStatus status)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncProviderJobModel> query = from job in db.SyncProviderJobs
            where job.Status == status
            select job;

        return await query.ToArrayAsync();
    }

    public async Task<SyncProviderJobModel> UpdateSyncJob(
        int syncProviderJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        DateTime? expires = null,
        string? error = null
    )
    {
        SyncProviderJobModel? job = await GetSyncJob(syncProviderJobId);
        if (job is null)
        {
            throw new ArgumentException($"Job with ID {syncProviderJobId} not found", nameof(syncProviderJobId));
        }

        return await UpdateSyncJob(
            job,
            status,
            finished,
            expires,
            error
        );
    }

    public async Task<SyncProviderJobModel> UpdateSyncJob(
        SyncProviderJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        DateTime? expires = null,
        string? error = null
    )
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        if (status is not null)
        {
            syncJob.Status = (SyncJobStatus)status;
        }

        if (finished is not null)
        {
            syncJob.Completed = (DateTime)finished;
        }

        if (expires is not null)
        {
            syncJob.Expires = (DateTime)expires;
        }

        if (error is not null)
        {
            syncJob.Error = error;
        }

        db.SyncProviderJobs.Update(syncJob);
        await db.SaveChangesAsync();

        return syncJob;
    }

    public async Task CreateSyncResult(int syncProviderJobId, string provider, string url, int languageCode)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SyncProviderJobResultModel result = new SyncProviderJobResultModel(syncProviderJobId, provider, url, languageCode);

        db.SyncProviderJobResults.Add(result);
        await db.SaveChangesAsync();
    }

    public async Task<SyncProviderJobResultModel[]> GetSyncResults(int episodeId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncProviderJobModel> query1 = from job in db.SyncProviderJobs
            where job.EpisodeId == episodeId &&
                  job.Status == SyncJobStatus.Completed &&
                  job.Expires.HasValue
            orderby job.SyncProviderJobId descending
            select job;

        SyncProviderJobModel? latestJob = await query1.FirstOrDefaultAsync();
        if (latestJob?.Expires is null || latestJob.Expires.Value < DateTime.UtcNow)
        {
            return [];
        }

        IQueryable<SyncProviderJobResultModel> query = from result in db.SyncProviderJobResults
            where result.SyncProviderJobId == latestJob.SyncProviderJobId
            select result;

        return await query.ToArrayAsync();
    }
}