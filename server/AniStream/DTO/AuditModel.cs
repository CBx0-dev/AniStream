using AniStream.Models;

namespace AniStream.API.DTO;

public enum AuditKind
{
    Catalog,
    Series,
    Provider
}

public sealed class AuditModel
{
    public required int JobId { get; set; }
    
    public required AuditKind Kind { get; set; }
    
    public required string JobName { get; set; }
    
    public required string Provider { get; set; }
    
    public required SyncJobStatus Status { get; set; }
    
    public required DateTime StartedAt { get; set; }
    
    public required DateTime? FinishedAt { get; set; }
    
    public required string? Error { get; set; }
    
    public required DateTime? Expires { get; set; }
}