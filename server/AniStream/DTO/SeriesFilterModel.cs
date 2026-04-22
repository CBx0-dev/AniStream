namespace AniStream.API.DTO;

public sealed class SeriesFilterModel
{
    public required int Offset { get; set; }
    public required int Limit { get; set; }

    public required string? SearchText { get; set; }

    public required int[]? GenreIds { get; set; }
}