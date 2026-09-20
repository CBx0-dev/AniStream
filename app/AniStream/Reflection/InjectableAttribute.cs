using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace AniStream.Reflection;

[AttributeUsage(AttributeTargets.Class)]
public sealed class InjectableAttribute : Attribute
{
    private static readonly Dictionary<Type, InjectableAttribute> _registered = new Dictionary<Type, InjectableAttribute>();

    private readonly Type? _contractType;
    private readonly ServiceLifetime _lifetime;

    public InjectableAttribute(Type contractType, ServiceLifetime lifetime = ServiceLifetime.Singleton)
    {
        _contractType = contractType;
        _lifetime = lifetime;
    }

    public InjectableAttribute(ServiceLifetime lifetime = ServiceLifetime.Singleton)
    {
        _contractType = null;
        _lifetime = lifetime;
    }

    public static void Register(Type type)
    {
        InjectableAttribute? attribute = type.GetCustomAttribute<InjectableAttribute>();
        if (attribute is null)
        {
            throw new ArgumentException("Type must have InjectableAttribute", nameof(type));
        }

        if (attribute._contractType is not null)
        {
            if (!type.IsAssignableTo(attribute._contractType))
            {
                throw new ArgumentException($"Type '{type.FullName}' must implement '{attribute._contractType.FullName}'", nameof(type));
            }
        }

        _registered[type] = attribute;
    }

    public static void Bind(IServiceCollection collection)
    {
        foreach ((Type type, InjectableAttribute attribute) in _registered)
        {
            collection.Add(new ServiceDescriptor(
                attribute._contractType ?? type,
                type,
                attribute._lifetime
            ));
        }
    }
}