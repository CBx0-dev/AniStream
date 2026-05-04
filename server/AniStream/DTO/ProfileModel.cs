namespace AniStream.API.DTO;

public sealed class ProfileModel
{
    public required int ProfileId { get; set; }

    public required string Uuid { get; set; }

    public required string Name { get; set; }

    public required string BackgroundColor { get; set; }

    public required string Eye { get; set; }

    public required string Mouth { get; set; }

    public required string Theme { get; set; }

    public required string Lang { get; set; }

    public required bool TosAccepted { get; set; }

    public required bool SyncCatalog { get; set; }
}

internal static class ProfileModelHelper
{
    public static ProfileModel ToDTO(this Models.ProfileModel model)
    {
        return new ProfileModel
        {
            ProfileId = model.ProfileId,
            Uuid = model.Uuid,
            Name = model.Name,
            BackgroundColor = model.BackgroundColor,
            Eye = model.Eye,
            Mouth = model.Mouth,
            Theme = model.Theme,
            Lang = model.Lang,
            TosAccepted = model.TosAccepted,
            SyncCatalog = model.SyncCatalog
        };
    }
}