namespace AniStream.API.DTO;

public sealed class SeriesModel
{
    public required int SeriesId { get; set; }

    public required string Guid { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public required string? PreviewImage { get; set; }
}

internal static class SeriesModelHelper
{
    public static SeriesModel ToDTO(this Models.SeriesModel model)
    {
        return new SeriesModel
        {
            SeriesId = model.SeriesId,
            Guid = model.Guid,
            Title = model.Title,
            Description = model.Description,
            PreviewImage = model.PreviewImage
        };
    }
}