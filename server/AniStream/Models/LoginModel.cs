using System.ComponentModel.DataAnnotations;

namespace AniStream.API.Models;

public sealed class LoginModel
{
    public required string Username { get; set; }
 
    public required string Password { get; set; }
}