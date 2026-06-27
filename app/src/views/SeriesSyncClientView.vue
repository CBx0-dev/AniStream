<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {SeriesSyncViewClientModel} from "@views/SeriesSyncView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideCheck from "@icons/LucideCheck.vue";
import SvgSpinnersBlocksWave from "@icons/SvgSpinnersBlocksWave.vue";

import Text from "@controls/Text.vue";
import I18n from "@utils/i18n";

const vm: SeriesSyncViewClientModel = useViewModel(SeriesSyncViewClientModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link hover:text-primary cursor-default"
                            :class="{'skeleton w-32 h-10': vm.isPreLoading}"
                            @click="vm.onBackBtn">
                        <template v-if="!vm.isPreLoading">
                            <LucideArrowLeft/>
                            <Text :target="I18n.SeriesSyncView.back"/>
                        </template>
                    </button>
                </div>
            </div>
        </div>
        <div class="border border-base-300 my-2 bg-base-100 rounded-box">
            <div class="flex flex-col items-center text-center gap-4 px-6 py-12">
                <template v-if="vm.isPreLoading">
                    <div class="size-20 skeleton rounded-full"></div>
                    <div class="h-4 w-2/3 skeleton"></div>
                    <div class="h-4 w-1/2 skeleton"></div>
                </template>
                <template v-else-if="vm.isProcessing">
                    <div class="flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary">
                        <SvgSpinnersBlocksWave class="size-9"/>
                    </div>
                    <p class="max-w-prose font-medium text-primary">
                        <Text :target="I18n.SeriesSyncView.processing"/>
                    </p>
                </template>
                <template v-else-if="vm.isQueued">
                    <div class="flex items-center justify-center size-20 rounded-full bg-warning/10 text-warning">
                        <LucideCloudSync class="size-9"/>
                    </div>
                    <p class="max-w-prose font-medium text-warning">
                        <Text :target="I18n.SeriesSyncView.queued"/>
                    </p>
                </template>
                <template v-else>
                    <div class="flex items-center justify-center size-20 rounded-full"
                         :class="vm.requiresSync ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'">
                        <LucideCloudSync v-if="vm.requiresSync" class="size-9"/>
                        <LucideCheck v-else class="size-9"/>
                    </div>
                    <p v-if="vm.requiresSync" class="max-w-prose text-base-content/70">
                        <Text :target="I18n.SeriesSyncView.description"/>
                    </p>
                    <p v-else class="max-w-prose font-medium text-success">
                        <Text :target="I18n.SeriesSyncView.upToDate"/>
                    </p>
                </template>
            </div>
            <div class="w-full flex justify-end p-4 border-t border-base-300">
                <button class="btn btn-primary"
                        :class="{'skeleton w-32 h-12': vm.isPreLoading}"
                        :disabled="vm.isPreLoading || !vm.canSync"
                        @click="vm.onSyncRequestBtn">
                    <template v-if="!vm.isPreLoading">
                        <LucideCloudSync class="size-5"/>
                        <Text :target="vm.requiresSync ? I18n.SeriesSyncView.startSync : I18n.SeriesSyncView.resync"/>
                    </template>
                </button>
            </div>
        </div>
    </div>
</template>
