using AniStream.Models;

namespace AniStream.Contracts;

public interface IProviderSyncService
{
    public Task<SyncProviderJobModel?> GetSyncJob(int syncProviderJobId);

    public Task<SyncProviderJobModel?> GetSyncJobByEpisode(int episodeId);

    public Task<SyncProviderJobModel?> GetSyncJobByEpisode(EpisodeModel episode);

    public Task RequestSync(int episodeId);

    public Task RequestSync(EpisodeModel episode);

    public Task<bool> IsSyncing(int episodeId);

    public Task<bool> IsSyncing(EpisodeModel episode);

    public Task<SyncProviderJobModel[]> GetSyncJobs(SyncJobStatus status);

    public Task<SyncProviderJobModel> UpdateSyncJob(
        int syncProviderJobId,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        DateTime? expires = null,
        string? error = null
    );

    public Task<SyncProviderJobModel> UpdateSyncJob(
        SyncProviderJobModel syncJob,
        SyncJobStatus? status = null,
        DateTime? finished = null,
        DateTime? expires = null,
        string? error = null
    );

    public Task CreateSyncResult(int syncProviderJobId, string provider, string url, int languageCode);

    public Task<SyncProviderJobResultModel[]> GetSyncResults(int episodeId);
}