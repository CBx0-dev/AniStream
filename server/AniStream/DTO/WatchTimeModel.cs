namespace AniStream.API.DTO;

public sealed class WatchTimeModel
{
    public required int WatchtimeId { get; set; }

    public required int EpisodeId { get; set; }

    public required int PercentageWatched { get; set; }

    public required double StoppedTime { get; set; }

    public required string TenantId { get; set; }
}

public sealed class WatchTimeCreateModel
{
    public required int EpisodeId { get; set; }

    public required int PercentageWatched { get; set; }

    public required double StoppedTime { get; set; }
}

public sealed class WatchTimeUpdateModel
{
    public required int? PercentageWatched { get; set; }

    public required double? StoppedTime { get; set; }
}


public sealed class WatchTimeTotalModel
{
    public required int TotalProgression { get; set; }
}

internal static class WatchTimeModelHelper
{
    public static WatchTimeModel ToDTO(this Models.WatchTimeModel model)
    {
        return new WatchTimeModel
        {
            WatchtimeId = model.WatchtimeId,
            EpisodeId = model.EpisodeId,
            PercentageWatched = model.PercentageWatched,
            StoppedTime = model.StoppedTime,
            TenantId = model.TenantId
        };
    }
}