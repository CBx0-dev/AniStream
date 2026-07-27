<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {SyncPanelModel} from "@controls/SyncPanel.model";

import LucideRefreshCcw from "@icons/LucideRefreshCcw.vue";
import LucideCircleCheck from "@icons/LucideCircleCheck.vue";

const vm: SyncPanelModel = useUserControl(SyncPanelModel);
</script>

<template>
    <div class="card bg-base-100 border border-base-300 rounded-box shadow-sm">
        <div class="card-body flex-row items-center justify-between p-5">
            <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LucideRefreshCcw class="size-6"/>
                </div>

                <div>
                    <h3 class="text-base font-semibold text-base-content">
                        Catalog synchronization
                    </h3>
                    <p class="text-sm text-base-content/60">
                        Sync the complete catalog to update series and metadata.
                    </p>
                </div>
            </div>
            <button v-if="!vm.isSyncing"
                    class="btn btn-primary btn-sm"
                    @click="vm.onSyncBtn()">
                <LucideRefreshCcw class="size-4"/>
                Start Sync
            </button>
            <div v-else
                 class="btn btn-soft btn-success btn-sm pointer-events-none">
                <LucideCircleCheck class="size-4"/>
                Sync job queued
            </div>
        </div>
    </div>
</template>
