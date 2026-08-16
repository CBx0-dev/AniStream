namespace AniStream.API.DTO;

public sealed class InformationModel
{
    public required string MinVersion { get; set; }

    public required string MaxVersion { get; set; }
}

public sealed class StatsModel
{
    public required int TotalProfiles { get; set; }

    public required int TotalSeries { get; set; }

    public required int DayJobs { get; set; }

    public required int DayJobsCompleted { get; set; }

    public required int DayJobsFailed { get; set; }
}