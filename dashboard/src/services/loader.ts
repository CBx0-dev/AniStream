import type {ServiceDeclaration} from "@services/shared.ts";

const modules: Record<string, ServiceDeclaration<unknown>> = import.meta.glob("./**/*.service.ts", {
    eager: true,
    import: "default"
});

export const services: ServiceDeclaration<unknown>[] = Object.values(modules);