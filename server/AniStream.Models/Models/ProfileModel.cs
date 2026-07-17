using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[PrimaryKey(nameof(ProfileId))]
[Table("profile")]
public sealed class ProfileModel
{
    public int ProfileId { get; set; }

    public string Uuid { get; set; }

    public string Name { get; set; }

    public string Password { get; set; }

    public string PasswordSalt { get; set; }
    
    public string BackgroundColor { get; set; }

    public string Eye { get; set; }

    public string Mouth { get; set; }

    public string Theme { get; set; }

    public string Lang { get; set; }

    public bool TosAccepted { get; set; }

    public bool SyncCatalog { get; set; }

    public ProfileModel(
        int profileId,
        string uuid,
        string name,
        string password,
        string passwordSalt,
        string backgroundColor,
        string eye,
        string mouth,
        string theme,
        string lang,
        bool tosAccepted,
        bool syncCatalog
    )
    {
        ProfileId = profileId;
        Uuid = uuid;
        Name = name;
        Password = password;
        PasswordSalt = passwordSalt;
        BackgroundColor = backgroundColor;
        Eye = eye;
        Mouth = mouth;
        Theme = theme;
        Lang = lang;
        TosAccepted = tosAccepted;
        SyncCatalog = syncCatalog;
    }

    public ProfileModel(
        string uuid,
        string name,
        string password,
        string passwordSalt,
        string backgroundColor,
        string eye,
        string mouth,
        string theme,
        string lang,
        bool tosAccepted,
        bool syncCatalog
    ) : this(
        0,
        uuid,
        name,
        password,
        passwordSalt,
        backgroundColor,
        eye,
        mouth,
        theme,
        lang,
        tosAccepted,
        syncCatalog
    )
    {
    }
}