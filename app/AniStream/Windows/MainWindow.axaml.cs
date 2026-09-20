using AniStream.Contracts;
using AniStream.Reflection;
using Avalonia.Controls;

namespace AniStream.Windows;

[Injectable]
public partial class MainWindow : Window
{
    private readonly IRouterService _routerService;

    public MainWindow(IRouterService routerService)
    {
        _routerService = routerService;
        _routerService.OnCurrentChanged += OnCurrentRouteChanged;

        InitializeComponent();
        Title = "AniStream";
    }

    private void OnCurrentRouteChanged()
    {
        Content = _routerService.Current;
    }
}