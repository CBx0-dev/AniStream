using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[PrimaryKey(nameof(ProfileId))]
[Table("profile")]
public class ProfileModel
{
    public int ProfileId { get; init; }

    public string Uuid { get; init; }

    public string Name { get; init; }

    public string BackgroundColor { get; init; }

    public string Eye { get; init; }

    public string Mouth { get; init; }

    public string Theme { get; init; }

    public string Lang { get; init; }

    public bool TosAccepted { get; init; }

    public bool SyncCatalog { get; init; }
}