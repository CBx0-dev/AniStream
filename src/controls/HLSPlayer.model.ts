import {UserControl} from "vue-mvvm";

import type Hls from "hls.js";

import {HLSTauriLoader} from "@utils/hls-tauri-bridge";

import {Provider} from "@services/fetch.service";
import {SettingsService} from "@services/settings.service";
import {I18nService} from "@services/i18n.service";
import {WatchtimeService} from "@services/watchtime.service";

import {getSource, IStreamSource} from "@sources";

import {WatchtimeModel} from "@models/watchtime.model";

type HlsModule = typeof Hls
type HlsImport = typeof import("hls.js");

export class HLSPlayerModel extends UserControl {
    private hlsLoadingPromise: Promise<HlsImport> | null = null;
    private video: HTMLVideoElement | null = null;
    private videoWrapper: HTMLDivElement | null = null;
    private hls: Hls | null = null;
    private interval: NodeJS.Timeout | null = null;
    private timeout: NodeJS.Timeout | null = null;
    private episodeId: number = this.ref(0);

    private readonly settingsService: SettingsService;
    private readonly watchtimeService: WatchtimeService;
    private readonly i18nService: I18nService;

    public loaded: boolean = this.ref(false);
    public error: string | null = this.ref(null);
    public controlKey: number = this.ref(0);
    public timeKey: number = this.ref(0);
    public volume: number = this.ref(100);
    public isRemainingTimeMode: boolean = this.ref(false);
    public showControls: boolean = this.ref(true);
    public chooseImage: string | null = this.ref(null);

    public readonly neverLoaded: boolean = this.computed(() => this.episodeId == 0);

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);
        this.watchtimeService = this.ctx.getService(WatchtimeService);
        this.i18nService = this.ctx.getService(I18nService);

        // Must happend because of addEventListener
        this.onShortcut = this.onShortcut.bind(this);
    }

    public i18n(key: readonly [string, readonly string[]], ...args: any[]): string {
        return this.i18nService.get(key, ...args);
    }

    protected async mounted(): Promise<void> {
        this.chooseImage = await this.settingsService.getImageVariant("choose", "svg");
        this.video = document.getElementById("video-player") as HTMLVideoElement | null;
        this.videoWrapper = document.getElementById("video-player-wrapper") as HTMLDivElement | null;

        // Trigger loading here to prevent long waiting times
        this.loadHls()

        this.watch(() => this.volume, () => {
            if (!this.video) {
                return;
            }

            this.video.volume = this.volume / 100;
        });

        document.addEventListener("keyup", this.onShortcut);
    }

    protected beforeUnmount(): void {
        document.removeEventListener("keyup", this.onShortcut);

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (!this.timeout) {
            clearTimeout(this.timeout as any);
            this.timeout = null;
        }
    }

    public async playStream(episodeId: number, provider: Provider): Promise<void> {
        if (!this.video) {
            return;
        }

        this.episodeId = episodeId;
        this.loaded = false;
        this.error = null;

        this.destroyPlayer();

        const streamURL: string | null = await this.fetchSource(provider);
        if (!streamURL) {
            return;
        }

        if (streamURL.endsWith(".mp4")) {
            this.video.src = streamURL;
        } else {
            await this.initPlayer(this.video, streamURL);
        }
    }

    public async onLoadedMetadata(): Promise<void> {
        this.loaded = true;

        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        let counter: number = 0;
        this.interval = setInterval(() => {
            if (++counter >= 10) {
                this.onProgression();
                counter = 0;
            }

            this.renderTimes();
        }, 1_000);

        if (this.video) {
            const watchtime: WatchtimeModel | null = await this.watchtimeService.getWatchtimeOfEpisode(this.episodeId);
            if (watchtime) {
                this.video.currentTime = watchtime.stopped_time;
            } else {
                await this.watchtimeService.createWatchtimeOfEpisode(this.episodeId, 0, 0);
            }
        }
    }

    public async onSeeked(event: MouseEvent): Promise<void> {
        if (!this.video || this.video.duration == 0 || this.episodeId == 0) {
            return;
        }
        const rect: DOMRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const percent: number = (event.clientX - rect.left) / rect.width;
        const currentTime: number = percent * this.video.duration;
        this.video.currentTime = currentTime;

        this.renderTimes();
        await this.watchtimeService.updateWatchtimeWithEpisode(this.episodeId, percent, currentTime);
    }

    public async onShortcut(event: KeyboardEvent): Promise<void> {
        if (!this.video) {
            return;
        }
      
        if (event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey) {
            return;
        }

        if (event.key == " ") {
            await this.onPlayPauseBtn();
            return;
        }
        if (event.key == "f") {
            await this.onMaximizeMinimizeBtn();
            return;
        }
        if (event.key == "ArrowLeft") {
            this.onRewindBtn();
            return;
        }
    }

    public onMouseMovement(): void {
        this.showControls = true;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.showControls = false;
            this.timeout = null;
        }, 3_000);
    }

    public onRewindBtn(): void {
        if (!this.video) {
            return;
        }

        this.video.currentTime = Math.max(this.video.currentTime - 5, 0);
        this.renderControls();
    }

    public async onPlayPauseBtn(): Promise<void> {
        if (!this.video) {
            return;
        }

        if (this.isPlaying()) {
            this.video.pause();
            this.renderControls();
            return;
        }

        await this.video.play();
        this.renderControls();
    }

    public onTimeBtn(): void {
        this.isRemainingTimeMode = !this.isRemainingTimeMode;
        this.renderControls();
    }

    public async onMaximizeMinimizeBtn(): Promise<void> {
        if (!this.videoWrapper) {
            return;
        }

        if (this.isMaximized()) {
            await document.exitFullscreen();
            this.renderControls();
            return;
        }

        await this.videoWrapper.requestFullscreen();
        this.renderControls();
        return;
    }

    public isPlaying(): boolean {
        if (!this.video) {
            return false;
        }

        return !this.video.paused;
    }

    public isMaximized(): boolean {
        return !!this.videoWrapper && document.fullscreenElement == this.videoWrapper;
    }

    public getCurrentTime(): string {
        if (!this.video || this.video.duration == 0) {
            return this.isRemainingTimeMode
                ? "-00:00"
                : "00:00";
        }

        const seconds: number = this.isRemainingTimeMode
            ? Math.max(this.video.duration - this.video.currentTime, 0)
            : this.video.currentTime;
        const prefix: string = this.isRemainingTimeMode
            ? "-"
            : "";

        const mins: number = Math.floor(seconds / 60);
        const secs: number = Math.floor(seconds % 60);

        const mm: string = mins.toString().padStart(2, "0");
        const ss: string = secs.toString().padStart(2, "0");

        return `${prefix}${mm}:${ss}`;
    }

    public getCompleteTime(): string {
        if (!this.video || this.video.duration == 0) {
            return "00:00";
        }

        const mins: number = Math.floor(this.video.duration / 60);
        const secs: number = Math.floor(this.video.duration % 60);

        const mm: string = mins.toString().padStart(2, "0");
        const ss: string = secs.toString().padStart(2, "0");

        return `${mm}:${ss}`;
    }

    public getBufferedPercent(): number {
        if (!this.video) {
            return 0;
        }

        const end: number = this.video.buffered.end(this.video.buffered.length - 1);
        return end / this.video.duration * 100;
    }

    public getWatchedPercent(): number {
        if (!this.video || this.video.duration == 0) {
            return 0;
        }

        return this.video.currentTime / this.video.duration * 100;
    }

    private async fetchSource(provider: Provider): Promise<string | null> {
        const source: IStreamSource | null = getSource(provider.name);
        if (!source) {
            this.error = `Provider '${provider.name}' is currently not supported`;
            return null;
        }
        HLSTauriLoader.activeSource = source;
        try {
            return await source.getStream(provider.embeddedURL);
        } catch (e) {
            this.error = `Failed to fetch stream: ${e}`;
            return null;
        }
    }

    private async initPlayer(video: HTMLVideoElement, streamURL: string): Promise<void> {
        const Hls: HlsModule = await this.loadHls();
        if (!Hls.isSupported()) {
            console.error("Cannot play video");
            this.error = "HTTP Streaming is not supported on your device";
            return;
        }

        this.hls = new Hls({
            loader: HLSTauriLoader
        });
        this.hls.loadSource(streamURL);
        this.hls.attachMedia(video);
        this.hls.on(Hls.Events.ERROR, (_, data) => {
            console.error("hls.js:", data);
        });
    }

    private destroyPlayer(): void {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private async onProgression(): Promise<void> {
        if (!this.video || this.episodeId == 0) {
            return;
        }

        const currentTime: number = this.video.currentTime;
        const duration: number = this.video.duration;
        // Video not loaded
        if (duration == 0) {
            return;
        }
        const percentage: number = Math.round(currentTime / duration * 100);

        await this.watchtimeService.updateWatchtimeWithEpisode(this.episodeId, percentage, currentTime);
    }

    private async loadHls(): Promise<HlsModule> {
        if (!this.hlsLoadingPromise) {
            this.hlsLoadingPromise = import("hls.js");
        }

        return (await this.hlsLoadingPromise).default;
    }

    private renderControls(): void {
        if (this.controlKey >= Number.MAX_SAFE_INTEGER) {
            this.controlKey = 0;
            return;
        }

        this.controlKey++;
    }

    private renderTimes(): void {
        if (this.timeKey >= Number.MAX_SAFE_INTEGER) {
            this.timeKey = 0;
            return;
        }

        this.timeKey++;
    }
}