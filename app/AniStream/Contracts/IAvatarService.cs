namespace AniStream.Contracts;

public interface IAvatarService
{
    public string GetAvatar(string eye, string mouth, string backgroundColor);
}