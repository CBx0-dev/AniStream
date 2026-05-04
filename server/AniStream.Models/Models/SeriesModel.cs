using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("series")]
[PrimaryKey(nameof(SeriesId))]
public sealed class SeriesModel
{
    public int SeriesId { get; set; }

    public string Guid { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string? PreviewImage { get; set; }

    public SeriesModel(
        int seriesId,
        string guid,
        string title,
        string description,
        string? previewImage
    )
    {
        SeriesId = seriesId;
        Guid = guid;
        Title = title;
        Description = description;
        PreviewImage = previewImage;
    }

    public SeriesModel(
        string guid,
        string title,
        string description,
        string? previewImage
    ) : this (
        0,
        guid,
        title,
        description,
        previewImage
    )
    {
    }
}