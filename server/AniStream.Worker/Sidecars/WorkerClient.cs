using System.Diagnostics;
using System.Text.Json;

namespace AniStream.Worker.Sidecars;

internal sealed class WorkerClient
{
    private const string WorkerExecutable = "worker";

    private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly string _executable;

    public WorkerClient(string sidecarFolder)
    {
        _executable = Path.Combine(sidecarFolder, WorkerExecutable);
        if (!File.Exists(_executable))
        {
            throw new InvalidOperationException($"Missing executable: '{_executable}'");
        }
    }

    public Task<string[]> CatalogAsync(string provider) => ExecuteAsync<string[]>("catalog", "-p", provider, "-o", "json");

    public Task<SeriesFetchModel> SeriesAsync(string provider, string guid) => ExecuteAsync<SeriesFetchModel>("series", guid, "-p", provider, "-o", "json");

    public Task<SeasonFetchModel[]> SeasonsAsync(string provider, string guid) => ExecuteAsync<SeasonFetchModel[]>("seasons", guid, "-p", provider, "-o", "json");

    public Task<EpisodeFetchModel[]> EpisodesAsync(string provider, string guid, int seasonNumber) =>
        ExecuteAsync<EpisodeFetchModel[]>("episodes", guid, seasonNumber.ToString(), "-p", provider, "-o", "json");

    public Task ProvidersAsync(string provider, string guid, int seasonNumber, int episodeNumber) =>
        ExecuteAsync<ProviderFetchModel[]>("providers", guid, seasonNumber.ToString(), episodeNumber.ToString(), "-p", provider, "-o", "json");

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

        return JsonSerializer.Deserialize<T>(stdout, _jsonOptions) ?? throw new JsonException($"Failed to deserialize {typeof(T).Name}");
    }
}
