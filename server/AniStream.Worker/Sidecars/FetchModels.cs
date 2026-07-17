using System.Text.Json.Serialization;

namespace AniStream.Worker.Sidecars;

internal sealed class SeriesFetchModel
{
    [JsonPropertyName("series")]
    public SeriesModel Series { get; set; }

    [JsonPropertyName("genres")]
    public GenreModel[] Genres { get; set; }

    internal sealed class SeriesModel
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

    internal sealed class GenreModel
    {
        [JsonPropertyName("key")]
        public string Key { get; set; }

        [JsonPropertyName("main")]
        public bool Main { get; set; }
    }
}

internal sealed class SeasonFetchModel
{
    [JsonPropertyName("series_id")]
    public int SeriesId { get; set; }

    [JsonPropertyName("season_number")]
    public int SeasonNumber { get; set; }
}

internal sealed class EpisodeFetchModel
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

internal sealed class ProviderFetchModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("language")]
    public LanguageCode Language { get; set; }

    [JsonPropertyName("embeddedURL")]
    public string EmbeddedUrl { get; set; }

    internal enum LanguageCode
    {
        DE_DUB = 0,
        DE_SUP = 1,
        EN_DUB = 2,
        EN_SUP = 3,
        UNKNOWN = 4,
    }
}
