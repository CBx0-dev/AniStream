import {UserControl} from "vue-mvvm";

import Hls from "hls.js";
import {HLSTauriLoader} from "@utils/hls-tauri-bridge";

import {Provider} from "@services/fetch.service";
import {EpisodeService} from "@services/episode.service";
import {SettingsService} from "@services/settings.service";

import {getSource, IStreamSource} from "@sources";

export class HLSPlayerModel extends UserControl {
    private video: HTMLVideoElement | null = null;
    private hls: Hls | null = null;
    private interval: NodeJS.Timeout | null = null;
    private episodeId: number = this.ref(0);

    private settingsService: SettingsService;
    private episodeService: EpisodeService;

    public loaded: boolean = this.ref(false);
    public error: string | null = this.ref(null);

    public neverLoaded: boolean = this.computed(() => this.episodeId == 0);

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);
        this.episodeService = this.ctx.getService(EpisodeService);
    }

    public mounted(): void {
        this.video = document.getElementById("video-player") as HTMLVideoElement | null;
    }

    public beforeUnmount(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    public getChooseImage(): string {
        return this.settingsService.getImageVariant("choose", "svg");
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
            this.initPlayer(this.video, streamURL);
        }
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

    private initPlayer(video: HTMLVideoElement, streamURL: string): void {
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
        }
    }

    public onLoadedMetadata(): void {
        this.loaded = true;

        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.onProgression, 10_000)
    }

    public async onSeeked(): Promise<void> {
        if (!this.video || this.episodeId == 0) {
            return;
        }

        const currentTime: number = this.video.currentTime;
        const percentage: number = Math.round(currentTime / this.video.duration * 100);

        await this.episodeService.updateEpisodeProgression(this.episodeId, percentage, currentTime);
    }

    private async onProgression(): Promise<void> {
        if (!this.video || this.episodeId == 0) {
            return;
        }

        const currentTime: number = this.video.currentTime;
        const percentage: number = Math.round(currentTime / this.video.duration * 100);

        await this.episodeService.updateEpisodeProgression(this.episodeId, percentage, currentTime);
    }
}