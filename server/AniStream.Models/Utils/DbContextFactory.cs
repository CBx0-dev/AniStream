using AniStream.Migrators;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Utils;

public abstract class DbContextFactory<T> where T : DbContext
{
    public const int SchemaVersion = 1;

    private readonly DbType _dbType;
    private readonly string _migrationFolder;
    private readonly string _databaseSchema;

    protected DbContextFactory(string dbType, string migrationFolder, string databaseSchema)
    {
        if (!Directory.Exists(migrationFolder))
        {
            throw new ArgumentException($"Migration folder '{migrationFolder}' does not exist", nameof(migrationFolder));
        }

        if (databaseSchema != "metadata" && databaseSchema != "profile")
        {
            throw new ArgumentException($"Unknown database schema '{databaseSchema}', must be 'profile' or 'metadata'", nameof(databaseSchema));
        }

        _migrationFolder = migrationFolder;
        _databaseSchema = databaseSchema;

        switch (dbType.ToLower())
        {
            case "sqlite":
                _dbType = DbType.Sqlite;
                break;
            default:
                throw new ArgumentException($"Unknown database driver '{_dbType}'", nameof(dbType));
        }
    }

    public abstract Task<T> GetContext();

    protected void UseDbVariant(DbContextOptionsBuilder<T> builder, string connectionString)
    {
        switch (_dbType)
        {
            case DbType.Sqlite:
                builder.UseSqlite(connectionString);
                break;
            default:
                throw new InvalidOperationException($"Cannot setup EF for '{_dbType}'");

        }
    }

    protected async Task MigrateDatabaseIfRequired(T context)
    {
        DbMigrator migrator = GetMigrator();
        int currentVersion = await migrator.GetCurrentVersion(context);
        if (currentVersion > SchemaVersion)
        {
            throw new Exception($"Database schema is newer than expected ({currentVersion} > {SchemaVersion})");
        }

        if (currentVersion < SchemaVersion)
        {
            await migrator.Migrate(context, currentVersion);
        }
    }

    private DbMigrator GetMigrator()
    {
        return _dbType switch
        {
            DbType.Sqlite => new SqliteMigrator(_migrationFolder, _databaseSchema),
            _ => throw new InvalidOperationException($"Cannot find migrator for '{_dbType}'")
        };
    }

    private enum DbType
    {
        Sqlite
    }
}