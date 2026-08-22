declare global {
    const ipc: Record<string, any>;
}

export interface IPCDeclaration<Module extends object> {
    key: string
    module: Module
}