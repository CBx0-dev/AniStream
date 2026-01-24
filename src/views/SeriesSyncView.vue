<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";

import Text from "@controls/Text.vue";
import I18n from "@utils/i18n";

const vm: SeriesSyncViewModel = useViewModel(SeriesSyncViewModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link hover:text-primary cursor-default"
                            :class="{'skeleton w-32 h-10': vm.isPreLoading}"
                            :disabled="vm.isSyncing"
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
            <div class="p-4 space-y-2">
                <template v-if="vm.isPreLoading">
                    <div class="h-4 w-full skeleton"></div>
                    <div class="h-4 w-3/4 skeleton"></div>
                </template>
                <p v-else>
                    Choose the seasons you want to add to your library. You can also refresh already added seasons
                    to make sure everything is up to date and synced with the latest available content.
                </p>
            </div>
            <ul class="list">
                <template v-if="vm.isPreLoading">
                    <li v-for="i in 5" :key="i" class="list-row items-center p-4">
                        <div class="list-col-grow h-6 w-1/3 skeleton"></div>
                        <div class="h-6 w-6 skeleton rounded-md"></div>
                    </li>
                </template>
                <template v-else>
                    <li v-if="vm.nonExistingSeasons.length > 0"
                        class="list-row items-center p-4 pb-2"
                        :class="{'opacity-50 pointer-events-none': vm.isSyncing}"
                        @click="vm.onAllAvailableRowClick">
                        <div class="list-col-grow cursor-default text-xs opacity-60">
                            Available seasons
                        </div>
                        <div>
                            <input type="checkbox"
                                   class="checkbox checkbox-primary"
                                   :disabled="vm.isSyncing"
                                   :checked="vm.allAvailableSelected"/>
                        </div>
                    </li>
                    <li v-for="season in vm.nonExistingSeasons"
                        :key="season.season_number"
                        class="list-row items-center hover:bg-primary/50"
                        :class="{'opacity-50 pointer-events-none': vm.isSyncing}"
                        @click="vm.onRowClick(season.season_number, true, false)">
                        <div class="list-col-grow cursor-default">
                            <span v-if="season.season_number == 0">
                                Filme
                            </span>
                            <span v-else>
                                Season {{ season.season_number }}
                            </span>
                        </div>
                        <div>
                            <input type="checkbox"
                                   class="checkbox checkbox-primary"
                                   :disabled="vm.isSyncing"
                                   :checked="vm.selectedSeasons.includes(season.season_number)"/>
                        </div>
                    </li>
                    <li v-if="vm.existingSeasons.length > 0"
                        class="list-row items-center p-4 pb-2"
                        :class="{'opacity-50 pointer-events-none': vm.isSyncing}"
                        @click="vm.onAllExistingRowClick">
                        <div class="list-col-grow cursor-default text-xs opacity-60">
                            Refresh existing seasons
                        </div>
                        <div>
                            <input type="checkbox"
                                   class="checkbox checkbox-primary"
                                   :disabled="vm.isSyncing"
                                   :checked="vm.allExistingSelected"/>
                        </div>
                    </li>
                    <li v-for="season in vm.existingSeasons"
                        :key="season.season_id"
                        class="list-row items-center hover:bg-primary/50"
                        :class="{'opacity-50 pointer-events-none': vm.isSyncing}"
                        @click="vm.onRowClick(season.season_number, false, true)">
                        <div class="list-col-grow cursor-default">
                            <span v-if="season.season_number == 0">
                                Filme
                            </span>
                            <span v-else>
                                Season {{ season.season_number }}
                            </span>
                        </div>
                        <div>
                            <input type="checkbox"
                                   class="checkbox checkbox-primary"
                                   :disabled="vm.isSyncing"
                                   :checked="vm.selectedSeasons.includes(season.season_number)"/>
                        </div>
                    </li>
                </template>
            </ul>
            <div class="w-full join justify-end p-4">
                <div v-if="vm.isSyncing" class="flex flex-col w-full space-y-2 mr-4">
                    <div class="flex justify-between items-center text-xs opacity-70">
                        <span>{{ vm.syncStatus }}</span>
                        <span>{{ Math.round(vm.syncProgress) }}%</span>
                    </div>
                    <progress class="progress progress-primary w-full" :value="vm.syncProgress" max="100"></progress>
                </div>
                <button class="join-item btn btn-primary btn-soft"
                        :class="{'skeleton w-32 h-12': vm.isPreLoading}"
                        :disabled="vm.isPreLoading || vm.isSyncing || vm.selectedSeasons.length == 0"
                        @click="vm.onStartSyncBtn">
                    <span v-if="!vm.isPreLoading">Start sync</span>
                </button>
            </div>
        </div>
    </div>
</template>