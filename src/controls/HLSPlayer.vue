<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {HLSPlayerModel} from "@controls/HLSPlayer.model";

import SvgSpinnersBlocksWave from "@icons/SvgSpinnersBlocksWave.vue";
import I18n from "@/utils/i18n";
import Text from "@controls/Text.vue";

const vm: HLSPlayerModel = useUserControl(HLSPlayerModel);
</script>

<template>
    <video
        v-show="vm.loaded"
        id="video-player"
        class="w-full h-full"
        controls
        @loadedmetadata="vm.onLoadedMetadata"
        @seeked="vm.onSeeked">
    </video>
    <div v-show="!vm.loaded && !vm.error" class="flex flex-col gap-4 select-none">
        <template v-if="vm.neverLoaded">
            <img :src="vm.getChooseImage()" alt="Choose Provider" class="w-full"/>
            <h1 class="font-semibold text-xl text-center">
                <Text :target="I18n.HLSPlayer.selectProvider" />
            </h1>
        </template>
        <SvgSpinnersBlocksWave v-else class="w-32 h-32 text-primary"/>
    </div>
    <div v-if="vm.error" class="border p-4 border-error rounded-md text-error text-xl">
        {{ vm.error }}
    </div>
</template>
