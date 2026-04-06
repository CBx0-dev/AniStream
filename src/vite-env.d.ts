/// <reference types="vite/client" />

declare module "*.vue" {
    import type {DefineComponent} from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "virtual:services" {
    import {ServiceDeclaration} from "@services/declaration";

    export const services: Record<string, ServiceDeclaration<unknown>>;
}