import {UserControl} from "vue-mvvm";

import {InformationService} from "@contracts//information.service";

import {AuditKind, type AuditModel, AuditStatus, type Paged} from "@models/audit.model";

export class AuditPanelModel extends UserControl {
    private readonly informationService: InformationService;

    public items: AuditModel[] = this.ref([]);
    public statusFilter: AuditStatus | -1 = this.ref(-1);
    public refreshing: boolean = this.ref(false);
    public kindFilter: AuditKind = this.ref(AuditKind.All);
    public page: number = this.ref(1);
    public total: number = this.ref(0);
    public queued: number = this.ref(0);
    public running: number = this.ref(0);
    public completed: number = this.ref(0);
    public failed: number = this.ref(0);
    public providers: string[] = this.ref([]);

    public readonly pageCount: number = this.computed(() => Math.max(1, Math.ceil(this.total / 15)));
    public readonly pagerItems: Array<number | "..."> = this.computed(() => this.calcPaginationRange());
    public readonly rangeStart: number = this.computed<number>(() => (this.items.length == 0 ? 1 : (this.page - 1) * 15 + 1));
    public readonly rangeEnd: number = this.computed<number>(() => (this.page - 1) * 15 + this.items.length);
    public readonly isEmpty: boolean = this.computed(() => this.items.length == 0);

    public constructor() {
        super();

        this.informationService = this.ctx.getService(InformationService);

        this.watch(() => this.kindFilter, async () => {
            this.page = 1;
            await this.onRefreshBtn();
        });
        this.watch(() => this.providers, async () => {
            this.page = 1;
            await this.onRefreshBtn();
        }, {deep: 1});
        this.watch(() => this.statusFilter, async () => {
            this.page = 1;
            await this.onRefreshBtn();
        });
        this.watch(() => this.page, this.onRefreshBtn.bind(this));
    }

    protected async mounted(): Promise<void> {
        await this.onRefreshBtn();
    }

    public toggleProvider(provider: string): void {
        const idx: number = this.providers.indexOf(provider);
        if (idx < 0) {
            this.providers.push(provider);
            return;
        }

        this.providers.splice(idx, 1);
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

        const statusFilter: AuditStatus | null = this.statusFilter == -1 ? null : this.statusFilter;

        const page: Paged<AuditModel> = await this.informationService.getAudits(
            this.page,
            this.kindFilter,
            this.providers,
            statusFilter
        );

        this.total = page.total.items;
        this.queued = page.total.queued;
        this.running = page.total.running;
        this.completed = page.total.completed;
        this.failed = page.total.failed;
        this.items = page.items;

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
