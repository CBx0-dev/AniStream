using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public sealed class SeriesSyncServiceImpl : ISeriesSyncService
{
    private readonly DbContextFactory<MetadataDbContext> _dbFactory;
    private readonly ISeriesService _seriesService;

    public SeriesSyncServiceImpl(DbContextFactory<MetadataDbContext> dbFactory, ISeriesService seriesService)
    {
        _dbFactory = dbFactory;
        _seriesService = seriesService;
    }

    public async Task<SyncSeriesJobModel?> GetSyncJob(int syncSeriesJobId)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncSeriesJobModel> query = from job in db.SyncSeriesJobs where job.SyncSeriesJobId == syncSeriesJobId select job;

        return await query.FirstOrDefaultAsync();
    }

    public async Task<SyncSeriesJobModel?> GetSyncJobBySeries(int seriesId)
    {
        SeriesModel? series = await _seriesService.GetSeries(seriesId);
        if (series is null)
        {
            throw new ArgumentException($"Series with ID '{seriesId}' not found", nameof(seriesId));
        }

        return await GetSyncJobBySeries(series);
    }

    public async Task<SyncSeriesJobModel?> GetSyncJobBySeries(SeriesModel series)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncSeriesJobModel> query = from job in db.SyncSeriesJobs
            where job.SeriesId == series.SeriesId
            orderby job.SyncSeriesJobId descending
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

        SyncSeriesJobModel job = new SyncSeriesJobModel(series.SeriesId, SyncJobStatus.Queued, DateTime.UtcNow, null, null);

        db.SyncSeriesJobs.Add(job);
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

        IQueryable<SyncSeriesJobModel> query = from job in db.SyncSeriesJobs
            where job.SeriesId == series.SeriesId &&
                  job.Status != SyncJobStatus.Completed &&
                  job.Status != SyncJobStatus.Failed
            select job;

        return await query.AnyAsync();
    }

    public async Task<SyncSeriesJobModel[]> GetSyncJobs(SyncJobStatus status)
    {
        await using MetadataDbContext db = await _dbFactory.GetContext();

        IQueryable<SyncSeriesJobModel> query = from job in db.SyncSeriesJobs
            where job.Status == status
            select job;

        return await query.ToArrayAsync();
    }

    public async Task<SyncSeriesJobModel> UpdateSyncJob(
        int syncSeriesJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    )
    {
        SyncSeriesJobModel? job = await GetSyncJob(syncSeriesJobId);
        if (job is null)
        {
            throw new ArgumentException($"SyncJob with ID '{syncSeriesJobId}' not found", nameof(syncSeriesJobId));
        }

        return await UpdateSyncJob(job, status, finished, error);
    }

    public async Task<SyncSeriesJobModel> UpdateSyncJob(
        SyncSeriesJobModel syncJob,
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

        db.SyncSeriesJobs.Update(syncJob);
        await db.SaveChangesAsync();

        return syncJob;
    }
}