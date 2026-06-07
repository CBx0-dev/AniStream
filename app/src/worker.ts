import {type App, type Plugin} from "vue";
import {createMVVM, DIContainer} from "vue-mvvm";

import {DOMParser} from "linkedom";
import {Command} from "commander";
import chalk from "chalk";
import ora, {type Ora} from "ora";

import {WorkerConfig} from "@configs/worker";

import {ProviderService} from "@contracts/provider.contract";
import {Provider} from "@contracts/fetch.contract";

import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

import {SeriesModel} from "@models/series.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

// @ts-expect-error
globalThis.DOMParser = DOMParser;

const container: DIContainer = new DIContainer();
const config: WorkerConfig = new WorkerConfig();
const plugin: Plugin = createMVVM(config, {
    context: container
});

if (!plugin.install) {
    throw new Error("Failed to setup MVVM context");
}

plugin.install(null as unknown as App);

const providerService: ProviderService = container.getService(ProviderService);

interface CliOptions {
    provider: string;
    output: "text" | "json";
}

class OutputHandler {
    private spinner: Ora | null = null;
    public readonly isJson: boolean = false;

    constructor(format: string) {
        this.isJson = format == "json";
    }

    startSpinner(text: string): void {
        if (this.isJson) {
            return;
        }

        this.spinner = ora(text).start();
    }

    stopSpinner(success: boolean = true, text?: string): void {
        if (!this.spinner) {
            return;
        }

        if (success) {
            this.spinner.succeed(text);
        } else {
            this.spinner.fail(text);
        }
        this.spinner = null;
    }

    log(message: string): void {
        if (this.isJson) {
            return;
        }

        console.log(message);
    }

    result(data: unknown, textFormatter: () => void): void {
        if (this.isJson) {
            console.log(JSON.stringify(data));
        } else {
            textFormatter();
        }
    }

    error(message: string): void {
        if (this.isJson) {
            console.error(JSON.stringify({error: message}));
        } else {
            console.error(chalk.red.bold("Error: ") + chalk.red(message));
        }
    }
}

const program = new Command();

program
    .name("worker")
    .description("AniStream Worker CLI")
    .version("1.0.0")
    .requiredOption("-p, --provider <name>", "Provider name")
    .option("-o, --output <type>", "Output format (text, json)", "text");

async function getFetcher(options: CliOptions): Promise<IInformationFetcher> {
    const providerName: string = options.provider.toLowerCase();
    const provider: DefaultProvider | undefined = providerService.ALL_PROVIDERS.find(p => p.uniqueKey == providerName);

    if (!provider) {
        throw new Error(`Provider ${providerName} not found. Available: ${providerService.ALL_PROVIDERS.map(p => p.uniqueKey).join(", ")}`);
    }

    return provider.getFetcher();
}

program
    .command("catalog")
    .description("Get catalog from provider")
    .action(async () => {
        const options: CliOptions = program.opts();
        const out: OutputHandler = new OutputHandler(options.output);
        try {
            const fetcher: IInformationFetcher = await getFetcher(options);
            out.startSpinner("Fetching catalog...");
            const catalog: string[] = await fetcher.getCatalog();
            out.stopSpinner(true, "Catalog fetched");
            out.result(catalog, () => {
                out.log(chalk.blue.bold("\nCatalog:"));
                catalog.forEach(item => console.log(chalk.gray("  - ") + chalk.white(item)));
                out.log(`\nTotal: ${chalk.green(catalog.length)} items`);
            });
        } catch (e: unknown) {
            const message: string = e instanceof Error ? e.message : String(e);
            out.stopSpinner(false);
            out.error(message);
        }
    });

program
    .command("series <guid>")
    .description("Get series details")
    .action(async (guid: string) => {
        const options: CliOptions = program.opts();
        const out: OutputHandler = new OutputHandler(options.output);
        try {
            const fetcher: IInformationFetcher = await getFetcher(options);
            out.startSpinner(`Fetching series ${guid}...`);
            const [model, genres] = await fetcher.getSeries(guid);
            out.stopSpinner(true, `Series ${guid} fetched`);
            out.result({series: model, genres}, () => {
                out.log(chalk.green.bold(`\n${model.title}`));
                out.log(chalk.gray("=".repeat(model.title.length)));
                out.log(`${chalk.yellow.bold("GUID:        ")} ${chalk.cyan(model.guid)}`);
                out.log(`${chalk.yellow.bold("Genres:      ")} ${chalk.magenta(genres.map(g => g.key).join(", "))}`);
                out.log(`${chalk.yellow.bold("Description: ")} ${chalk.white(model.description)}`);
                if (model.preview_image) {
                    out.log(`${chalk.yellow.bold("Preview:     ")} <${chalk.blue(model.preview_image)}>`);
                }
                out.log("");
            });
        } catch (e: unknown) {
            const message: string = e instanceof Error ? e.message : String(e);
            out.stopSpinner(false);
            out.error(message);
        }
    });

program
    .command("seasons <guid>")
    .description("Get seasons for a series")
    .action(async (guid: string) => {
        const options: CliOptions = program.opts();
        const out: OutputHandler = new OutputHandler(options.output);
        try {
            const fetcher: IInformationFetcher = await getFetcher(options);
            out.startSpinner(`Fetching seasons for ${guid}...`);
            // We need a SeriesModel, so we create a dummy one with the GUID
            const series: SeriesModel = SeriesModel(guid, "", "", "");
            const seasons: SeasonFetchModel[] = await fetcher.getSeasons(series);
            out.stopSpinner(true, `Seasons for ${guid} fetched`);
            out.result(seasons, () => {
                out.log(chalk.blue.bold(`\nSeasons for ${guid}:`));
                seasons.forEach(s => {
                    const label = s.season_number == 0 ? "Movies / Specials" : `Season ${s.season_number}`;
                    console.log(chalk.gray("  - ") + chalk.white(label));
                });
                out.log(`\nTotal: ${chalk.green(seasons.length)} seasons`);
            });
        } catch (e: unknown) {
            const message: string = e instanceof Error ? e.message : String(e);
            out.stopSpinner(false);
            out.error(message);
        }
    });

program
    .command("episodes <guid> <seasonNumber>")
    .description("Get episodes for a season")
    .action(async (guid: string, seasonNumber: string) => {
        const options: CliOptions = program.opts();
        const out: OutputHandler = new OutputHandler(options.output);
        try {
            const fetcher: IInformationFetcher = await getFetcher(options);
            const sNum: number = parseInt(seasonNumber);
            out.startSpinner(`Fetching episodes for ${guid} S${sNum}...`);
            const episodes: EpisodeFetchModel[] = await fetcher.getEpisodes(guid, sNum);
            out.stopSpinner(true, `Episodes for ${guid} S${sNum} fetched`);
            out.result(episodes, () => {
                out.log(chalk.blue.bold(`\nEpisodes for ${guid} - Season ${sNum}:`));
                episodes.forEach(e => {
                    const epNum = chalk.yellow(`E${e.episode_number.toString().padStart(2, "0")}`);
                    const titles = `${chalk.white.bold(e.german_title)} ${chalk.gray("/")} ${chalk.white(e.english_title)}`;
                    console.log(`  ${chalk.gray("-")} ${epNum}: ${titles}`);
                });
                out.log(`\nTotal: ${chalk.green(episodes.length)} episodes`);
            });
        } catch (e: unknown) {
            const message: string = e instanceof Error ? e.message : String(e);
            out.stopSpinner(false);
            out.error(message);
        }
    });

program
    .command("providers <guid> <seasonNumber> <episodeNumber>")
    .description("Fetch video providers for an episode")
    .action(async (guid: string, seasonNumber: string, episodeNumber: string) => {
        const options: CliOptions = program.opts();
        const out: OutputHandler = new OutputHandler(options.output);
        try {
            const fetcher: IInformationFetcher = await getFetcher(options);

            const sNum: number = parseInt(seasonNumber);
            const eNum: number = parseInt(episodeNumber);

            out.startSpinner(`Fetching providers for ${guid} S${sNum}E${eNum}...`);
            const providers: Provider[] = await fetcher.fetchProviders(guid, sNum, eNum);
            out.stopSpinner(true, `Providers for ${guid} S${sNum}E${eNum} fetched`);
            out.result(providers, () => {
                out.log(chalk.blue.bold(`\nProviders for ${guid} S${sNum}E${eNum}:`));
                providers.forEach(p => {
                    const lang = chalk.magenta(`[${EpisodeLanguage[p.language] || p.language}]`);
                    const name = chalk.green.bold(p.name.padEnd(15));
                    console.log(`  ${chalk.gray("-")} ${name} ${lang} ${chalk.cyan(p.embeddedURL)}`);
                });
                out.log(`\nTotal: ${chalk.green(providers.length)} providers`);
            });
        } catch (e: unknown) {
            const message: string = e instanceof Error ? e.message : String(e);
            out.stopSpinner(false);
            out.error(message);
        }
    });

await program.parseAsync(process.argv);