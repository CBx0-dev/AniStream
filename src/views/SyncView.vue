<script setup lang="ts">
import {useViewModel} from "vue-mvvm";
import {SyncViewModel} from "./SyncView.model";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import I18n from "@/utils/i18n";
import Text from "@/controls/Text.vue";

const vm: SyncViewModel = useViewModel(SyncViewModel);
</script>

<template>
    <div class="container m-auto">
        <h1 class="text-xl text-center font-semibold">
            <Text :target="I18n.SyncView.title" />
        </h1>
        <div class="flex justify-center pt-4">
            <div class="card bg-base-100 card-border border-base-300 w-105">
                <figure>
                    <img :src="vm.getSyncImage()" alt="Sync" class="h-[300px]" />
                </figure>
                <div v-if="vm.isPreparing" class="card-body px-3 pt-0 pb-3">
                    <p>
                        <Text :target="I18n.SyncView.prepare.reason" />
                    </p>
                    <p>
                        <Text :target="I18n.SyncView.prepare.note" />
                    </p>

                    <div class="join justify-end mt-8">
                        <button class="join-item btn btn-soft" @click="vm.onBackBtn">
                            <LucideArrowLeft/>
                            <Text :target="I18n.SyncView.prepare.back" />
                        </button>
                        <button class="join-item btn btn-primary btn-soft" @click="vm.onStartSyncingBtn">
                            <LucideCloudSync/>
                            <Text :target="I18n.SyncView.prepare.start" />
                        </button>
                    </div>
                </div>
                <div v-if="vm.isSyncing" class="card-body px-3 pt-0 pb-3">
                    <progress class="progress progress-neutral w-full max-w-[150px] mx-auto" :value="vm.processed"
                              :max="vm.totalToProceed"/>
                    <div class="mx-auto">
                        <span>{{ vm.processed }}</span>
                        <span> / </span>
                        <span>{{ vm.totalToProceed }}</span>
                    </div>
                </div>
                <div v-if="vm.isContinue" class="card-body px-3 pt-0 pb-3">
                    <div class="mx-auto">
                        The sync process is completed.
                    </div>

                    <button class="join-item btn btn-primary btn-soft mt-8" @click="vm.onStartWatchingBtn">
                        <LucideCloudSync/>
                        Start watching
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>