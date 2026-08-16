<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {UpdatePanelModel} from "@controls/UpdatePanel.model";

import LucideServer from "@icons/LucideServer.vue";
import LucideExternalLink from "@icons/LucideExternalLink.vue";

const vm: UpdatePanelModel = useUserControl(UpdatePanelModel);
</script>

<template>
    <div v-if="vm.updateAvailable" class="bg-base-100 border border-base-300 rounded-box border-l-10 border-l-primary p-4">
        <div class="flex gap-5">
            <div class="bg-base-200 border-base-300 rounded-box p-3">
                <LucideServer class="size-6"/>
            </div>
            <div class="space-y-1">
                <h1 class="text-lg">Server Update available</h1>
                <p class="text-primary text-sm">Version 2.4.1 is ready. You are on v2.3.8</p>
            </div>
            <div class="flex-1"></div>
            <div class="my-auto">
                <button class="btn btn-ghost">
                    <LucideExternalLink/>
                    View Changelog
                </button>
            </div>
        </div>
    </div>
</template>
