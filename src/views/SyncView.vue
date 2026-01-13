<script setup lang="ts">
import {useViewModel} from "vue-mvvm";
import {SyncViewModel} from "./SyncView.model";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideArrowLeft from "@icons/LucideArrowLeft.vue";

const vm: SyncViewModel = useViewModel(SyncViewModel);
</script>

<template>
    <div class="container m-auto">
        <h1 class="text-xl text-center font-semibold">Sync required</h1>
        <div class="flex justify-center pt-4">
            <div class="card bg-base-100 card-border border-base-300 w-105">
                <figure>
                    <img src="/sync.svg" alt="Sync" class="h-[350px]"/>
                </figure>
                <div class="card-body" v-if="vm.isPreparing">
                    <p>A sync is required before starting to watch your favorite anime or series.</p>
                    <p>The first sync will take some time and will approximately take <strong>1GB</strong> of storage.
                    </p>

                    <div class="join justify-end mt-10">
                        <button class="join-item btn btn-neutral btn-soft" @click="vm.onBackBtn">
                            <LucideArrowLeft/>
                            Back
                        </button>
                        <button class="join-item btn btn-primary btn-soft" @click="vm.onStartSyncingBtn">
                            <LucideCloudSync/>
                            Start syncing
                        </button>
                    </div>
                </div>
                <div class="card-body" v-if="vm.isSyncing">
                    <progress class="progress progress-neutral w-full max-w-[150px] mx-auto" :value="vm.processed"
                              :max="vm.totalToProceed"/>
                    <div class="mx-auto">
                        <span>{{ vm.processed }}</span>
                        <span> / </span>
                        <span>{{ vm.totalToProceed }}</span>
                    </div>
                </div>
                <div class="card-body" v-if="vm.isContinue">
                    <div class="mx-auto">
                        The sync process is completed.
                    </div>

                    <button class="join-item btn btn-primary btn-soft mt-10" @click="vm.onStartWatchingBtn">
                        <LucideCloudSync/>
                        Start watching
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>