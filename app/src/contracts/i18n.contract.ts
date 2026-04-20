import type {Ref} from "vue";
import {ServiceKey} from "vue-mvvm";

export type SupportedLocals = "de" | "en";

export interface I18nService {
    get currentLocal(): Readonly<Ref<SupportedLocals>>;

    setLocal(local: SupportedLocals): void;

    getDynamic(target: any, name: string): string;

    get(target: readonly [string, readonly string[]], ...args: any[]): string;
}

export const I18nService: ServiceKey<I18nService> = new ServiceKey("i18n.service");