# Build context: repository root

# Stage 1: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY server/AniStream/AniStream.csproj              server/AniStream/
COPY server/AniStream.Models/AniStream.Models.csproj server/AniStream.Models/
COPY server/AniStream.Services/AniStream.Services.csproj server/AniStream.Services/
COPY server/AniStream.Shared/AniStream.Shared.csproj server/AniStream.Shared/
COPY server/AniStream.Worker/AniStream.Worker.csproj server/AniStream.Worker/

RUN dotnet restore server/AniStream/AniStream.csproj

COPY server/ server/

RUN dotnet publish server/AniStream/AniStream.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
COPY migration/ /app/migration

ENV ASSETS_PATH=/data/assets
ENV DATABASE_MIGRATION_PATH=/app/migration
# SIDECAR_PATH is required by AppConfig even though the API never invokes the sidecar.
ENV SIDECAR_PATH=/app/sidecar

VOLUME ["/data/assets"]
EXPOSE 8080

ENTRYPOINT ["dotnet", "AniStream.dll"]
