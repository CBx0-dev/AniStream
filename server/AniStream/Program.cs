using Scalar.AspNetCore;
using AniStream.API.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using AniStream.API.Controllers;
using AniStream.Contracts;
using AniStream.API.Serivces;
using AniStream.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using AniStream.API.Middelware;
using AniStream.Utils;

namespace AniStream.API;

public static class Program
{
    public static void Main(string[] args)
    {
        AppConfig.Initialize();

        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = new SnakeCasePolicy();
            });
        builder.Services.Configure<MvcOptions>(options => { options.ModelMetadataDetailsProviders.Add(new EmptyStringEnabledDisplayMetadataProvider()); });
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
                    Name = ".AniStream.Cookies"
                };

                return Task.CompletedTask;
            });
            options.AddSchemaTransformer((schema, context, cancellationToken) =>
            {
                if (schema.Properties is null)
                {
                    return Task.CompletedTask;
                }   

                Dictionary<string, OpenApiSchema> updated = new Dictionary<string, OpenApiSchema>();

                foreach (var (key, propSchema) in schema.Properties)
                {
                    string snake = SnakeCaseConvention.ToSnakeCase(key);
                    updated[snake] = propSchema;
                }

                schema.Properties = updated;
                return Task.CompletedTask;
            });
        });
        builder.Services.AddEndpointsApiExplorer();
        SetupDependencyInjection(builder);
        // TODO setup EFCore integration

        WebApplication app = builder.Build();

        app.UseMiddleware<ProviderMiddelware>();

        if (app.Environment.IsProduction())
        {
            app.UseHttpsRedirection();
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapOpenApi();
        app.MapControllers();
        app.MapScalarApiReference(options => { options.Title = "AniStream API"; });

        app.Run();
    }

    private static void SetupDependencyInjection(WebApplicationBuilder builder)
    {
        // Proprietary services
        builder.Services.AddScoped<ICredentialsService, CredentialsService>();

        // BL Layer
        AutoLoader.LoadServices(builder.Services, new AutoLoader.Options
        {
            DatabaseDriver = AppConfig.CurrentConfig.DatabaseDriver,
            MigrationPath = AppConfig.CurrentConfig.MigrationPath,
            DatabaseMetadataConnectionString = AppConfig.CurrentConfig.DatabaseMetadataConnectionString,
            DatabaseProfileConnectionString = AppConfig.CurrentConfig.DatabaseProfileConnectionString
        });
    }
}