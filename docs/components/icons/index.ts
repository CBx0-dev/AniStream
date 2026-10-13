const iconModules: Array<Record<string, () => any>> = Object.values(
    import.meta.glob("./*.tsx", {eager: true})
) as Array<Record<string, () => any>>;

export const icons: Record<string, () => any> = iconModules.reduce((icons, module) => ({...icons, ...module}), {});
