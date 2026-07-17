using AniStream.Contracts;

namespace AniStream.API.Middelware;

public class ProviderMiddelware
{
    private readonly RequestDelegate _next;

    public ProviderMiddelware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IProviderService providerService)
    {
        if (context.Request.RouteValues.TryGetValue("provider", out object? value))
        {
            if (value is string provider)
            {
                providerService.SetActiveProvider(provider);
            }
        }

        await _next(context);
    }
}