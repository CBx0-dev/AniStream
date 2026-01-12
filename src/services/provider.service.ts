abstract class DefaultProvider {
    public abstract get uniqueKey(): string;
    
    private inited: boolean;

    protected constructor() {
        this.inited = false;
    }

    protected abstract initProivider(): Promise<void>;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        await this.initProivider();
        this.inited = true;
    }
}

class AniWorldProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "aniworld";

    public get uniqueKey(): string {
        return AniWorldProvider.UNIQUE_KEY;
    }

    public constructor() {
        super();
    }

    protected async initProivider(): Promise<void> {

    }
}

class StoProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "sto";

    public get uniqueKey(): string {
        return StoProvider.UNIQUE_KEY;
    }

    public constructor() {
        super();
    }

    protected async initProivider(): Promise<void> {

    }
}

export class ProviderService {
    public static readonly ANIWORLD: AniWorldProvider = new AniWorldProvider();
    public static readonly STO: StoProvider = new StoProvider();
    private static readonly SESSION_KEY: string = "active-provider";

    private provider: DefaultProvider | null = null;

    public constructor() {
        this.provider = null;
    }
    
    public async getProvider(): Promise<DefaultProvider> {
        if (this.provider) {
            return this.provider;
        }

        if (await this.loadCache()) {
            return this.provider!;
        }

        throw "No provider setted and no provider was registered in the cache";
    }

    public async setProvider(provider: DefaultProvider): Promise<void> {
        this.provider = provider;
        await this.provider.init();
    }

    private getProviderFromUniqueKey(key: string): DefaultProvider | null {
        switch (key) {
            case AniWorldProvider.UNIQUE_KEY:
                return ProviderService.ANIWORLD;
            case StoProvider.UNIQUE_KEY:
                return ProviderService.STO;
        }

        return null;
    }

    private async loadCache(): Promise<boolean> {
        let value: string | null = sessionStorage.getItem(ProviderService.SESSION_KEY);
        if (!value) {
            return false;
        }

        this.provider = this.getProviderFromUniqueKey(value);
        
        if (this.provider) {
            await this.provider.init();
            return true;
        }

        return false;
    }
}
