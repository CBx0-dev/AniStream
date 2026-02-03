<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {StreamViewModel} from "@views/StreamView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideCloudSync from "@icons/LucideCloudSync.vue";
import LucideInfo from "@icons/LucideInfo.vue";
import LucidePopcorn from "@icons/LucidePopcorn.vue";
import LucideFolder from "@icons/LucideFolder.vue";
import LucideTimerReset from "@icons/LucideTimerReset.vue";
import LucideEllipsisVertical from "@icons/LucideEllipsisVertical.vue";
import LucideCheck from "@icons/LucideCheck.vue";

import ImageHash from "@controls/ImageHash.vue";

const vm: StreamViewModel = useViewModel(StreamViewModel);
</script>

<template>
    <div class="container mx-auto py-10 grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] gap-5 h-screen">
        <div class="col-span-2 card bg-base-100 card-border border-base-300">
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
                        <button class="join-item btn btn-soft" @click="vm.onResetBtn">
                            <LucideTimerReset/>
                            Reset progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row-start-2 card bg-base-100 card-border border-base-300 h-min">
            <div class="card-body box-content w-[300px]">
                <ImageHash
                    :provider-folder="vm.providerFolder"
                    :hash="vm.previewImage"
                    :width="300"
                    :height="450"/>
            </div>
        </div>
        <div class="row-start-2 card bg-base-100 card-border border-base-300 overflow-y-auto w-full">
            <div class="card-body h-full">
                <div class="tabs tabs-lift w-full h-full">
                    <label class="tab">
                        <input type="radio" name="stream-tabs" checked/>
                        <span class="inline-flex items-center gap-1">
                            <LucideInfo/>
                            Info
                        </span>
                    </label>
                    <div class="tab-content bg-base-100 border-base-300 p-6 overflow-y-auto">
                        <p>{{ vm.description }}</p>

                        <div class="flex flex-wrap gap-2 pt-10">
                            <div v-if="vm.mainGenre" class="badge badge-soft badge-primary">
                                {{ vm.getGenreName(vm.mainGenre!.key) }}
                            </div>
                            <div v-for="genre in vm.genres" class="badge badge-soft text-nowrap">
                                {{ vm.getGenreName(genre.key) }}
                            </div>
                        </div>
                    </div>
                    <template v-for="season of vm.seasons" :key="season.season_id">
                        <label class="tab">
                            <input type="radio" name="stream-tabs"/>
                            <span v-if="season.season_number == 0" class="inline-flex items-center gap-1">
                                <LucidePopcorn/>
                                Movies
                            </span>
                            <span v-else class="inline-flex items-center gap-1">
                                <LucideFolder/>
                                Season
                                {{ season.season_number }}
                            </span>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6 overflow-y-auto">
                            <div class="flex flex-col gap-4">
                                <div v-for="episode of vm.getEpisodes(season.season_id)"
                                     :key="episode.episode_id"
                                     class="bg-base-200 p-4 rounded-lg flex flex-col gap-2 hover:bg-primary/30 duration-200 cursor-pointer"
                                     @click="vm.onEpisodeRowClick(season, episode)">
                                    <div class="relative flex gap-4 items-center">
                                        <div class="badge badge-soft badge-sm">
                                            EP {{ episode.episode_number }}
                                        </div>
                                        <div class="flex gap-2 items-center textarea-xs text-gray-400">
                                            <input type="radio"
                                                   class="radio radio-xs radio-primary !cursor-default !opacity-100"
                                                   disabled
                                                   :checked="episode.percentage_watched >= 80"/>
                                            <span v-if="episode.percentage_watched >= 80">
                                                Watched
                                            </span>
                                            <span v-else>
                                                Not watched
                                            </span>
                                        </div>
                                        <div
                                            v-if="episode.percentage_watched < 80"
                                            class="absolute right-0 top-0">
                                            <button class="btn btn-square btn-sm btn-ghost"
                                                    :popovertarget="vm.getPopoverId(episode.episode_id)"
                                                    :style="`anchor-name:${vm.getAnchorId(episode.episode_id)}`"
                                                    @click.stop>
                                                <LucideEllipsisVertical/>
                                            </button>
                                            <Teleport to="#app">
                                                <ul class="dropdown menu w-fit rounded-box bg-base-100 shadow-sm"
                                                    popover
                                                    :id="vm.getPopoverId(episode.episode_id)"
                                                    :style="`position-anchor:${vm.getAnchorId(episode.episode_id)}`"
                                                    @click="vm.onPopOverClicked($event)">
                                                    <li>
                                                        <a class="items-center"
                                                           @click="vm.onMarkWatchedBtn(episode)">
                                                            <LucideCheck/>
                                                            Mark as watched
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Teleport>
                                        </div>
                                    </div>
                                    <div>
                                        <template v-if="episode.german_title">
                                            <h3 class="leading-none">{{ episode.german_title }}</h3>
                                            <span class="text-sm opacity-60 leading-none">
                                                {{ episode.english_title }}
                                            </span>
                                        </template>
                                        <h3 v-else class="leading-none">
                                            {{ episode.english_title }}
                                        </h3>
                                    </div>
                                    <p class="text-sm opacity-60">{{ episode.description }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>