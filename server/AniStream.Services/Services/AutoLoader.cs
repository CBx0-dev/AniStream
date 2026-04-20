using AniStream.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Services;

public sealed class AutoLoader
{
    public static void LoadServices(IServiceCollection services)
    {
        services.AddSingleton<IUserService, UserServiceImpl>();
    }
}