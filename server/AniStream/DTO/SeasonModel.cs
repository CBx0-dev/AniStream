namespace AniStream.API.DTO;

public class SeasonModel
{
    public required int SeasonId { get; set; }

    public required int SeriesId { get; set; }

    public required int SeasonNumber { get; set; }
}

internal static class SeasonModelHelper
{
    public static SeasonModel ToDTO(this Models.SeasonModel model)
    {
        return new SeasonModel()
        {
            SeasonId = model.SeasonId,
            SeriesId = model.SeriesId,
            SeasonNumber = model.SeasonNumber
        };
    }
}