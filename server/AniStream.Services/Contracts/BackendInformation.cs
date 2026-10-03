namespace AniStream.Contracts;

public sealed class BackendInformation
{
    public required string CurrentVersion { get; set; }
    public required string? LatestVersion { get; set; }
    public required string? ReleaseNotesUrl { get; set; }
}