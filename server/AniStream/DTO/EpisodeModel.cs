namespace AniStream.API.DTO;

public sealed class EpisodeModel
{
    public required int EpisodeId { get; set; }

    public required int SeasonId { get; set; }

    public required int EpisodeNumber { get; set; }

    public required string GermanTitle { get; set; }

    public required string EnglishTitle { get; set; }

    public required string Description { get; set; }
}

public sealed class EpisodeCreateModel
{
    public required int SeasonId { get; set; }

    public required int EpisodeNumber { get; set; }

    public required string GermanTitle { get; set; }

    public required string EnglishTitle { get; set; }

    public required string Description { get; set; }
}

public sealed class EpisodeUpdateModel
{
    public required string GermanTitle { get; set; }

    public required string EnglishTitle { get; set; }

    public required string Description { get; set; }
}

internal static class EpisodeModelHelper
{
    public static EpisodeModel ToDTO(this Models.EpisodeModel model)
    {
        return new EpisodeModel
        {
            EpisodeId = model.EpisodeId,
            SeasonId = model.SeasonId,
            EpisodeNumber = model.EpisodeNumber,
            GermanTitle = model.GermanTitle,
            EnglishTitle = model.EnglishTitle,
            Description = model.Description
        };
    }
}