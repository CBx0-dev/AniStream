using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("watchlist")]
[PrimaryKey(nameof(WatchlistId))]
public sealed class WatchListModel
{
    public int WatchlistId { get; set; }

    public int SeriesId { get; set; }

    public string TenantId { get; set; }

    public WatchListModel(int seriesId, string tenantId) : this(0, seriesId, tenantId)
    {
    }

    public WatchListModel(int watchlistId, int seriesId, string tenantId)
    {
        WatchlistId = watchlistId;
        SeriesId = seriesId;
        TenantId = tenantId;
    }
}