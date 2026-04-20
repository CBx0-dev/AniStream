<script setup lang="ts">
import {useToastControl} from "vue-mvvm/toast";

import {InfoToastModel} from "@controls/InfoToast.model";

import LucideX from "@icons/LucideX.vue";

const vm: InfoToastModel = useToastControl(InfoToastModel);
</script>

<template>
    <div class="bg-base-100 text-base-content px-4 py-3 rounded-box shadow-sm w-72">
        <div class="flex justify-between">
            <h2 class="font-semibold text-base">{{ vm.title }}</h2>
            <button class="btn btn-xs btn-ghost btn-square" @click="vm.onCloseBtn()">
                <LucideX/>
            </button>
        </div>
        <div class="text-sm opacity-70 mt-1">{{ vm.description }}</div>
    </div>
</template>
