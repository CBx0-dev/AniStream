using Scalar.AspNetCore;
using AniStream.API.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using AniStream.API.Controllers;
using AniStream.Contracts;
using AniStream.API.Serivces;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace AniStream.API;

public static class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.Configure<MvcOptions>(options =>
        {
            options.ModelMetadataDetailsProviders.Add(new EmptyStringEnabledDisplayMetadataProvider());
        });
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.LoginPath = CredentialsController.LOGIN_ROUTE;
                options.LogoutPath = CredentialsController.LOGOUT_ROUTE;
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;

                options.Events.OnRedirectToLogin = context =>
                {
                    if (context.Request.Path.StartsWithSegments("/api"))
                    {
                        context.Response.Clear();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.CompletedTask;
                    }
                    context.Response.Redirect(context.RedirectUri);
                    return Task.CompletedTask;
                };
            });
        builder.Services.AddAuthorization();
        builder.Services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, context, cancellationToken) =>
            {
                document.Components ??= new();
                document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();

                document.Components.SecuritySchemes["cookieAuth"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Cookie,
                    Name = ".AspNetCore.Cookies"
                };

                return Task.CompletedTask;
            });
        });
        builder.Services.AddEndpointsApiExplorer();
        SetupDependencyInjection(builder);

        WebApplication app = builder.Build();

        if (app.Environment.IsProduction())
        {
            app.UseHttpsRedirection();
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapOpenApi();
        app.MapControllers();
        app.MapScalarApiReference(options =>
        {
            options.Title = "AniStream API";
        });

        app.Run();
    }

    private static void SetupDependencyInjection(WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ICredentialsService, CredentialsService>();
    }
}
