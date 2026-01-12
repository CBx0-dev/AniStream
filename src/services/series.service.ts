import { ReadableGlobalContext } from "vue-mvvm";
import { ProviderService } from "./provider.service";

export class SeriesSerivce {
    private provider: ProviderService;
    
    public constructor(ctx: ReadableGlobalContext) {
        this.provider = ctx.getService(ProviderService);
    }

    public async getStreams() {
        
    }
}