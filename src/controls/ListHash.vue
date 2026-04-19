<script setup lang="ts">
import {convertFileSrc} from "@tauri-apps/api/core";
import {path} from "@tauri-apps/api";

import {computed, ComputedRef, Ref, ref, watch} from "vue";

const props = defineProps<{
    providerFolder: string | null;
    hashes: string[] | null;
    width: number;
    height: number;
}>();

const urls: Ref<string[]> = ref([]);
const loadCounter: Ref<number> = ref(0);

const loaded: Ref<boolean> = computed(() => loadCounter.value == props.hashes?.length || urls.value.length == 0);
const styleString: ComputedRef<string> = computed(() => `width:${props.width}px;height:${props.height}px`);
const gridConfig: ComputedRef<{ container: string, items: string[] }> = computed(() => {
    const count: number = props.hashes?.length ?? 0;

    switch (count) {
        case 1:
            return {
                container: "grid-cols-1 grid-rows-1",
                items: ["col-span-1 row-span-1"]
            }
        case 2:
            return {
                container: "grid-cols-1 grid-rows-2",
                items: ["col-span-1", "col-span-1"]
            }
        case 3:
            return {
                container: "grid-cols-2 grid-rows-2",
                items: [
                    "col-span-1 row-span-1",
                    "col-span-1 row-span-1",
                    "col-span-2 row-span-2"
                ]
            }
        case 4:
            return {
                container: "grid-cols-2 grid-rows-2",
                items: [
                    "col-span-1",
                    "col-span-1",
                    "col-span-1",
                    "col-span-1",
                ]
            }
        default:
            return {
                container: "border border-base-300 bg-base-100",
                items: []
            }
    }
});

watch(props, buildURL, {
    immediate: true
});

async function buildURL() {
    loadCounter.value = 0;
    if (!props.providerFolder || !props.hashes || props.hashes.length == 0) {
        urls.value = [];
        return;
    }

    urls.value = await Promise.all(
        props.hashes.map(async hash => convertFileSrc(await path.join(props.providerFolder!, hash)))
    );
}

function onLoaded() {
    loadCounter.value++;
}

</script>

<template>
    <div
        v-bind="$attrs"
        v-if="!loaded"
        :style="styleString" class="skeleton"/>
    <div
        v-bind="$attrs"
        v-show="loaded"
        :style="styleString">
        <div
            :style="styleString"
            class="relative overflow-hidden grid"
            :class="gridConfig.container">
            <div
                v-for="(url, index) of urls"
                :key="url"
                :class="gridConfig.items[index]"
                class="relative w-full h-full overflow-hidden">
                <img
                    :src="url"
                    :alt="url ?? 'N/A'"
                    class="absolute inset-0 w-full h-full object-cover"
                    @load="onLoaded"/>
            </div>
        </div>
    </div>
</template>