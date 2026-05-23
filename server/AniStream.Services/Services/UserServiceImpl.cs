using AniStream.Contexts;
using AniStream.Contracts;
using AniStream.Models;
using AniStream.Utils;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Services;

public class UserServiceImpl : IUserService
{
    private readonly DbContextFactory<ProfileDbContext> _dbFactory;

    public UserServiceImpl(DbContextFactory<ProfileDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<ProfileModel> CreateProfile(
        string uuid,
        string name,
        string backgroundColor,
        string eye,
        string mouth,
        string theme,
        string lang,
        bool tosAccepted,
        bool syncCatalog
    )
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        ProfileModel profile = new ProfileModel(uuid, name, backgroundColor, eye, mouth, theme, lang, tosAccepted, syncCatalog);

        db.Profiles.Add(profile);
        await db.SaveChangesAsync();

        return profile;
    }

    public Task<ProfileModel> GetActiveProfile()
    {
        throw new NotImplementedException();
    }

    public async Task<ProfileModel[]> GetProfiles()
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        return db.Profiles.ToArray();
    }

    public async Task<ProfileModel> GetProfileByUsername(string username)
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        IQueryable<ProfileModel> query = from profile in db.Profiles where profile.Name == username select profile;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ProfileModel?> GetProfile(string uuid)
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        IQueryable<ProfileModel> query = from profile in db.Profiles where profile.Uuid == uuid select profile;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ProfileModel?> GetProfile(int profileId)
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        IQueryable<ProfileModel> query = from profile in db.Profiles where profile.ProfileId == profileId select profile;
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ProfileModel> UpdateProfile(
        int profileId,
        string? name = null,
        string? backgroundColor = null,
        string? eye = null,
        string? mouth = null,
        string? theme = null,
        string? lang = null,
        bool? tosAccepted = null,
        bool? syncCatalog = null
    )
    {
        ProfileModel? profile = await GetProfile(profileId);
        if (profile is null)
        {
            throw new ArgumentException($"Profile with ID '{profileId}' not found", nameof(profileId));
        }

        return await UpdateProfile(
            profile,
            name,
            backgroundColor,
            eye,
            mouth,
            theme,
            lang,
            tosAccepted,
            syncCatalog
        );
    }

    public async Task<ProfileModel> UpdateProfile(
        ProfileModel profile,
        string? name = null,
        string? backgroundColor = null,
        string? eye = null,
        string? mouth = null,
        string? theme = null,
        string? lang = null,
        bool? tosAccepted = null,
        bool? syncCatalog = null
    )
    {
        await using ProfileDbContext db = await _dbFactory.GetContext();

        if (name is not null)
        {
            profile.Name = name;
        }

        if (backgroundColor is not null)
        {
            profile.BackgroundColor = backgroundColor;
        }

        if (eye is not null)
        {
            profile.Eye = eye;
        }

        if (mouth is not null)
        {
            profile.Mouth = mouth;
        }

        if (theme is not null)
        {
            profile.Theme = theme;
        }

        if (lang is not null)
        {
            profile.Lang = lang;
        }

        if (tosAccepted is not null)
        {
            profile.TosAccepted = (bool)tosAccepted;
        }

        if (syncCatalog is not null)
        {
            profile.SyncCatalog = (bool)syncCatalog;
        }

        db.Profiles.Update(profile);
        await db.SaveChangesAsync();

        return profile;
    }
}