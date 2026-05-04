using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace AniStream.Utils;

public sealed partial class SnakeCaseConvention : IModelFinalizingConvention
{
    public void ProcessModelFinalizing(IConventionModelBuilder builder, IConventionContext<IConventionModelBuilder> context)
    {
        foreach (IConventionEntityType entity in builder.Metadata.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName()?.ToLowerInvariant());

            foreach (IConventionProperty property in entity.GetProperties())
            {
                string columnName = property.GetColumnName();
                property.SetColumnName(ToSnakeCase(columnName));
            }
        }
    }

    public static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        return SnakeCaseRegex().Replace(input, "$1_$2").ToLowerInvariant();
    }

    [GeneratedRegex("([a-z0-9])([A-Z])")]
    private static partial Regex SnakeCaseRegex();
}