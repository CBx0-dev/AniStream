namespace AniStream.API.DTO;

public sealed class ListModel
{
    public required int ListId { get; set; }

    public required string Name { get; set; }
}

public sealed class ListCreateModel
{
    public required string Name { get; set; }
}

public sealed class ListUpdateModel
{
    public required string Name { get; set; }
}

internal static class ListModelHelper
{
    public static ListModel ToDTO(this Models.ListModel model)
    {
        return new ListModel
        {
            ListId = model.ListId,
            Name = model.Name
        };
    }
}