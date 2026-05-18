# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY ./AniStream/AniStream.csproj ./AniStream/AniStream.csproj
COPY ./AniStream.Models/AniStream.Models.csproj ./AniStream.Models/AniStream.Models.csproj
COPY ./AniStream.Services/AniStream.Services.csproj ./AniStream.Services/AniStream.Services.csproj

RUN dotnet restore "AniStream/AniStream.csproj"

COPY . .

WORKDIR /app/AniStream
RUN dotnet publish "AniStream.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AniStream.dll"]