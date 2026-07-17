using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace AniStream.API.Utils;

public class EmptyStringEnabledDisplayMetadataProvider : IDisplayMetadataProvider
{
    public void CreateDisplayMetadata(DisplayMetadataProviderContext context)
    {
        if (context.Key.ModelType == typeof(string))
        {
            context.DisplayMetadata.ConvertEmptyStringToNull = false;
        }
    }
}