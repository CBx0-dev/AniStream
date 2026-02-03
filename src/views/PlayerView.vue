<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {PlayerViewModel} from "@views/PlayerView.model";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideArrowRight from "@icons/LucideArrowRight.vue";
import HLSPlayer from "@controls/HLSPlayer.vue";
import I18n from "@utils/i18n";
import Text from "@controls/Text.vue";

const vm: PlayerViewModel = useViewModel(PlayerViewModel);
</script>

<template>
    <div class="h-screen overflow-hidden grid grid-rows-[auto_1fr]">
        <div class="pt-5 px-5 pb-2 flex gap-4 items-center">
            <button class="btn" @click="vm.onBackBtn">
                <LucideArrowLeft/>
                <Text :target="I18n.PlayerView.back"/>
            </button>
            <div class="text-sm text-gray-400 text-nowrap truncate">
                {{ vm.seriesTitle }}
                &#x2022;
                <template v-if="vm.seasonNumber == '0'">
                    <Text :target="I18n.PlayerView.movies"/>
                </template>
                <template v-else>
                    <Text :target="I18n.PlayerView.season"/>
                    {{ vm.seasonNumber }}
                </template>
                &#x2022;
                <template v-if="vm.seasonNumber == '0'">
                    <Text :target="I18n.PlayerView.movie"/>
                    {{ vm.episodeNumber }}
                </template>
                <template v-else>
                    <Text :target="I18n.PlayerView.episode"/>
                    {{ vm.episodeNumber }}
                </template>
            </div>
        </div>
        <div class="grid grid-cols-[1fr_320px] grid-rows-[auto_auto_1fr] gap-4 px-5 pb-5 overflow-hidden">
            <div class="card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    <div class="aspect-video w-full h-full max-h-[810px] flex justify-center items-center">
                        <HLSPlayer ref="player"/>
                    </div>
                </div>
            </div>
            <div class="row-span-3 flex flex-col gap-4 overflow-hidden">
                <div class="card bg-base-100 card-border border-base-300">
                    <div class="card-body">
                        <h1 class="text-xl pb-4">
                            <Text :target="I18n.PlayerView.providers"/>
                        </h1>
                        <div v-if="vm.providerLoading" class="skeleton w-full h-[350px]"/>
                        <div v-else>
                            <ul v-for="providers of vm.providers"
                                :key="providers[0].language"
                                class="menu w-full">
                                <li class="py-1 text-xs text-gray-400">
                                    {{ vm.getProviderLanguageText(providers[0].language) }}
                                </li>
                                <li v-for="provider of providers"
                                    :key="provider.name">
                                    <a class="data-[active=true]:bg-primary data-[active=true]:text-primary-content"
                                       :data-active="provider == vm.activeProvider"
                                       @click="vm.onProviderItem(provider)">
                                        {{ provider.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="grow card bg-base-100 card-border border-base-300 overflow-y-auto">
                    <div class="card-body overflow-y-auto">
                        <h1 class="text-xl pb-4">
                            <Text :target="I18n.PlayerView.episodes"/>
                        </h1>
                        <div class="overflow-y-auto">
                            <ul class="menu menu-md w-full p-0">
                                <li v-for="episode of vm.episodes"
                                    :key="episode.episode_id"
                                    :data-active="episode.episode_number.toString() == vm.episodeNumber"
                                    class="data-[active=true]:bg-base-200 data-[active=true]:text-primary"
                                    @click="vm.onEpisodeItem(episode)">
                                    <span v-if="episode.german_title">
                                        <span>
                                            <span class="text-sm font-semibold">
                                                {{ episode.episode_number }}:
                                                {{ episode.german_title }}
                                            </span>
                                            <br>
                                            <span class="text-xs opacity-70">
                                                {{ episode.english_title }}
                                            </span>
                                        </span>
                                    </span>
                                    <span v-else>
                                        <span class="text-sm font-semibold">
                                            {{ episode.episode_number }}:
                                            {{ episode.english_title }}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-1">
                <div class="flex justify-between">
                    <button class="btn btn-soft"
                            @click="vm.onPreviousBtn"
                            :disabled="!vm.previousEpisode">
                        <LucideArrowLeft/>
                        <Text :target="I18n.PlayerView.previous"/>
                    </button>
                    <button class="btn btn-soft"
                            @click="vm.onNextBtn"
                            :disabled="!vm.nextEpisode">
                        <Text :target="I18n.PlayerView.next"/>
                        <LucideArrowRight/>
                    </button>
                </div>
            </div>
            <div class="col-span-1 overflow-hidden">
                <div class="h-full card bg-base-100 card-border border-base-300">
                    <div class="card-body">
                        <h1 v-if="vm.episodeTitleHasGerman" class="text-xl">
                            {{ vm.episodeTitleGerman }}
                            &#x2022;
                            <span class="opacity-70">
                            {{ vm.episodeTitleEnglish }}
                        </span>
                        </h1>
                        <h1 v-else class="text-xl">
                            {{ vm.episodeTitleEnglish }}
                        </h1>
                        <p class="opacity-70">
                            {{ vm.episodeDescription }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>