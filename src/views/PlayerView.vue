<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {PlayerViewModel} from "@views/PlayerView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";

const vm: PlayerViewModel = useViewModel(PlayerViewModel);
</script>

<template>
    <div class="pt-5 px-5 pb-2 flex gap-4 items-center">
        <button class="btn" @click="vm.onBackBtn">
            <LucideArrowLeft/>
            Back to Series
        </button>
        <div class="text-sm text-gray-400 text-nowrap truncate">
            {{ vm.seriesTitle }}
            &#x2022;
            <template v-if="vm.seasonNumber == '0'">
                Movies
            </template>
            <template v-else>
                Season {{ vm.seasonNumber }}
            </template>
            &#x2022;
            <template v-if="vm.seasonNumber == '0'">
                Movie {{ vm.episodeNumber }}
            </template>
            <template v-else>
                Episode {{ vm.episodeNumber }}
            </template>

        </div>
    </div>
    <div class="px-5 pb-5 grow flex gap-3">
        <div class="grow flex flex-col gap-3">
            <div class="aspect-video card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Video
                </div>
            </div>
            <div class="flex justify-between">
                <button class="btn btn-soft">
                    WASD
                </button>
                <button class="btn btn-soft">
                    WASD
                </button>
            </div>
            <div class="grow card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Description
                </div>
            </div>
        </div>
        <div class="shrink-0 flex flex-col gap-3">
            <div class="shrink-0 card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Providers
                </div>
            </div>
            <div class="grow card bg-base-100 card-border border-base-300">
                <div class="card-body overflow-y-auto">
                    Episodes
                </div>
            </div>
        </div>
    </div>
</template>