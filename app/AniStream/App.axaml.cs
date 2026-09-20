using AniStream.Contracts;
using AniStream.Reflection;
using AniStream.ViewModels;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using AniStream.Windows;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream;

public class App : Application
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);

        AssemblyLoader.Load(typeof(Program).Assembly);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        ServiceCollection collection = new ServiceCollection();
        InjectableAttribute.Bind(collection);

        ServiceProvider provider = collection.BuildServiceProvider();

        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            MainWindow window = provider.GetRequiredService<MainWindow>();
            IRouterService router = provider.GetRequiredService<IRouterService>();

            desktop.MainWindow = window;

            router.NavigateTo<ProfileViewModel>();
        }

        base.OnFrameworkInitializationCompleted();
    }
}