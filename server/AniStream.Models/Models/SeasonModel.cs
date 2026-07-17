using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("season")]
[PrimaryKey(nameof(SeasonId))]
public sealed class SeasonModel
{
    public int SeasonId { get; set; }

    public int SeriesId { get; set; }

    public int SeasonNumber { get; set; }

    public SeasonModel(int seasonId, int seriesId, int seasonNumber)
    {
        SeasonId = seasonId;
        SeriesId = seriesId;
        SeasonNumber = seasonNumber;
    }

    public SeasonModel(int seriesId, int seasonNumber) : this(0, seriesId, seasonNumber)
    {
    }
}