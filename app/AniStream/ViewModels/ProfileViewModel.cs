using System.Collections.ObjectModel;

namespace AniStream.ViewModels;

public sealed class ProfileViewModel : ViewModelBase
{
    public ObservableCollection<string> Profiles { get; } = new ObservableCollection<string>();

    public ProfileViewModel()
    {
        Profiles.Add("Hello World");
    }
}