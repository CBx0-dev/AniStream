import {UserControl} from "vue-mvvm";

import {InformationService} from "@contracts//information.service";

import {AuditKind, type AuditModel, AuditStatus} from "@models/audit.model";

export class AuditPanelModel extends UserControl {
    private readonly informationService: InformationService;

    private items: AuditModel[] = this.ref([]);

    public readonly pageSize: number = 15;

    public search: string = this.ref("");
    public statusFilter: AuditStatus | -1 = this.ref(-1);
    public refreshing: boolean = this.ref(false);
    public kindFilter: AuditKind | -1 = this.ref(-1);

    public page: number = this.ref(1);

    public readonly total: number = this.computed(() => this.items.length);
    public readonly queued: number = this.computed(() => this.items.filter(item => item.status == AuditStatus.Queued).length);
    public readonly running: number = this.computed(() => this.items.filter(item => item.status == AuditStatus.Processing).length);
    public readonly completed: number = this.computed(() => this.items.filter(item => item.status == AuditStatus.Completed).length);
    public readonly failed: number = this.computed(() => this.items.filter(item => item.status == AuditStatus.Failed).length);

    public readonly pageCount: number = this.computed(() => Math.max(1, Math.ceil(this.filtered.length / this.pageSize)));
    public readonly filtered: AuditModel[] = this.computed<AuditModel[]>(() => {
        const term: string = this.search.trim().toLowerCase();

        return this.items.filter(item => {
            if (this.kindFilter != -1 && item.kind != this.kindFilter) {
                return false;
            }

            if (this.statusFilter != -1 && item.status != this.statusFilter) {
                return false;
            }

            if (term.length > 0) {
                return item.job_name.toLowerCase().includes(term) || String(item.job_id).includes(term);
            }

            return true;
        });
    });
    public readonly paged: AuditModel[] = this.computed(() => {
        const start: number = (this.page - 1) * this.pageSize;
        return this.filtered.slice(start, start + this.pageSize);
    });
    public readonly pagerItems: Array<number | "..."> = this.computed(() => this.calcPaginationRange());
    public readonly rangeStart: number = this.computed<number>(() => (this.filtered.length == 0 ? 0 : (this.page - 1) * this.pageSize + 1));
    public readonly rangeEnd: number = this.computed<number>(() => Math.min(this.page * this.pageSize, this.filtered.length));
    public readonly isEmpty: boolean = this.computed(() => this.items.length == 0);

    public constructor() {
        super();

        this.informationService = this.ctx.getService(InformationService);

        this.watch(() => this.search, () => this.page = 1);
        this.watch(() => this.kindFilter, () => this.page = 1);
        this.watch(() => this.statusFilter, () => this.page = 1);
    }

    protected async mounted(): Promise<void> {
        await this.onRefreshBtn();
    }

    public onPageBtn(page: number): void {
        this.page = Math.min(Math.max(1, page), this.pageCount);
    }

    public onFirstPageBtn(): void {
        this.onPageBtn(1);
    }

    public onPrevPageBtn(): void {
        this.onPageBtn(this.page - 1);
    }

    public onNextPageBtn(): void {
        this.onPageBtn(this.page + 1);
    }

    public onLastPageBtn(): void {
        this.onPageBtn(this.pageCount);
    }

    public async onRefreshBtn(): Promise<void> {
        if (this.refreshing) {
            return;
        }

        this.refreshing = true;

        const items: AuditModel[] = await this.informationService.getAudits();
        this.items = items.sort((a, b) => !b.started_at ? -1 : a.started_at > b.started_at ? -1 : 1);

        this.refreshing = false;
    }

    private calcPaginationRange(): Array<number | "..."> {
        const total: number = this.pageCount;
        const current: number = this.page;
        const siblingCount: number = 1;

        const totalPageNumbers: number = siblingCount + 5;

        if (totalPageNumbers >= total) {
            return Array.from({length: total}, (_, i) => i + 1);
        }

        const leftSiblingIndex: number = Math.max(current - siblingCount, 1);
        const rightSiblingIndex: number = Math.min(current + siblingCount, total);

        const showLeftDots: boolean = leftSiblingIndex > 2;
        const showRightDots: boolean = rightSiblingIndex < total - 2;

        const firstPageIndex: number = 1;
        const lastPageIndex: number = total;

        if (!showLeftDots && showRightDots) {
            const leftItemCount: number = 3 + 2 * siblingCount;
            const leftRange: number[] = Array.from({length: leftItemCount}, (_, i) => i + 1);
            return [...leftRange, "...", lastPageIndex];
        }

        if (showLeftDots && !showRightDots) {
            const rightItemCount: number = 3 + 2 * siblingCount;
            const rightRange: number[] = Array.from(
                {length: rightItemCount},
                (_, i) => total - rightItemCount + 1 + i
            );
            return [firstPageIndex, "...", ...rightRange];
        }

        const middleRange: number[] = Array.from(
            {length: rightSiblingIndex - leftSiblingIndex + 1},
            (_, i) => leftSiblingIndex + i
        );

        return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
}
