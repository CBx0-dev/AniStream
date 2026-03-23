<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {HLSPlayerModel} from "@controls/HLSPlayer.model";

import SvgSpinnersBlocksWave from "@icons/SvgSpinnersBlocksWave.vue";
import LucidePlay from "@icons/LucidePlay.vue";
import LucideMaximize from "@icons/LucideMaximize.vue";
import LucideHistory from "@icons/LucideHistory.vue";
import LucidePause from "@icons/LucidePause.vue";
import LucideMinimize from "@icons/LucideMinimize.vue";

import I18n from "@utils/i18n";

import Text from "@controls/Text.vue";

const vm: HLSPlayerModel = useUserControl(HLSPlayerModel);
</script>

<template>
    <div
        v-show="vm.loaded"
        id="video-player-wrapper"
        class="w-full h-full relative data-[controls=false]:cursor-none"
        :data-controls="vm.showControls"
        @mousemove="vm.onMouseMovement()">
        <video
            id="video-player"
            class="w-full h-full"
            @loadedmetadata="vm.onLoadedMetadata"
            @click="vm.onPlayPauseBtn()">
        </video>
        <Transition
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300">
            <div v-if="vm.showControls" :key="vm.controlKey" class="absolute bottom-0 left-0 w-full flex items-center gap-4 p-2 bg-base-300 rounded-box border border-base-100 z-99" @click.stop>
                <div class="flex gap-2 items-center">
                    <button class="tooltip btn btn-ghost btn-sm btn-square hover:text-primary" :data-tip="vm.i18n(I18n.HLSPlayer.rewind)" @click="vm.onRewindBtn()">
                        <LucideHistory class="size-5"/>
                    </button>
                    <button class="tooltip btn btn-ghost btn-sm btn-square hover:text-primary" :data-tip="vm.isPlaying() ? vm.i18n(I18n.HLSPlayer.pause) : vm.i18n(I18n.HLSPlayer.play)" @click="vm.onPlayPauseBtn()">
                        <LucidePause v-if="vm.isPlaying()" class="size-5" />
                        <LucidePlay v-else class="size-5"/>
                    </button>
                    <button class="btn btn-ghost btn-sm hover:text-primary" @click="vm.onTimeBtn()">
                        <span :key="vm.timeKey">
                            {{ vm.getCurrentTime() }} / {{ vm.getCompleteTime() }}
                        </span>
                    </button>
                </div>
                <div :key="vm.timeKey" class="grow">
                    <div class="relative w-full h-2 bg-base-100 rounded cursor-pointer overflow-clip" @click="vm.onSeeked($event)">
                        <div class="absolute top-0 left-0 h-full bg-primary/15" :style="`width:${vm.getBufferedPercent()}%`">
                        </div>
                        <div class="absolute top-0 left-0 h-full bg-primary" :style="`width:${vm.getWatchedPercent()}%`">
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="tooltip flex items-start ml-3" :data-tip="vm.i18n(I18n.HLSPlayer.volume, vm.volume)">
                        <input type="range" min="0" max="100" v-model="vm.volume" class="range range-primary range-xs" />
                    </div>
                    <button class="tooltip btn btn-ghost btn-sm btn-square hover:text-primary"
                            :data-tip="vm.isMaximized() ? vm.i18n(I18n.HLSPlayer.exitFullscreen) : vm.i18n(I18n.HLSPlayer.enterFullscreen)"
                            @click="vm.onMaximizeMinimizeBtn()">
                        <LucideMinimize v-if="vm.isMaximized()" class="size-5" />
                        <LucideMaximize v-else class="size-5"/>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
    <div v-show="!vm.loaded && !vm.error" class="flex flex-col gap-4 select-none">
        <template v-if="vm.neverLoaded">
            <img :src="vm.getChooseImage()" :alt="vm.i18n(I18n.HLSPlayer.chooseProvider)" class="w-full"/>
            <h1 class="font-semibold text-xl text-center">
                <Text :target="I18n.HLSPlayer.selectProvider"/>
            </h1>
        </template>
        <SvgSpinnersBlocksWave v-else class="w-32 h-32 text-primary"/>
    </div>
    <div v-if="vm.error" class="border p-4 border-error rounded-md text-error text-xl">
        {{ vm.error }}
    </div>
</template>
