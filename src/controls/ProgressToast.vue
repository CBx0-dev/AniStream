<script setup lang="ts">
import {useToastControl} from "vue-mvvm/toast";

import {ProgressToastModel} from "@controls/ProgressToast.model";

const vm: ProgressToastModel = useToastControl(ProgressToastModel);
</script>

<template>
    <div class="bg-base-100 text-base-content px-4 py-3 rounded-box shadow-sm w-72">
        <div class="flex justify-between">
            <h2 class="font-semibold text-base">{{ vm.title }}</h2>
        </div>
        <div class="text-sm opacity-70 mt-1">{{ vm.description }}</div>
        <div v-if="vm.isIntermediate" class="my-2 h-1 w-full rounded-md animate-pulse bg-primary"></div>
        <div v-else class="my-2 h-1 w-full rounded-md bg-base-200 overflow-clip">
            <div :style="`width:${vm.percentage}%`" class="h-1 bg-primary"></div>
        </div>
    </div>
</template>
