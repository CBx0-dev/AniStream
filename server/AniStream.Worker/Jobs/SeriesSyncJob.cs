using AniStream.Contracts;
using AniStream.Models;
using AniStream.Shared;
using AniStream.Worker.Sidecars;

namespace AniStream.Worker.Jobs;

internal sealed class SeriesSyncJob
{
    private readonly IProviderService _providerService;
    private readonly ISeriesService _seriesService;
    private readonly ISeasonService _seasonService;
    private readonly IEpisodeService _episodeService;

    private readonly WorkerClient _worker;

    public SeriesSyncJob(
        ILoggerFactory loggerFactory,
        IProviderService providerService,
        ISeriesService seriesService,
        ISeasonService seasonService,
        IEpisodeService episodeService
    )
    {
        _providerService = providerService;
        _seriesService = seriesService;
        _seasonService = seasonService;
        _episodeService = episodeService;

        _worker = new WorkerClient(loggerFactory.CreateLogger<WorkerClient>(), AppConfig.CurrentConfig.SidecarPath);
    }

    public async Task SyncSeriesAsync(SyncSeriesJobModel job)
    {
        SeriesModel? series = await _seriesService.GetSeries(job.SeriesId);

        if (series is null)
        {
            throw new InvalidOperationException($"Series with id {job.SeriesId} does not exist");
        }

        SeasonModel[] existingSeasons = await _seasonService.GetSeasons(job.SeriesId);
        SeasonFetchModel[] allSeasons = await _worker.SeasonsAsync(_providerService.GetActiveProvider(), series.Guid);

        foreach (SeasonFetchModel season in allSeasons)
        {
            SeasonModel? existingSeason = existingSeasons.FirstOrDefault(s => s.SeasonNumber == season.SeasonNumber);
            EpisodeFetchModel[] episodes = await _worker.EpisodesAsync(_providerService.GetActiveProvider(), series.Guid, season.SeasonNumber);

            if (existingSeason is null)
            {
                await SyncNewSeasonAsync(series.SeriesId, season.SeasonNumber, episodes);
            }
            else
            {
                await SyncExistingSeasonAsync(existingSeason, episodes);
            }
        }
    }

    private async Task SyncExistingSeasonAsync(SeasonModel season, EpisodeFetchModel[] episodes)
    {
        EpisodeModel[] existingEpisodes = await _episodeService.GetEpisodes(season.SeasonId);

        foreach (EpisodeFetchModel episode in episodes)
        {
            EpisodeModel? existingEpisode = existingEpisodes.FirstOrDefault(s => s.EpisodeNumber == episode.EpisodeNumber);
            if (existingEpisode is null)
            {
                await _episodeService.CreateEpisode(
                    season.SeasonId,
                    episode.EpisodeNumber,
                    episode.GermanTitle,
                    episode.EnglishTitle,
                    episode.Description
                );
                continue;
            }

            await _episodeService.UpdateEpisode(
                existingEpisode.EpisodeId,
                germanTitle: episode.GermanTitle,
                englishTitle: episode.EnglishTitle,
                description: episode.Description
            );
        }
    }

    private async Task SyncNewSeasonAsync(int seriesId, int seasonNumber, EpisodeFetchModel[] episodes)
    {
        SeasonModel season = await _seasonService.CreateSeason(seriesId, seasonNumber);

        foreach (EpisodeFetchModel episode in episodes)
        {
            await _episodeService.CreateEpisode(
                season.SeasonId,
                episode.EpisodeNumber,
                episode.GermanTitle,
                episode.EnglishTitle,
                episode.Description
            );
        }
    }
}