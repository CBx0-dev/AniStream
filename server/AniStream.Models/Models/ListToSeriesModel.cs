using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("list_to_series")]
[PrimaryKey(nameof(ListId), nameof(SeriesId))]
public sealed class ListToSeriesModel
{
    public int ListId { get; set; }

    public int SeriesId { get; set; }

    public ListToSeriesModel(int listId, int seriesId)
    {
        ListId = listId;
        SeriesId = seriesId;
    }
}