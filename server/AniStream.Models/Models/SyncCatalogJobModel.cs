using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("sync_catalog_job")]
[PrimaryKey(nameof(SyncCatalogJobId))]
public sealed class SyncCatalogJobModel
{
    public int SyncCatalogJobId { get; set; }

    public SyncJobStatus Status { get; set; }

    public DateTime Started { get; set; }

    public DateTime? Completed { get; set; }

    public string? Error { get; set; }

    public SyncCatalogJobModel(
        int syncCatalogJobId,
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error
    )
    {
        SyncCatalogJobId = syncCatalogJobId;
        Status = status;
        Started = started;
        Completed = completed;
        Error = error;
    }

    public SyncCatalogJobModel(
        SyncJobStatus status,
        DateTime started,
        DateTime? completed,
        string? error
    ) : this(
        0,
        status,
        started,
        completed,
        error
    )
    {
    }
}