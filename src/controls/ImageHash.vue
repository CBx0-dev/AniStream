<script setup lang="ts">
import {computed, ComputedRef, ref, Ref, watch} from "vue";
import {convertFileSrc} from "@tauri-apps/api/core";
import {path} from "@tauri-apps/api";

const props = defineProps<{
    providerFolder: string | null;
    hash: string | null;
    width: number;
    height: number;
}>();

const styleString: ComputedRef<string> = computed(() => `width: ${props.width}px; height: ${props.height}px;`);
const url: Ref<string | null> = ref(null);
const loaded: Ref<boolean> = ref(false);

watch(props, buildURL, {
    immediate: true
});

async function buildURL() {
    loaded.value = false;
    if (!props.providerFolder || !props.hash) {
        url.value = null;
        return;
    }

    url.value = convertFileSrc(await path.join(props.providerFolder, props.hash));
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
        class="skeleton" />
    <img
        v-bind="$attrs"
        v-show="url && loaded"
        :src="url ?? undefined"
        :alt="hash ?? 'N/A'"
        :style="styleString"
        type="image/png"
        @load="onLoaded"/>
</template>