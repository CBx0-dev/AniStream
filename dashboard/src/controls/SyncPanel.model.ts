import {UserControl} from "vue-mvvm";

import {CatalogService} from "@contracts/catalog.service";

export class SyncPanelModel extends UserControl {
    private readonly catalogService: CatalogService;
    
    public isSyncing: boolean = this.ref(false);
    
    public constructor() {
        super();
    
        this.catalogService = this.ctx.getService(CatalogService);
    }
    
    public async onSyncBtn(): Promise<void> {
        if (this.isSyncing) {
            return;
        }
        
        this.isSyncing = true;
        await this.catalogService.requestSync();
    }
}