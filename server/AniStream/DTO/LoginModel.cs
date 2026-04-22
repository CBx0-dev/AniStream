namespace AniStream.API.DTO;

public sealed class LoginModel
{
    public required string Username { get; set; }
 
    public required string Password { get; set; }
}