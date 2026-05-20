import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";
import {ApiServiceBase} from "@services/utils/api";

import {GenreService} from "@contracts/genre.contract";
import {ProviderService} from "@contracts/provider.contract";

import {GenreCreateModel, GenreDbModel, GenreModel, GenreToSeriesModel} from "@models/genre.model";
import {SeriesModel} from "@models/series.model";

import {DefaultProvider} from "@providers/default";

import {HTTPError} from "@utils/http";

class GenreServiceImpl extends ApiServiceBase implements GenreService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public async getGenreByKey(key: string): Promise<GenreModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        try {
            const genre: GenreDbModel = await this.get<GenreDbModel>(["api", provider.uniqueKey, "genres", key, "key"]);
            return GenreModel(
                genre.genre_id,
                genre.key
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async insertGenre(key: string): Promise<GenreModel> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const genre: GenreDbModel = await this.post<GenreDbModel, GenreCreateModel>(["api", provider.uniqueKey, "genres"], {
            key
        });

        return GenreModel(genre.genre_id, genre.key);
    }

    public async insertGenreToSeries(genre: GenreModel, series: SeriesModel, mainGenre: boolean): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.post<{}, GenreToSeriesModel>(["api", provider.uniqueKey, "genres", "series"], {
            genre_id: genre.genre_id,
            series_id: series.series_id,
            main_genre: mainGenre
        });
    }

    public async getGenres(): Promise<GenreModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const genres: GenreDbModel[] = await this.get<GenreDbModel[]>(["api", provider.uniqueKey, "genres"]);

        return genres.map(genre => GenreModel(
            genre.genre_id,
            genre.key
        ));
    }

    public async getMainGenreOfSeries(seriesId: number): Promise<GenreModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const genre: GenreDbModel = await this.get<GenreDbModel>(["api", provider.uniqueKey, "genres", "series", seriesId, "main"]);

            return GenreModel(
                genre.genre_id,
                genre.key
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async getNonMainGenresOfSeries(seriesId: number): Promise<GenreModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const genres: GenreDbModel[] = await this.get<GenreDbModel[]>(["api", provider.uniqueKey, "genres", "series", seriesId]);

        return genres.map(genre => GenreModel(
            genre.genre_id,
            genre.key
        ));
    }
}

export default {
    key: GenreService,
    ctor: GenreServiceImpl
} satisfies ServiceDeclaration<GenreService>;