
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("genre")]
[PrimaryKey(nameof(GenreId))]
public class GenreModel
{
    public int GenreId {get; set; }

    public string Key { get; set; }    
}