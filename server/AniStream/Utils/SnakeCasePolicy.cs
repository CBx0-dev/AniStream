using System.Text.Json;
using AniStream.Utils;

namespace AniStream.API.Utils;

public class SnakeCasePolicy : JsonNamingPolicy
{
    public override string ConvertName(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return name;
        }

        return SnakeCaseConvention.ToSnakeCase(name);
    }
}