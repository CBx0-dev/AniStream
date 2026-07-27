using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class CatalogSyncServiceImpl : ICatalogSyncService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;

    public CatalogSyncServiceImpl(DbContextFactory<MetadataDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<SyncCatalogJobModel?> GetSyncJob(int syncCatalogJobId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncCatalogJobModel> query = from job in db.SyncCatalogJobs
            where job.SyncCatalogJobId == syncCatalogJobId
            select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task RequestSync()
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SyncCatalogJobModel job = new SyncCatalogJobModel(SyncJobStatus.Queued, DateTime.UtcNow, null, null);
        
        db.SyncCatalogJobs.Add(job);
        await db.SaveChangesAsync();
    }

    public async Task<SyncCatalogJobModel[]> GetSyncJobs(SyncJobStatus status)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncCatalogJobModel> query = from job in db.SyncCatalogJobs
            where job.Status == status
            select job;

        return await query.ToArrayAsync();
    }

    public async Task<SyncCatalogJobModel[]> GetSyncJobs()
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncCatalogJobModel> query = from job in db.SyncCatalogJobs select job;

        return await query.ToArrayAsync();
    }

    public async Task<SyncCatalogJobModel> UpdateSyncJob(
        int syncCatalogJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    )
    {
        SyncCatalogJobModel? job = await GetSyncJob(syncCatalogJobId);
        if (job is null)
        {
            throw new ArgumentException($"SyncJob with ID '{syncCatalogJobId}' not found", nameof(syncCatalogJobId));
        }

        return await UpdateSyncJob(job, status, finished, error);
    }

    public async Task<SyncCatalogJobModel> UpdateSyncJob(
        SyncCatalogJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
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

        if (error is not null)
        {
            syncJob.Error = error;
        }
        
        db.SyncCatalogJobs.Update(syncJob);
        await db.SaveChangesAsync();

        return syncJob;
    }
}