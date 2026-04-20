using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ProfileModel> Profiles => Set<ProfileModel>(); 
}