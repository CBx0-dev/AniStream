import { I18nService } from "@/services/i18n.service";
import { UserControl } from "vue-mvvm";

export class TextControlModel extends UserControl {
    private readonly i18nService: I18nService;

    public constructor() {
        super();
        this.i18nService = this.ctx.getService(I18nService);
    }

    public i18n(key: readonly [string, readonly string[]], ...args: any[]): string;
    public i18n(object: any, dynamic: string): string;

    public i18n(...args: any[]): string {
        if (args.length >= 1 && Array.isArray(args[0])) {
            return this.i18nService.get(args[0] as [string, string[]], ...args.slice(1));
        } 

        return this.i18nService.getDynamic(args[0], args[1]);
    }
}