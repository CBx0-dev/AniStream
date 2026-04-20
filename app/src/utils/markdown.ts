export class MarkdownParser {
    private inList: boolean = false;
    private paragraph: string[] = [];
    private output: string[] = [];

    public parse(markdown: string): string {
        this.inList = false;
        this.paragraph = [];
        this.output = [];

        const lines: string[] = markdown.split(/\r?\n/);

        for (const rawLine of lines) {
            const line: string = rawLine.trimEnd();
            const escapedLine: string = this.escapeHtml(line);

            if (/^## (.*)$/.test(line)) {
                this.handleH2(escapedLine);
                continue;
            }

            if (/^# (.*)$/.test(line)) {
                this.handleH1(escapedLine);
                continue;
            }

            if (/^[-*] (.*)$/.test(line)) {
                this.handleListItem(escapedLine);
                continue;
            }

            if (line.trim() === '') {
                this.handleEmptyLine();
                continue;
            }

            if (this.inList) {
                this.closeList();
            }

            this.paragraph.push(this.applyInline(escapedLine));
        }

        this.flushParagraph();
        this.closeList();

        return this.output.join('');
    }

    private handleH2(escapedLine: string): void {
        this.flushParagraph();
        this.closeList();
        const text = this.applyInline(escapedLine.replace(/^## /, ''));
        this.output.push(`<h2 class="text-xl font-bold mt-3 mb-2">${text}</h2>`);
    }

    private handleH1(escapedLine: string): void {
        this.flushParagraph();
        this.closeList();
        const text = this.applyInline(escapedLine.replace(/^# /, ''));
        this.output.push(`<h1 class="text-2xl font-bold mt-4 mb-2">${text}</h1>`);
    }

    private handleListItem(escapedLine: string): void {
        this.flushParagraph();
        if (!this.inList) {
            this.output.push('<ul class="list-disc ml-6 my-2">');
            this.inList = true;
        }
        const text = this.applyInline(escapedLine.replace(/^[-*] /, ''));
        this.output.push(`<li class="my-1">${text}</li>`);
    }

    private handleEmptyLine(): void {
        this.flushParagraph();
        this.closeList();
    }

    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    private applyInline(text: string): string {
        let html = text;
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        return html;
    }

    private flushParagraph(): void {
        if (this.paragraph.length === 0) return;
        this.output.push(`<p class="my-2">${this.paragraph.join('<br/>')}</p>`);
        this.paragraph = [];
    }

    private closeList(): void {
        if (!this.inList) return;
        this.output.push('</ul>');
        this.inList = false;
    }
}
