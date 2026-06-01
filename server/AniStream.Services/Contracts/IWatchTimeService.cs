using AniStream.Models;

namespace AniStream.Contracts;

public interface IWatchTimeService
{
    public Task<WatchTimeModel?> GetWatchTime(int episodeId);

    public Task<WatchTimeModel[]> GetWatchTimesOfSeries(int seriesId);

    public Task<WatchTimeModel[]> GetWatchTimesOfSeason(int seasonId);

    public Task<WatchTimeModel?> GetWatchTimeOfEpisode(int episodeId);

    public Task<int> GetTotalWatchProgression(int seriesId);

    public Task<WatchTimeModel> CreateWatchTime(int episodeId, int percentageWatched, double stoppedTime);

    public Task<WatchTimeModel> UpdateWatchTime(int watchtimeId, int? percentageWatched = null, double? stoppedTime = null);

    public Task<WatchTimeModel> UpdateWatchTime(WatchTimeModel watchtime, int? percentageWatched = null, double? stoppedTime = null);

    public Task UpdateWatchTimes(WatchTimeModel[] watchTimes, int? percentageWatched = null, double? stoppedTime = null);

    public Task UpdateWatchTimeOfEpisode(int episodeId, int? percentageWatched = null, double? stoppedTime = null);

    public Task UpdateWatchTimeOfSeason(int seasonId, int? percentageWatched = null, double? stoppedTime = null);

    public Task UpdateWatchTimeOfSeries(int seriesId, int? percentageWatched = null, double? stoppedTime = null);
}