namespace AniStream.Services;

public class SemverComparer : IComparer<string>
{
    public int Compare(string? x, string? y)
    {
        (int Major, int Minor, int Patch) a = Parse(x);
        (int Major, int Minor, int Patch) b = Parse(y);

        int result = a.Major.CompareTo(b.Major);
        if (result != 0)
        {
            return result;
        }

        result = a.Minor.CompareTo(b.Minor);
        if (result != 0)
        {
            return result;
        }

        return a.Patch.CompareTo(b.Patch);
    }

    private static (int Major, int Minor, int Patch) Parse(string? version)
    {
        string[] parts = version!.Split('.');

        return (
            int.Parse(parts[0]),
            int.Parse(parts[1]),
            int.Parse(parts[2])
        );
    }
}