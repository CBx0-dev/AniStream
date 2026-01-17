import {readonly, ref, Ref} from "vue";

const modules: Record<string, {"default": I18nUnit}> = import.meta.glob('@langs/**/*.json', {eager: true})

type SupportedLocals = "de" | "en";

interface I18nUnit {
    $lang: SupportedLocals;
    $group: string;
}

export class I18nService {
    private readonly groups: Map<string, Map<SupportedLocals, I18nUnit>>;
    // TODO read from settings
    private readonly _currentLocal: Ref<SupportedLocals> = ref("en");

    public get currentLocal(): Readonly<Ref<SupportedLocals>> {
        return readonly(this._currentLocal);
    }

    public constructor() {
        this.groups = new Map<string, Map<SupportedLocals, I18nUnit>>();

        for (const unitModule of Object.values(modules)) {
            const unit: I18nUnit = unitModule.default;
            const group: string = unit.$group;
            const lang: SupportedLocals = unit.$lang;

            let map: Map<SupportedLocals, I18nUnit> | undefined = this.groups.get(group);

            if (!map) {
                map = new Map<SupportedLocals, I18nUnit>();
                this.groups.set(group, map);
            }

            map.set(lang, unit);
        }
    }

    public setLocal(local: string): void {
        this._currentLocal.value = local as SupportedLocals;
    }

    public getDynamic(target: any, name: string): string {
        if (name in target && Array.isArray(target[name])) {
            return this.get(target[name] as unknown as readonly [string, readonly string[]]);
        }

        return "?";
    }

    public get(target: readonly [string, readonly string[]]): string {
        const [group, path] = target;

        if (path.length == 0) {
            console.error("Unknown translation key: Path length 0", target);
            return "?";
        }

        const map: Map<SupportedLocals, I18nUnit> | undefined = this.groups.get(group);
        if (!map) {
            console.error("Unknown translation key: Missing group", target);
            return "?";
        }

        let unit: I18nUnit | undefined = map.get(this._currentLocal.value);
        if (!unit) {
            unit = map.get("en");
            if (!unit) {
                console.error("Unknown translation key: Missing language", target);
                return "?";
            }
        }

        // We cannot use the original path because it would destroy the original I18n Map.
        const traversingPath: string[] = path.concat();

        let current: any = (unit as any)[traversingPath.shift()!];
        if (typeof current == "undefined") {
            console.error("Unknown translation key: Path points to undefined", target);
            return "?";
        }
        while (traversingPath.length > 0) {
            if (typeof current != "object") {
                console.error("Unknown translation key: Path points to non-object", target);
                return "?";
            }

            current = current[traversingPath.shift()!];
            if (typeof current == "undefined") {
                console.error("Unknown translation key: Path points to undefined", target);
                return "?";
            }
        }

        return this.applyFormat(current as string);
    }

    private applyFormat(value: string): string {    
        return value.replace(/\*\*((?:\*(?!\*)|[^*])+)\*\*/g, "<strong>$1</strong>"); 
    }
}