# Build context: repository root

# Stage 1: Build the Bun worker executable
FROM node:22-slim AS bun-build
WORKDIR /build

# Install Bun
RUN npm install -g bun

# Install Node dependencies with a clean install
COPY app/package.json app/package-lock.json ./
RUN npm ci

# Copy app source and build the worker bundle with Vite
COPY app/ ./
RUN APPLICATION_TARGET=worker npm run build

# Compile the bundled worker.js into a standalone executable
RUN bun build ./dist/worker.js --compile --outfile /sidecar/worker

# Stage 2: Build the .NET Worker service
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
WORKDIR /src

COPY AniStream.slnx AniStream.slnx
COPY server/AniStream.Models/AniStream.Models.csproj    server/AniStream.Models/
COPY server/AniStream.Services/AniStream.Services.csproj server/AniStream.Services/
COPY server/AniStream.Shared/AniStream.Shared.csproj     server/AniStream.Shared/
COPY server/AniStream.Worker/AniStream.Worker.csproj     server/AniStream.Worker/

COPY server/ server/

RUN dotnet restore ./AniStream.slnx
RUN dotnet publish server/AniStream.Worker/AniStream.Worker.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=dotnet-build /app/publish .
COPY --from=bun-build /sidecar/worker /app/sidecar/worker
RUN chmod +x /app/sidecar/worker

COPY migration/ /app/migration

ENV SIDECAR_PATH=/app/sidecar
ENV ASSETS_PATH=/data/assets
ENV DATABASE_MIGRATION_PATH=/app/migration

VOLUME ["/data/assets"]

ENTRYPOINT ["dotnet", "AniStream.Worker.dll"]
