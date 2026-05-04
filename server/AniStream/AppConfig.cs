namespace AniStream.API;

public sealed class AppConfig
{
    public static AppConfig CurrentConfig { get; private set; }

    public readonly string MigrationPath;
    public readonly string DatabaseDriver;
    public readonly string DatabaseMetadataConnectionString;
    public readonly string DatabaseProfileConnectionString;

    private AppConfig()
    {
        MigrationPath = GetEnvironmentVariable("DATABASE_MIGRATION_PATH");
        DatabaseDriver = GetEnvironmentVariable("DATABASE_DRIVER");
        DatabaseMetadataConnectionString = GetEnvironmentVariable("DATABASE_METADATA_CONNECTION_STRING");
        DatabaseProfileConnectionString = GetEnvironmentVariable("DATABASE_PROFILE_CONNECTION_STRING");
    }

    private string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name) ?? throw new Exception($"Missing environment variable: '{name}'");
    }

    private string GetEnvironmentVariableOrDefault(string name, string defaultValue)
    {
        return Environment.GetEnvironmentVariable(name) ?? defaultValue;
    }

    public static void Initialize()
    {
        CurrentConfig = new AppConfig();
        Console.WriteLine($"Migration path: '{CurrentConfig.MigrationPath}'");
    }
}