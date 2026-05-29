namespace AniStream.API.DTO;

public sealed class LoginModel
{
    public required string Uuid { get; set; }
 
    public required string Password { get; set; }
}