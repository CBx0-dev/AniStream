using AniStream.Models;

namespace AniStream.Contracts;

public interface ISyncService
{
    public Task<SyncJobModel?> GetSyncJob(int syncJobId);

    public Task<SyncJobModel?> GetSyncJobBySeries(int seriesId);

    public Task<SyncJobModel?> GetSyncJobBySeries(SeriesModel series);

    public Task RequestSync(int seriesId);

    public Task RequestSync(SeriesModel series);

    public Task<bool> IsSyncing(int seriesId);

    public Task<bool> IsSyncing(SeriesModel series);

    public Task<SyncJobModel[]> GetSyncJobs(SyncJobStatus status);

    public Task<SyncJobModel> UpdateSyncJob(
        int syncJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );

    public Task<SyncJobModel> UpdateSyncJob(
        SyncJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );
}