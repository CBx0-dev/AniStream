using AniStream.Models;

namespace AniStream.Contracts;

public interface ICatalogSyncService
{
    public Task<SyncCatalogJobModel?> GetSyncJob(int syncCatalogJobId);

    public Task RequestSync();

    public Task<SyncCatalogJobModel[]> GetSyncJobs(SyncJobStatus status);

    public Task<SyncCatalogJobModel[]> GetSyncJobs();

    public Task<SyncCatalogJobModel> UpdateSyncJob(
        int syncCatalogJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );
    
    public Task<SyncCatalogJobModel> UpdateSyncJob(
        SyncCatalogJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        string? error = null
    );
}