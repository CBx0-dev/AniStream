using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("episode")]
[PrimaryKey(nameof(EpisodeId))]
public sealed class EpisodeModel
{
    public int EpisodeId { get; set; }

    public int EpisodeNumber { get; set; }

    public string GermanTitle { get; set; }

    public string EnglishTitle { get; set; }

    public string Description { get; set; }

    public EpisodeModel(
        int episodeId,
        int episodeNumber,
        string germanTitle,
        string englishTitle,
        string description
    )
    {
        EpisodeId = episodeId;
        EpisodeNumber = episodeNumber;
        GermanTitle = germanTitle;
        EnglishTitle = englishTitle;
        Description = description;
    }

    public EpisodeModel(
        int episodeNumber,
        string germanTitle,
        string englishTitle,
        string description
    ) : this(
        0,
        episodeNumber,
        germanTitle,
        englishTitle,
        description
    )
    {
    }
}