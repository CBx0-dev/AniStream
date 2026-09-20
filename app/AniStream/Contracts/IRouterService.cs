using System;
using System.Collections.Generic;
using AniStream.ViewModels;

namespace AniStream.Contracts;

public interface IRouterService
{
    public IReadOnlyList<ViewModelBase> History { get; }

    public ViewModelBase? Current { get; }

    public event Action? OnCurrentChanged;

    public void NavigateTo<TViewModel>() where TViewModel : ViewModelBase;

    public void NavigateBack();
}