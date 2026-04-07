import {invoke} from "@tauri-apps/api/core";
import {arch as getArch, platform as getPlatform} from "@tauri-apps/plugin-os";

import {Action, ActionContext, ActionResult, ReadableGlobalContext, syncio} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";

import {ReportService} from "@contracts/report.contract";
import {SettingsService} from "@contracts/settings.contract";

import {ServiceDeclaration} from "@services/declaration";

import {ReportControlModel, ReportResult} from "@controls/ReportControl.model";

import * as packageJSON from "@/../package.json";

class ReportServiceImpl implements ReportService {
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
        const markdown: string = await this.generateMarkdown(title, stack || "No stack trace available", result.data.message);
        await this.createIssue(`[Report]: ${title}`, markdown);
    }

    private runAction<T>(action: Action<T>): Promise<ActionResult<T>> {
        return new Promise<ActionResult<T>>(async (resolve): Promise<void> => {
            const ctx: ActionContext<T> = new ActionContext(resolve);
            await syncio.ensureSync(action.onAction(ctx));
        });
    }

    private async generateMarkdown(title: string, stack: string, userMessage: string): Promise<string> {
        const settings: SettingsService = this.ctx.getService(SettingsService);
        const theme: string = await settings.getTheme();
        const local: string = await settings.getLocal();

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
- Application Target: ${APPLICATION_TARGET}
- Language: ${theme}
- Theme: ${local}
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

export default {
    key: ReportService,
    ctor: ReportServiceImpl
} satisfies ServiceDeclaration<ReportService>;