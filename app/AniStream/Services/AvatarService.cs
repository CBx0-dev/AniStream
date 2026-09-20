using System.Text.Json.Nodes;
using AniStream.Contracts;
using AniStream.Reflection;
using DiceBear;

namespace AniStream.Services;

[Injectable(typeof(IAvatarService))]
public sealed class AvatarService : IAvatarService
{
    private readonly Style _style;

    public AvatarService()
    {
        _style = Style.Parse(Styles.Bottts);
    }

    public string GetAvatar(string eye, string mouth, string backgroundColor)
    {
        Avatar avatar = new Avatar(_style, new JsonObject
        {
            ["eyesVariant"] = eye,
            ["mouthVariant"] = mouth,
            ["backgroundColor"] = backgroundColor
        });

        return avatar.ToSvg();
    }
}