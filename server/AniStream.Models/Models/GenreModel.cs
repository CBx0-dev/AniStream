
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("genre")]
[PrimaryKey(nameof(GenreId))]
public sealed class GenreModel
{
    public int GenreId { get; set; }

    public string Key { get; set; }

    public GenreModel(string key) : this(0, key)
    {
        
    }

    public GenreModel(int genreId, string key)
    {
        GenreId = genreId;
        Key = key;
    }
}