using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

public enum SyncJobStatus
{
    Queued,
    Processing,
    Completed,
    Failed
}

[Table("sync_job")]
[PrimaryKey(nameof(SyncJobId))]
public sealed class SyncJobModel
{
    public int SyncJobId { get; set; }

    public int SeriesId { get; set; }

    public SyncJobStatus Status { get; set; }

    public DateTime Started { get; set; }

    public DateTime? Finished { get; set; }

    public string? Error { get; set; }

    public SyncJobModel(
        int syncJobId,
        int seriesId,
        SyncJobStatus status,
        DateTime started,
        DateTime? finished,
        string? error
    )
    {
        SyncJobId = syncJobId;
        SeriesId = seriesId;
        Status = status;
        Started = started;
        Finished = finished;
        Error = error;
    }

    public SyncJobModel(
        int seriesId,
        SyncJobStatus status,
        DateTime started,
        DateTime? finished,
        string? error
    ) : this(
        0,
        seriesId,
        status,
        started,
        finished,
        error
    )
    {
    }
}