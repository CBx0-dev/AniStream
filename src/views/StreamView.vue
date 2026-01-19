<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {StreamViewModel} from "@views/StreamView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideListVideo from "@icons/LucideListVideo.vue";
import LucideInfo from "@icons/LucideInfo.vue";

import ImageHash from "@controls/ImageHash.vue";
import Text from "@controls/Text.vue";

import I18n from "@utils/i18n";
import LucidePopcorn from "@/icons/LucidePopcorn.vue";
import LucideFolder from "@/icons/LucideFolder.vue";
import LucideTimerReset from "@/icons/LucideTimerReset.vue";

const vm: StreamViewModel = useViewModel(StreamViewModel);
</script>

<template>
    <div class="grow container mx-auto py-10 flex flex-col">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link hover:text-primary cursor-default" @click="vm.onBackBtn">
                        <LucideArrowLeft/>
                        Back to Series
                    </button>
                    <div class="join">
                        <button class="join-item btn btn-soft" @click="vm.onSyncBtn">
                            <LucideCloudSync/>
                            Sync series
                        </button>
                        <button class="join-item btn btn-soft">
                            <LucideTimerReset/>
                            Reset progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-5 mt-5 grow">
            <div class="shrink-0 card bg-base-100 card-border border-base-300 h-min">
                <div class="card-body">
                    <ImageHash 
                        :provider-folder="vm.providerFolder"
                        :hash="vm.previewImage"
                        :width="300"
                        :height="450" />
                </div>
            </div>
            <div class="grow card bg-base-100 card-border border-base-300 h-full">
                <div class="card-body">
                    <div class="tabs tabs-lift w-full h-full">
                        <label class="tab">
                            <input type="radio" name="settings-tabs" checked/>
                            <span class="inline-flex items-center gap-1">
                                <LucideInfo/>
                                Info
                            </span>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
                            <p>{{ vm.description }}</p>
                        
                            <div class="flex flex-wrap gap-2 pt-3">
                                <div v-if="vm.mainGenre" class="badge badge-sm badge-soft badge-primary">
                                    {{ vm.getGenreName(vm.mainGenre!.key) }}
                                </div>
                                <div v-for="genre in vm.genres" class="badge badge-sm badge-soft text-nowrap">
                                    {{ vm.getGenreName(genre.key) }}
                                </div>
                            </div>
                        </div>
                        <template v-for="season of vm.seasons" :key="season.season_id">
                            <label class="tab">
                                <input type="radio" name="settings-tabs" checked/>
                                <span v-if="season.season_number == 0" class="inline-flex items-center gap-1">
                                    <LucidePopcorn/>
                                    Filme
                                </span>
                                <span v-else class="inline-flex items-center gap-1">
                                    <LucideFolder/>
                                    Staffel
                                    {{ season.season_number }}
                                </span>
                            </label>
                            <div class="tab-content bg-base-100 border-base-300 p-6">
                                <ul class="list bg-base-100 rounded-box">
                                    <li class="list-row">
                                        <div>
                                        </div>
                                    </li>
                                </ul>
                            </div> 
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>