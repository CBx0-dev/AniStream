using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("watchtime")]
[PrimaryKey(nameof(WatchtimeId))]
public sealed class WatchTimeModel
{
    public int WatchtimeId { get; set; }
    public int EpisodeId { get; set; }
    public int PercentageWatched { get; set; }
    public double StoppedTime { get; set; }
    public string TenantId { get; set; }

    public WatchTimeModel(
        int watchtimeId,
        int episodeId,
        int percentageWatched,
        double stoppedTime,
        string tenantId
    )
    {
        WatchtimeId = watchtimeId;
        EpisodeId = episodeId;
        PercentageWatched = percentageWatched;
        StoppedTime = stoppedTime;
        TenantId = tenantId;
    }

    public WatchTimeModel(
        int episodeId,
        int percentageWatched,
        double stoppedTime,
        string tenantId
    ) : this(
        0,
        episodeId,
        percentageWatched,
        stoppedTime,
        tenantId
    )
    {
    }
}