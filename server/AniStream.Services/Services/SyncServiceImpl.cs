using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class SyncServiceImpl : ISyncService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ISeriesService _seriesService;

    public SyncServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, ISeriesService seriesService)
    {
        _dbFactory = dbFactory;
        _seriesService = seriesService;
    }

    public async Task<SyncJobModel?> GetSyncJob(int syncJobId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncJobModel> query = from job in db.SyncJobs where job.SyncJobId == syncJobId select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<SyncJobModel?> GetSyncJobBySeries(int seriesId)
    {
        SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            throw new ArgumentException($"Series with ID '{seriesId}' not found", nameof(seriesId));
        }

        return await GetSyncJobBySeries(series);
    }

    public async Task<SyncJobModel?> GetSyncJobBySeries(SeriesModel series)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncJobModel> query = from job in db.SyncJobs
            where job.SeriesId == series.SeriesId
            select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task RequestSync(int seriesId)
    {
        SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            throw new ArgumentException($"Series with ID '{seriesId}' not found", nameof(seriesId));
        }

        await RequestSync(series);
    }

    public async Task RequestSync(SeriesModel series)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        SyncJobModel job = new SyncJobModel(series.SeriesId, SyncJobStatus.Queued, DateTime.UtcNow, null, null);

        db.SyncJobs.Add(job);
        await db.SaveChangesAsync();
    }

    public async Task<bool> IsSyncing(int seriesId)
    {
        SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            throw new ArgumentException($"Series with ID '{seriesId}' not found", nameof(seriesId));
        }

        return await IsSyncing(series);
    }

    public async Task<bool> IsSyncing(SeriesModel series)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncJobModel> jobs = from job in db.SyncJobs
            where job.SeriesId == series.SeriesId &&
                  job.Status != SyncJobStatus.Completed &&
                  job.Status != SyncJobStatus.Failed
            select job;

        return await jobs.AnyAsync();
    }

    public async Task<SyncJobModel[]> GetSyncJobs(SyncJobStatus status)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncJobModel> jobs = from job in db.SyncJobs
            where job.Status == status
            select job;

        return await jobs.ToArrayAsync();
    }

    public async Task<SyncJobModel> UpdateSyncJob(int syncJobId, SyncJobStatus? status = null, DateTime? finished = null, string? error = null)
    {
        SyncJobModel? syncJob = await GetSyncJob(syncJobId);
        if (syncJob is null)
        {
            throw new ArgumentException($"SyncJob with ID '{syncJobId}' not found", nameof(syncJobId));
        }

        return await UpdateSyncJob(syncJob, status, finished, error);
    }

    public async Task<SyncJobModel> UpdateSyncJob(SyncJobModel syncJob, SyncJobStatus? status = null, DateTime? finished = null, string? error = null)
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

        db.SyncJobs.Update(syncJob);
        await db.SaveChangesAsync();

        return syncJob;
    }
}