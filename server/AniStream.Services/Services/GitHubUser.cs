using System.Text.Json.Serialization;

namespace AniStream.Services;

public sealed class GitHubUser
{
    [JsonPropertyName("login")]
    public string? Login { get; set; }

    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("node_id")]
    public string? NodeId { get; set; }

    [JsonPropertyName("avatar_url")]
    public string? AvatarUrl { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("html_url")]
    public string? HtmlUrl { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }
}