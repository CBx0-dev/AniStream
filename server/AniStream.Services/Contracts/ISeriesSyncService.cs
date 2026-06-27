using AniStream.Models;

namespace AniStream.Contracts;

public interface ISeriesSyncService
{
    public Task<SyncSeriesJobModel?> GetSyncJob(int syncSeriesJobId);

    public Task<SyncSeriesJobModel?> GetSyncJobBySeries(int seriesId);

    public Task<SyncSeriesJobModel?> GetSyncJobBySeries(SeriesModel series);

    public Task RequestSync(int seriesId);

    public Task RequestSync(SeriesModel series);

    public Task<bool> IsSyncing(int seriesId);

    public Task<bool> IsSyncing(SeriesModel series);

    public Task<SyncSeriesJobModel[]> GetSyncJobs(SyncJobStatus status);

    public Task<SyncSeriesJobModel> UpdateSyncJob(
        int syncSeriesJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );

    public Task<SyncSeriesJobModel> UpdateSyncJob(
        SyncSeriesJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );
}