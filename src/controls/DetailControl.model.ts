import { Component, ComponentInternalInstance, getCurrentInstance } from "vue";
import { DialogControl } from "vue-mvvm/dialog";

import DetailControl from "@controls/DetailControl.vue";

import {SeriesModel} from "@models/series.model";
import {GenreModel} from "@models/genre.model";

import {GenreService} from "@services/genre.service";
import {I18nService} from "@services/i18n.service";
import I18n from "@utils/i18n";

export class DetailControlModel extends DialogControl {
    public static readonly component: Component = DetailControl;

    private readonly genreService: GenreService;
    private readonly i18nService: I18nService;

    public opened: boolean = this.ref(false);
    public uid: number = this.computed(() => {
        const instance: ComponentInternalInstance | null = getCurrentInstance();
        if (!instance) {
            return Math.round(Math.random() * 1000);
        }

        return instance.uid;
    });
    public popoverId: string = this.computed(() => `popover-${this.uid}`);
    public anchorId: string = this.computed(() => `--anchor-${this.uid}`);
    public providerFolder: string | null = this.ref(null)
    public seriesId: number = this.ref(0);
    public title: string = this.ref("");
    public description: string = this.ref("");
    public previewImage: string | null = this.ref(null);
    public genres: GenreModel[] = this.ref([]);
    public mainGenre: GenreModel | null = this.ref(null);
    public genreChunk: GenreModel[] = this.computed(() => this.genres.slice(0, 3));
    public genreOverflow: number = this.computed(() => this.genres.length - 3);

    public constructor(providerFolder: string, series: SeriesModel) {
        super();

        this.genreService = this.ctx.getService(GenreService);
        this.i18nService = this.ctx.getService(I18nService);

        this.providerFolder = providerFolder;
        this.seriesId = series.series_id;
        this.title = series.title;
        this.description = series.description;
        this.previewImage = series.preview_image;
    }

    protected async onOpen(): Promise<void> {
        this.opened = true;

        this.mainGenre = await this.genreService.getMainGenreOfSeries(this.seriesId);
        this.genres.push(...await this.genreService.getNonMainGenresOfSeries(this.seriesId));
        console.log(this.genres, this.mainGenre)
    }

    protected onClose(): void {
        this.opened = false;
        this.destroy();
    }

    public onResetProgressionBtn(): void {

    }

    public onAddWatchlistBtn(): void {

    }

    public onAddListBtn(): void {
        
    }

    public getGenreName(key: string): string {
        return this.i18nService.getDynamic(I18n.Genres, key);
    }
}