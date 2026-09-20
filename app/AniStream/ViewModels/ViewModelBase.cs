using AniStream.Reflection;
using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.ViewModels;

[Injectable(ServiceLifetime.Transient)]
public abstract class ViewModelBase : ObservableObject
{
}