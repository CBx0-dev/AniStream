using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("genre_to_series")]
[PrimaryKey(nameof(GenreId), nameof(SeriesId))]
public sealed class GenreToSeries
{
    public int GenreId { get; set; }

    public int SeriesId { get; set; }

    public bool MainGenre { get; set; }

    public GenreToSeries(int genreId, int seriesId, bool mainGenre)
    {
        GenreId = genreId;
        SeriesId = seriesId;
        MainGenre = mainGenre;
    }
}   