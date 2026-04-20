<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {StreamsViewModel} from "@views/StreamsView.model";

import LucideSearch from "@icons/LucideSearch.vue";
import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideListVideo from "@icons/LucideListVideo.vue";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideX from "@icons/LucideX.vue";

import I18n from "@utils/i18n";

import Text from "@/controls/Text.vue";
import ImageHash from "@controls/ImageHash.vue";

const vm: StreamsViewModel = useViewModel(StreamsViewModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link hover:text-primary cursor-default" @click="vm.onBackBtn">
                        <LucideArrowLeft/>
                        <Text :target="I18n.StreamsView.navbar.back"/>
                    </button>
                    <div class="join">
                        <button class="join-item btn btn-soft" @click="vm.onSyncBtn">
                            <LucideCloudSync/>
                            <Text :target="I18n.StreamsView.navbar.sync"/>
                        </button>
                        <button class="join-item btn btn-soft" @click="vm.onWatchlistBtn">
                            <LucideListVideo/>
                            <Text :target="I18n.StreamsView.navbar.watchlist"/>
                        </button>
                    </div>
                </div>
                <label class="input w-full">
                    <LucideSearch/>
                    <input
                        type="text"
                        class="grow"
                        v-model="vm.searchText"
                        :placeholder="vm.i18n(I18n.StreamsView.navbar.searchPlaceholder)"/>
                </label>
                <div>
                    <div class="join flex-wrap">
                        <select class="select select-sm w-fit rounded-l-lg bg-base-200 border-base-300" v-model="vm.genreFilter"
                                @input="vm.onGenreFilter(parseInt(($event.target! as HTMLSelectElement).value))">
                            <option disabled selected value="default">
                                <Text :target="I18n.StreamsView.navbar.selectGenre"/>
                            </option>
                            <option
                                v-for="genre of vm.availableGenres"
                                :key="genre.genre_id"
                                :value="genre.genre_id">
                                {{ vm.i18nDynamic(I18n.Genres, genre.key) }}
                            </option>
                        </select>
                        <div
                            v-for="genre of vm.filteredGenres"
                            :key="genre.genre_id"
                            class="btn btn-sm border border-base-300"
                            @click="vm.onGenreFilterRemoveBtn(genre.genre_id)">
                            {{ vm.i18nDynamic(I18n.Genres, genre.key) }}
                        </div>
                        <button
                            class="shrink-0 join-item btn btn-sm btn-square border border-base-300"
                            @click="vm.onGenreFilterClearBtn">
                            <LucideX/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">
            <ImageHash
                v-for="series of vm.series"
                :key="series.series_id"
                class="border border-base-300 rounded-box hover:scale-110 hover:shadow-sm duration-300"
                :provider-folder="vm.providerFolder"
                :hash="series.preview_image"
                :width="150"
                :height="225"
                @click="vm.onCardClick(series)"/>
        </div>
        <div class="text-center text-gray-400" id="intersectionLine">
            <Text :target="I18n.StreamsView.content.eol" />
        </div>
    </div>
</template>