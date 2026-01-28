<script setup lang="ts">
import { useViewModel } from "vue-mvvm";

import { WatchlistViewModel } from "@views/WatchlistView.model";

import Text from "@controls/Text.vue";
import I18n from "@utils/i18n";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import ImageHash from "@controls/ImageHash.vue";

const vm: WatchlistViewModel = useViewModel(WatchlistViewModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link hover:text-primary" @click="vm.onBackBtn">
                        <LucideArrowLeft />
                        <Text :target="I18n.WatchlistView.navbar.back" />
                    </button>
                </div>
            </div>
        </div>
        <template v-if="vm.startedSeries.length > 0">
            <h1 class="text-2xl font-semibold mt-10 flex gap-4 items-center">
                <Text :target="I18n.WatchlistView.leftOff.title" class="shrink-0" />
                <div class="bg-primary w-full h-1" />
            </h1>
            <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">
                <ImageHash
                    v-for="series of vm.startedSeries"
                    :key="series.series_id"
                    class="border border-base-300 rounded-box hover:scale-110 hover:shadow-sm duration-300"
                    :provider-folder="vm.providerFolder"
                    :hash="series.preview_image"
                    :width="150"
                    :height="225"
                    @click="vm.onCardClick(series)"/>
            </div>
        </template>
        <template v-if="vm.watchlistSeries.length > 0">
            <h1 class="text-2xl font-semibold mt-10 flex gap-4 items-center">
                <Text :target="I18n.WatchlistView.watchlist.title" class="shrink-0" />
                <div class="bg-primary w-full h-1" />
            </h1>
            <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">
                <ImageHash
                    v-for="series of vm.watchlistSeries"
                    :key="series.series_id"
                    class="border border-base-300 rounded-box hover:scale-110 hover:shadow-sm duration-300"
                    :provider-folder="vm.providerFolder"
                    :hash="series.preview_image"
                    :width="150"
                    :height="225"
                    @click="vm.onCardClick(series)"/>
            </div>
        </template>
        <template v-if="vm.everythingEmpty">
            <h1 class="text-center font-semibold text-xl p-10 opacity-70">There is currently nothing to show here.</h1>
        </template>
<!--        <h1 class="text-2xl font-semibold mt-10 flex gap-4 items-center">-->
<!--            <Text :target="I18n.WatchlistView.personal.title" class="shrink-0" />-->
<!--            <div class="bg-primary w-full h-1" />-->
<!--        </h1>-->
<!--        <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">-->
<!--            <div v-for="i of 10" :key="i"-->
<!--                class="w-[150px] h-[225px] bg-base-100 border border-base-300 rounded-sm hover:scale-110 hover:shadow-sm duration-300">-->
<!--            </div>-->
<!--        </div>-->
<!--        <h1 class="text-2xl font-semibold mt-10 flex gap-4 items-center">-->
<!--            <Text :target="I18n.WatchlistView.tracklist.title" class="shrink-0" />-->
<!--            <div class="bg-primary w-full h-1" />-->
<!--        </h1>-->
<!--        <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">-->
<!--            <div v-for="i of 10" :key="i"-->
<!--                class="w-[150px] h-[225px] bg-base-100 border border-base-300 rounded-sm hover:scale-110 hover:shadow-sm duration-300"-->
<!--                @click="vm.onCardClick">-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>