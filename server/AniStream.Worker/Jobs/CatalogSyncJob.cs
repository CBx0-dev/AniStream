using AniStream.Contracts;
using AniStream.Models;
using AniStream.Shared;
using AniStream.Worker.Sidecars;

namespace AniStream.Worker.Jobs;

internal sealed class CatalogSyncJob
{
    private readonly IProviderService _providerService;
    private readonly ISeriesService _seriesService;
    private readonly IGenreService _genreService;

    private readonly WorkerClient _worker;

    public CatalogSyncJob(ILoggerFactory loggerFactory, IProviderService providerService, ISeriesService seriesService, IGenreService genreService)
    {
        _providerService = providerService;
        _seriesService = seriesService;
        _genreService = genreService;

        _worker = new WorkerClient(loggerFactory.CreateLogger<WorkerClient>(), AppConfig.CurrentConfig.SidecarPath);
    }

    public async Task SyncCatalogAsync(SyncCatalogJobModel _)
    {
        string provider = _providerService.GetActiveProvider();
        string[] catalog = await _worker.CatalogAsync(provider);

        foreach (string guid in catalog)
        {
            if (await _seriesService.GetSeries(guid) is not null)
            {
                continue;
            }

            string previewImagePath = Path.Combine(AppConfig.CurrentConfig.AssetsPath, provider);
            SeriesFetchModel seriesFetch = await _worker.SeriesAsync(provider, guid, previewImagePath);
            SeriesModel series = await _seriesService.CreateSeries(
                seriesFetch.Series.Guid,
                seriesFetch.Series.Title,
                seriesFetch.Series.Description,
                seriesFetch.Series.PreviewImage
            );

            foreach (SeriesFetchModel.GenreModel genreFetch in seriesFetch.Genres)
            {
                GenreModel? genre = await _genreService.GetGenre(genreFetch.Key);
                if (genre is null)
                {
                    genre = await _genreService.CreateGenre(genreFetch.Key);
                }

                await _genreService.CreateGenreToSeries(genre.GenreId, series.SeriesId, genreFetch.Main);
            }
        }
    }
}