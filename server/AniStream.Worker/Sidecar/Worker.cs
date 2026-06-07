using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AniStream.Worker.Sidecar;

public sealed class Worker
{
    private const string WORKER_EXECUTABLE = "worker";

    private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly string _executable;

    public Worker(string sidecarFolder)
    {
        _executable = Path.Combine(sidecarFolder, WORKER_EXECUTABLE);
        if (!File.Exists(_executable))
        {
            throw new InvalidOperationException($"Missing executable: '{_executable}'");
        }
    }

    public Task<string[]> CatalogAsync(string provider) => ExecuteAsync<string[]>("catalog", "-p", provider, "-o", "json");

    public Task<SeriesDto> SeriesAsync(string provider, string guid) => ExecuteAsync<SeriesDto>("series", guid, "-p", provider, "-o", "json");

    public Task<SeasonDto[]> SeasonsAsync(string provider, string guid) => ExecuteAsync<SeasonDto[]>("seasons", guid, "-p", provider, "-o", "json");

    public Task<EpisodeDto[]> EpisodesAsync(string provider, string guid, int seasonNumber) =>
        ExecuteAsync<EpisodeDto[]>("episodes", guid, seasonNumber.ToString(), "-p", provider, "-o", "json");

    public Task ProvidersAsync(string provider, string guid, int seasonNumber, int episodeNumber) =>
        ExecuteAsync<ProviderDto[]>("providers", guid, seasonNumber.ToString(), episodeNumber.ToString(), "-p", provider, "-o", "json");

    private async Task<T> ExecuteAsync<T>(params string[] args)
    {
        ProcessStartInfo info = new ProcessStartInfo(_executable, args)
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using Process process = new Process
        {
            StartInfo = info
        };

        process.Start();

        Task<string> stdoutTask = process.StandardOutput.ReadToEndAsync();
        Task<string> stderrTask = process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        string stdout = await stdoutTask;
        string stderr = await stderrTask;

        if (process.ExitCode != 0)
        {
            throw new InvalidOperationException($"Sidecar command failed ({process.ExitCode}): {stderr}");
        }

        return JsonSerializer.Deserialize<T>(stdout, JsonOptions) ?? throw new JsonException($"Failed to deserialize {typeof(T).Name}");
    }
}

public sealed class SeriesDto
{
    [JsonPropertyName("series")]
    public SeriesModel Series { get; set; }

    [JsonPropertyName("genres")]
    public GenreModel[] Genres { get; set; }

    public sealed class SeriesModel
    {
        [JsonPropertyName("series_id")]
        public int SeriesId { get; set; }

        
        [JsonPropertyName("guid")]
        public string Guid { get; set; }

        
        [JsonPropertyName("title")]
        public string Title { get; set; }

        
        [JsonPropertyName("description")]
        public string Description { get; set; }

        
        [JsonPropertyName("preview_image")]
        public string? PreviewImage { get; set; }
    }

    public sealed class GenreModel
    {
        [JsonPropertyName("key")]
        public string Key { get; set; }

        
        [JsonPropertyName("main")]
        public bool Main { get; set; }
    }
}

public sealed class SeasonDto
{
    
    [JsonPropertyName("series_id")]
    public int SeriesId { get; set; }

    
    [JsonPropertyName("season_number")]
    public int SeasonNumber { get; set; }
}

public sealed class EpisodeDto
{
    [JsonPropertyName("episode_number")]
    public int EpisodeNumber { get; set; }

    
    [JsonPropertyName("german_title")]
    public string GermanTitle { get; set; }

    
    [JsonPropertyName("english_title")]
    public string EnglishTitle { get; set; }

    
    [JsonPropertyName("description")]
    public string Description { get; set; }
}

public sealed class ProviderDto
{
    
    [JsonPropertyName("name")]
    public string Name { get; set; }

    
    [JsonPropertyName("language")]
    public LanguageCode Language { get; set; }

    
    [JsonPropertyName("embedded_url")]
    public string EmbeddedUrl { get; set; }

    public enum LanguageCode
    {
        DE_DUB = 0,
        DE_SUP = 1,
        EN_DUB = 2,
        EN_SUP = 3,
        UNKNOWN = 4,
    }
}