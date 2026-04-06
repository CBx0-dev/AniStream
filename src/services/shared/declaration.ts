import type {ReadableGlobalContext, ServiceKey} from "vue-mvvm";

export interface ServiceDeclaration<T> {
    key: ServiceKey<T>,
    ctor: new (ctx: ReadableGlobalContext) => T;
}