using Microsoft.EntityFrameworkCore;

namespace AniStream.Utils;

public abstract class DbMigrator
{
    private readonly string _driverKeyword;
    private readonly string _databaseSchema;
    private readonly string _migrationPath;

    protected DbMigrator(string migrationPath, string databaseSchema, string driverKeyword)
    {
        _migrationPath = migrationPath;
        _databaseSchema = databaseSchema;
        _driverKeyword = driverKeyword;
    }

    public abstract Task<int> GetCurrentVersion(DbContext context);

    public abstract Task Migrate(DbContext context, int fromVersion);

    protected string ReadMigrationFile(int version)
    {
        if (version <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(version), "Version must be positive");
        }

        string fullPath = Path.Join(_migrationPath, _driverKeyword, _databaseSchema, $"{version}.sql");
        if (!File.Exists(fullPath))
        {
            throw new ArgumentException($"Migration file not found for version '{version}'");
        }

        return File.ReadAllText(fullPath);
    }
}