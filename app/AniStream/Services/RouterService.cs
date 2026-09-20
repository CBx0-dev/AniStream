using System;
using System.Collections.Generic;
using System.Linq;
using AniStream.Contracts;
using AniStream.Reflection;
using AniStream.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Services;

[Injectable(typeof(IRouterService))]
public sealed class RouterService : IRouterService
{
    private readonly IServiceProvider _serviceProvider;

    private readonly Stack<ViewModelBase> _history;

    private ViewModelBase? _current;

    public event Action? OnCurrentChanged;

    public ViewModelBase? Current
    {
        get => _current;
        private set
        {
            _current = value;
            OnCurrentChanged?.Invoke();
        }
    }

    public IReadOnlyList<ViewModelBase> History => _history.ToList();

    public RouterService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;

        _history = new Stack<ViewModelBase>();
        _current = null;
    }

    public void NavigateTo<TViewModel>() where TViewModel : ViewModelBase
    {
        if (_current is not null)
        {
            _history.Push(_current);
        }

        Current = _serviceProvider.GetRequiredService<TViewModel>();
    }

    public void NavigateBack()
    {
        if (_history.Count == 0)
        {
            throw new InvalidOperationException("Cannot navigate back on an empty history");
        }

        Current = _history.Pop();
    }
}