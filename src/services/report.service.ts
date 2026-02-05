import {invoke} from "@tauri-apps/api/core";
import {arch as getArch, platform as getPlatform} from "@tauri-apps/plugin-os";
import {Action, ActionContext, ActionResult, ReadableGlobalContext, syncio} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";

import {ReportControlModel, ReportResult} from "@controls/ReportControl.model";

import {SettingsService} from "@services/settings.service";

import * as packageJSON from "@/../package.json";

export class ReportService {
    private ctx: ReadableGlobalContext;

    public constructor(ctx: ReadableGlobalContext) {
        this.ctx = ctx;

        window.addEventListener("unhandledrejection", async ev => {
            await this.handleFatalError(ev.reason || "Unhandled Rejection");
        });
        window.addEventListener("error", async ev => {
            await this.handleFatalError(ev.error || ev.message);
        });
    }

    private async createIssue(title: string, message: string): Promise<void> {
        try {
            await invoke("report_issue", {
                title: title,
                message: message
            });
        } catch (e) {
            console.error("Failed to report issue to backend", e);
        }
    }

    public async handleFatalError(error: any): Promise<void> {
        const dialogService: DialogService = this.ctx.getService(DialogService);

        const title: string = error instanceof Error ? error.message : String(error);
        const dialog: ReportControlModel = dialogService.initDialog(ReportControlModel, title, error)

        await dialog.openDialog();
        const result: ActionResult<ReportResult> = await this.runAction(dialog);

        if (!result.success) {
            console.error("ReportDialog Failed: ", result.error);
            return;
        }

        if (!result.data.send) {
            return;
        }

        const stack: string | undefined = error instanceof Error ? error.stack : JSON.stringify(error, null, 2);
        const markdown: string = this.generateMarkdown(title, stack || "No stack trace available", result.data.message);
        await this.createIssue(`[Report]: ${title}`, markdown);
    }

    private runAction<T>(action: Action<T>): Promise<ActionResult<T>> {
        return new Promise<ActionResult<T>>(async (resolve): Promise<void> => {
            const ctx: ActionContext<T> = new ActionContext(resolve);
            await syncio.ensureSync(action.onAction(ctx));
        });
    }

    private generateMarkdown(title: string, stack: string, userMessage: string): string {
        const settings: SettingsService = this.ctx.getService(SettingsService);
        return `## Fatal Error: ${this.sanitizeForMarkdown(title)}

### User Message
${userMessage ? this.sanitizeForMarkdown(userMessage) : "_No user message provided._"}

### Stack Trace
\`\`\`
${this.sanitizeForMarkdown(stack)}
\`\`\`

### Environment
- Version: ${packageJSON.version}
- Platform: ${getPlatform()} ${getArch()}
- Language: ${settings.lang.value}
- Theme: ${settings.theme.value}
`;
    }

    private sanitizeForMarkdown(value: string): string {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/`/g, "&#96;");
    }

}