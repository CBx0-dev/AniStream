<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {ThemeControlModel} from "@controls/ThemeControl.model";

const vm: ThemeControlModel = useUserControl(ThemeControlModel);
</script>

<template>
    <h1 class="text-2xl font-semibold">Preferences</h1>
    <div class="flex flex-wrap py-5 gap-5">
        <button
            @click="vm.onAniworldLightThemeBtn"
            data-theme="aniworld-light"
            :data-selected="vm.activeTheme == 'aniworld-light'"
            class="group relative w-64 rounded-box border border-base-300 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
            <h3 class="text-lg font-semibold">
                AniWorld.to Light
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                Bright anime-inspired colors with vibrant purples and playful accents. Clean, lively, and easy on the eyes.
            </p>

            <div class="mt-4 flex gap-2">
                <span class="h-6 w-6 rounded-full bg-primary"></span>
                <span class="h-6 w-6 rounded-full bg-secondary"></span>
                <span class="h-6 w-6 rounded-full bg-base-300"></span>
                <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
            </div>
        </button>

        <button
            @click="vm.onAniworldDarkThemeBtn"
            data-theme="aniworld-dark"
            :data-selected="vm.activeTheme == 'aniworld-dark'"
            class="group relative w-64 rounded-box border border-base-300 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
            <h3 class="text-lg font-semibold">
                AniWorld.to Dark
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                Deep dark surfaces with glowing violet highlights. Perfect for nighttime viewing with a bold anime aesthetic.
            </p>

            <div class="mt-4 flex gap-2">
                <span class="h-6 w-6 rounded-full bg-primary"></span>
                <span class="h-6 w-6 rounded-full bg-secondary"></span>
                <span class="h-6 w-6 rounded-full bg-base-300"></span>
                <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
            </div>
        </button>

        <button
            @click="vm.onStoLightThemeBtn"
            data-theme="sto-light"
            :data-selected="vm.activeTheme == 'sto-light'"
            class="group relative w-64 rounded-box border border-base-300 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
            <h3 class="text-lg font-semibold">
                S.TO Light
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                Minimal and cinematic with cool blues and soft contrasts. A clean, modern look for daytime browsing.
            </p>

            <div class="mt-4 flex gap-2">
                <span class="h-6 w-6 rounded-full bg-primary"></span>
                <span class="h-6 w-6 rounded-full bg-secondary"></span>
                <span class="h-6 w-6 rounded-full bg-base-300"></span>
                <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
            </div>
        </button>

        <button
            @click="vm.onStoDarkThemeBtn"
            data-theme="sto-dark"
            :data-selected="vm.activeTheme == 'sto-dark'"
            class="group relative w-64 rounded-box border border-base-300 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
            <h3 class="text-lg font-semibold">
                S.TO Dark
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                Dark, immersive streaming style with cool blue tones. Focused, elegant, and ideal for long watch sessions.
            </p>

            <div class="mt-4 flex gap-2">
                <span class="h-6 w-6 rounded-full bg-primary"></span>
                <span class="h-6 w-6 rounded-full bg-secondary"></span>
                <span class="h-6 w-6 rounded-full bg-base-300"></span>
                <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
            </div>
        </button>
    </div>


</template>
