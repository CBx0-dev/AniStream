using System.Data;
using AniStream.Utils;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Migrators;

public sealed class SqliteMigrator : DbMigrator
{
    public SqliteMigrator(string migrationPath, string databaseSchema) : base(migrationPath, databaseSchema, "sqlite")
    {
    }

    public override async Task<int> GetCurrentVersion(DbContext context)
    {
        if (!CheckDbFileExists(context))
        {
            return 0;
        }

        int version = await context.Database.SqlQuery<int>($"PRAGMA user_version;").SingleAsync();
        return version;
    }

    public override async Task Migrate(DbContext context, int fromVersion)
    {
        SqliteConnection connection = (SqliteConnection)context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            connection.Open();
        }

        while (fromVersion < DbContextFactory<DbContext>.SchemaVersion)
        {
            fromVersion++;
            string sql = ReadMigrationFile(fromVersion);

            await using (SqliteCommand command = connection.CreateCommand())
            {
                command.CommandText = sql;
                await command.ExecuteNonQueryAsync();
            }

            await using (SqliteCommand command = connection.CreateCommand())
            {
                command.CommandText = $"PRAGMA user_version = {fromVersion};";
                await command.ExecuteNonQueryAsync();
            }
        }
    }

    private bool CheckDbFileExists(DbContext context)
    {
        string dbFile = GetDatabaseFile(context);
        return File.Exists(dbFile);
    }

    private string GetDatabaseFile(DbContext context)
    {
        SqliteConnection connection = (SqliteConnection)context.Database.GetDbConnection();
        return connection.DataSource;
    }
}