<script lang="ts">
const IMAGE_CACHE: Map<string, [string, Blob]> = new Map<string, [string, Blob]>();
</script>

<script setup lang="ts">
import {convertFileSrc} from "@tauri-apps/api/core";

import {computed, ComputedRef, ref, Ref, watch} from "vue";

import * as path from "@utils/path";
import * as http from "@utils/http";

const props = defineProps<{
    providerFolder: string | null;
    hash: string | null;
    width: number;
    height: number;
}>();

const url: Ref<string | null> = ref(null);
const loaded: Ref<boolean> = ref(false);

const styleString: ComputedRef<string> = computed(() => `width:${props.width}px;height:${props.height}px`);

watch(props, buildURL, {
    immediate: true
});

async function buildURL() {
    loaded.value = false;
    if (!props.providerFolder || !props.hash) {
        url.value = null;
        return;
    }

    if (!props.providerFolder.startsWith("http")) {
        url.value = convertFileSrc(path.join(props.providerFolder, props.hash));
        return;
    }

    const remoteUrl: string = props.providerFolder + props.hash;

    let cache: [string, Blob] | undefined = IMAGE_CACHE.get(remoteUrl);

    if (!cache) {
        const image: Blob = await http.get(remoteUrl).blob();
        const localUrl: string = URL.createObjectURL(image);

        cache = [localUrl, image];
        IMAGE_CACHE.set(remoteUrl, cache);
    }

    url.value = cache[0];
}

function onLoaded() {
    loaded.value = true;
}
</script>

<template>
    <div
        v-bind="$attrs"
        v-if="!url || !loaded"
        :style="styleString"
        class="skeleton"/>
    <img
        v-bind="$attrs"
        v-show="url && loaded"
        :src="url ?? undefined"
        :alt="hash ?? 'N/A'"
        :style="styleString"
        type="image/png"
        @load="onLoaded"/>
</template>