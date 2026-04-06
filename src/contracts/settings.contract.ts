import type {Ref} from "vue";
import {ServiceKey} from "vue-mvvm";

export interface SettingsService {
    get ignoreVersion(): Readonly<Ref<string>>;

    set ignoreVersion(v: string);

    get updatesActive(): Readonly<Ref<boolean>>;

    set updatesActive(v: boolean);

    get healthz(): Readonly<Ref<string>>;

    set healthz(v: string);

    setTheme(theme: string): Promise<void>;

    setThemeSession(theme: string): void;

    getDefaultTheme(): string;

    getTheme(): Promise<string>;

    setLocal(local: string): Promise<void>;

    setLocalSession(local: string): void;

    getDefaultLocal(): string;

    getLocal(): Promise<string>;

    setTosAccepted(value: boolean): Promise<void>;

    isTosAccepted(): Promise<boolean>;

    getImageVariant(name: string, extension: string): Promise<string>;

    loadProfileSettings(): Promise<void>;
}

export const SettingsService: ServiceKey<SettingsService> = new ServiceKey<SettingsService>("settings.service");
