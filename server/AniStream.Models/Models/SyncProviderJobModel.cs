using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("sync_provider_job")]
[PrimaryKey(nameof(SyncProviderJobId))]
public sealed class SyncProviderJobModel
{
    public int SyncProviderJobId { get; set; }

    public int EpisodeId { get; set; }

    public SyncJobStatus Status { get; set; }

    public DateTime Started { get; set; }

    public DateTime? Completed { get; set; }

    public string? Error { get; set; }

    public DateTime? Expires { get; set; }

    public SyncProviderJobModel(
        int syncProviderJobId,
        int episodeId,
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error,
        DateTime? expires
    )
    {
        SyncProviderJobId = syncProviderJobId;
        EpisodeId = episodeId;
        Status = status;
        Started = started;
        Completed = completed;
        Error = error;
        Expires = expires;
    }

    public SyncProviderJobModel(
        int episodeId,
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error,
        DateTime? expires
    ) : this(
        0,
        episodeId,
        status,
        started,
        completed,
        error,
        expires
    )
    {
    }
}