using System;
using System.Reflection;

namespace AniStream.Reflection;

public static class AssemblyLoader
{
    public static void Load(Assembly assembly)
    {
        foreach (Type type in assembly.GetTypes())
        {
            if (type.IsAbstract || !type.IsClass)
            {
                continue;
            }

            if (Attribute.IsDefined(type, typeof(InjectableAttribute)))
            {
                InjectableAttribute.Register(type);
            }
        }
    }
}