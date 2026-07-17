using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace AniStream.Integration;

public sealed class TestingMiddleware
{
    public const string HEADER = "Testing-ID";
    public const string ITEM_KEY = "TestingId";

    private readonly RequestDelegate _next;

    public TestingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await _next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(HEADER, out StringValues value))
        {
            throw new Exception("Testing-ID header not found");
        }

        string? id = value.FirstOrDefault();
        if (!string.IsNullOrEmpty(id))
        {
            context.Items[ITEM_KEY] = id;
        }

        await _next(context);
    }
}