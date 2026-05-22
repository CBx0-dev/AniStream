import {ReadableGlobalContext} from "vue-mvvm";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {EpisodeService} from "@contracts/episode.contract";
import {ProviderService} from "@contracts/provider.contract";

import {EpisodeCreateModel, EpisodeDbModel, EpisodeModel, EpisodeUpdateModel} from "@models/episode.model";

import {DefaultProvider} from "@providers/default";

import {HTTPError} from "@utils/http";
import {UnsupportedPlatformError} from "@utils/error";

import * as AppEnv from "@AppEnv";

class EpisodeServiceImpl extends ApiServiceBase implements EpisodeService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public async getEpisode(episodeId: number): Promise<EpisodeModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const episode: EpisodeDbModel = await this.get<EpisodeDbModel>(["api", provider.uniqueKey, "episodes", episodeId]);

            return EpisodeModel(
                episode.episode_id,
                episode.season_id,
                episode.episode_number,
                episode.german_title,
                episode.english_title,
                episode.description
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async getEpisodes(seasonId: number): Promise<EpisodeModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const episodes: EpisodeDbModel[] = await this.get<EpisodeDbModel[]>(["api", provider.uniqueKey, "episodes", "season", seasonId]);

        return episodes.map(episode => EpisodeModel(
            episode.episode_id,
            episode.season_id,
            episode.episode_number,
            episode.german_title,
            episode.english_title,
            episode.description
        ));
    }

    public async insertEpisode(
        seasonId: number,
        episodeNumber: number,
        germanTitle: string,
        englishTitle: string,
        description: string
    ): Promise<EpisodeModel> {
        if (!AppEnv.isTesting) {
            throw new UnsupportedPlatformError("EpisodeServiceImpl.insertEpisode");
        }

        const provider: DefaultProvider = await this.providerService.getProvider();

        const episode: EpisodeDbModel = await this.post<EpisodeDbModel, EpisodeCreateModel>(["api", provider.uniqueKey, "episodes"], {
            season_id: seasonId,
            episode_number: episodeNumber,
            german_title: germanTitle,
            english_title: englishTitle,
            description
        });

        return EpisodeModel(
            episode.episode_id,
            episode.season_id,
            episode.episode_number,
            episode.german_title,
            episode.english_title,
            episode.description
        );
    }

    public async updateEpisodeMetadata(episodeId: number, germanTitle: string, englishTitle: string, description: string): Promise<void> {
        if (!AppEnv.isTesting) {
            throw new UnsupportedPlatformError("EpisodeServiceImpl.updateEpisodeMetadata");
        }

        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<object, EpisodeUpdateModel>(["api", provider.uniqueKey, "episodes", episodeId], {
            german_title: germanTitle,
            english_title: englishTitle,
            description
        });
    }
}

export default {
    key: EpisodeService,
    ctor: EpisodeServiceImpl
} satisfies ServiceDeclaration<EpisodeService>;