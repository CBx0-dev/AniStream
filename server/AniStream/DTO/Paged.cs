namespace AniStream.API.DTO;

public sealed class TotalInformation
{
    public required int Items { get; init; }
    public required int Running  { get; init; }
    public required int Queued  { get; init; }
    public required int Failed { get; init; }
    public required int Completed { get; init; }
}

public sealed class Paged<T>
{
    public required T[] Items { get; init; }
    public required int Start { get; init; }
    public required int Count { get; init; }
    public required TotalInformation Total { get; init; }
}