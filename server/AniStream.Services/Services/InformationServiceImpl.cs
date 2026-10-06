using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Reflection;
using Microsoft.Extensions.Caching.Memory;
using AniStream.Contracts;

namespace AniStream.Services;

public sealed class InformationServiceImpl : IInformationService
{
    private const string BackendCacheKey = "BackendUpdateInformation";
    private const string ClientCacheKey = "ClientUpdateInformation";

    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public InformationServiceImpl(IMemoryCache cache)
    {
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("AniStream", GetCurrentVersion()));
        _cache = cache;
    }

    public async Task<BackendInformation> GetBackendUpdateInformation()
    {
        if (!_cache.TryGetValue(BackendCacheKey, out BackendInformation? backendInformation) && backendInformation is not null)
        {
            return backendInformation;
        }

        BackendInformation info = new BackendInformation
        {
            CurrentVersion = GetCurrentVersion(),
            LatestVersion = null,
            ReleaseNotesUrl = null
        };

        try
        {
            using HttpRequestMessage request =
                new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/repos/CBx0-dev/AniStream/releases?per_page=100");

            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return info;
            }

            List<GitHubRelease>? releases = await response.Content.ReadFromJsonAsync<List<GitHubRelease>>();
            if (releases is null)
            {
                return info;
            }

            GitHubRelease? latestRelease = releases
                .Where(release => !release.Draft && !release.Prerelease && (release.TagName?.EndsWith("-server") ?? false))
                .OrderByDescending(r => ExtractSemver(r.TagName!), new SemverComparer())
                .FirstOrDefault();

            if (latestRelease is null)
            {
                return info;
            }

            info.LatestVersion = ExtractSemver(latestRelease.TagName!);
            info.ReleaseNotesUrl = latestRelease.HtmlUrl;
            _cache.Set(BackendCacheKey, info, TimeSpan.FromMinutes(10));
            return info;
        }
        catch
        {
            return info;
        }
    }

    public async Task<string?> GetClientUpdateInformation()
    {
        if (_cache.TryGetValue(ClientCacheKey, out string? content) && content is not null)
        {
            return content;
        }

        try
        {
            using HttpRequestMessage request =
                new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/repos/CBx0-dev/AniStream/releases?per_page=100");

            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            List<GitHubRelease>? releases = await response.Content.ReadFromJsonAsync<List<GitHubRelease>>();
            if (releases is null)
            {
                return null;
            }

            GitHubRelease? latestRelease = releases
                .Where(release => !release.Draft && !release.Prerelease && (release.TagName?.EndsWith("-client") ?? false))
                .OrderByDescending(r => ExtractSemver(r.TagName!), new SemverComparer())
                .FirstOrDefault();

            if (latestRelease is null)
            {
                return null;
            }

            GitHubReleaseAsset? latestAsset = latestRelease.Assets.FirstOrDefault(asset => asset.Name == "latest.json");
            if (latestAsset is null)
            {
                return null;
            }

            _cache.Set(ClientCacheKey, latestAsset.Url);
            return latestAsset.Url;
        }
        catch
        {
            return null;
        }
    }

    private static string ExtractSemver(string tag) => tag.Replace("v", "")[.."-server".Length];

    private static string GetCurrentVersion()
    {
        Assembly? assembly = Assembly.GetEntryAssembly();
        if (assembly is null)
        {
            throw new InvalidOperationException("Could not get entry assembly");
        }
        
        Version? version = assembly.GetName().Version;
        if (version is null)
        {
            throw new InvalidOperationException("Could not get assembly version attribute");
        }
        
        return $"{version.Major}.{version.Minor}.{version.Build}";
        
    }
}