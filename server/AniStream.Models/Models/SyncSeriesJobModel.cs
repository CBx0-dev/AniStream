using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("sync_series_job")]
[PrimaryKey(nameof(SyncSeriesJobId))]
public sealed class SyncSeriesJobModel
{
    public int SyncSeriesJobId { get; set; }

    public int SeriesId { get; set; }

    public SyncJobStatus Status { get; set; }

    public DateTime Started { get; set; }

    public DateTime? Completed { get; set; }

    public string? Error { get; set; }

    public SyncSeriesJobModel(
        int syncSeriesJobId,
        int seriesId,
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error
    )
    {
        SyncSeriesJobId = syncSeriesJobId;
        SeriesId = seriesId;
        Status = status;
        Started = started;
        Completed = completed;
        Error = error;
    }

    public SyncSeriesJobModel(
        int seriesId,
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error
    ) : this(
        0,
        seriesId,
        status,
        started,
        completed,
        error
    )
    {
    }
}