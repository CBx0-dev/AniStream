namespace AniStream.API.DTO;

public sealed class GenreModel
{
    public required int GenreId { get; set; }

    public required string Key { get; set; }
}

public sealed class GenreCreateModel
{
    public required string Key { get; set; }
}

public sealed class GenreToSeriesCreateModel
{
    public required int GenreId { get; set; }
    public required int SeriesId { get; set; }
    public required bool MainGenre { get; set; }
}

internal static class GenreModelHelper
{
    public static GenreModel ToDTO(this Models.GenreModel model)
    {
        return new GenreModel
        {
            GenreId = model.GenreId,
            Key = model.Key
        };
    }
}