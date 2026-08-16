namespace AniStream.Contracts;

public class SyncJobStats
{
    public int Total;
    public int Completed;
    public int Failed;

    public SyncJobStats()
    {
        Total = 0;
        Completed = 0;
        Failed = 0;
    }
    
    public SyncJobStats(int total, int completed, int failed)
    {
        Total = total;
        Completed = completed;
        Failed = failed;
    }

}