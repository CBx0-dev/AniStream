<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {PrefControlModel} from "@controls/PrefControl.model";
import I18n from "@utils/i18n";

import Text from "@controls/Text.vue";

import LucideEdit from "@icons/LucideEdit.vue";
import LucideTrash from "@icons/LucideTrash.vue";

const vm: PrefControlModel = useUserControl(PrefControlModel);
</script>

<template>
    <div class="space-y-6 max-w-2xl mx-auto">
        <section>
            <div class="flex flex-col items-center gap-4">
                <div class="avatar relative">
                    <div
                        class="w-24 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden bg-base-200">
                        <img v-if="vm.avatarSvg" :src="vm.avatarSvg" alt="Avatar Preview"/>
                    </div>
                    <button class="opacity-0 hover:opacity-100 focus:opacity-100 rounded-2xl duration-100 flex absolute size-24 justify-center items-center bg-base-200/70 cursor-pointer" @click="vm.onProfileBtn()">
                        <LucideEdit class="size-8 text-primary" />
                    </button>
                </div>
                <div>
                    <h2 class="text-3xl font-semibold">{{ vm.profileName }}</h2>
                </div>
            </div>
        </section>
        <section class="grid grid-cols-[min-content] md:grid-cols-[min-content_min-content] justify-center gap-5">
            <h2 class="text-sm font-semibold -mb-3 uppercase opacity-60 md:col-span-2">
                <Text :target="I18n.PrefControl.sections.theme"/>
            </h2>
            <button
                @click="vm.onAniworldLightThemeBtn"
                data-theme="aniworld-light"
                :data-selected="vm.activeTheme == 'aniworld-light'"
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <h3 class="text-lg font-semibold">
                    <Text :target="I18n.PrefControl.aniworldLight.title"/>
                </h3>

                <p class="mt-1 text-sm text-gray-500">
                    <Text :target="I18n.PrefControl.aniworldLight.description"/>
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
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <h3 class="text-lg font-semibold">
                    <Text :target="I18n.PrefControl.aniworldDark.title"/>
                </h3>

                <p class="mt-1 text-sm text-gray-500">
                    <Text :target="I18n.PrefControl.aniworldDark.description"/>
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
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <h3 class="text-lg font-semibold">
                    <Text :target="I18n.PrefControl.stoLight.title"/>
                </h3>

                <p class="mt-1 text-sm text-gray-500">
                    <Text :target="I18n.PrefControl.stoLight.description"/>
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
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <h3 class="text-lg font-semibold">
                    <Text :target="I18n.PrefControl.stoDark.title"/>
                </h3>

                <p class="mt-1 text-sm text-gray-500">
                    <Text :target="I18n.PrefControl.stoDark.description"/>
                </p>

                <div class="mt-4 flex gap-2">
                    <span class="h-6 w-6 rounded-full bg-primary"></span>
                    <span class="h-6 w-6 rounded-full bg-secondary"></span>
                    <span class="h-6 w-6 rounded-full bg-base-300"></span>
                    <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
                </div>
            </button>
        </section>

        <div class="divider"></div>

        <section class="grid grid-cols-[min-content] md:grid-cols-[min-content_min-content] justify-center gap-5">
            <h2 class="text-sm font-semibold -mb-3 uppercase opacity-60 md:col-span-2">
                <Text :target="I18n.PrefControl.sections.language"/>
            </h2>
            <button
                @click="vm.onEnLocalBtn"
                :data-selected="vm.activeLocal == 'en'"
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <div class="flex items-center gap-4">
                    <span class="text-xl leading-none">EN</span>
                    <div class="flex-1">
                        <h3 class="text-base font-semibold">
                            <Text :target="I18n.PrefControl.languages.en"/>
                        </h3>
                        <p class="mt-0.5 text-sm text-gray-500">
                            <Text :target="I18n.PrefControl.languages.interfaceLanguage"/>
                        </p>
                    </div>
                </div>
            </button>
            <button
                @click="vm.onDeLocalBtn"
                :data-selected="vm.activeLocal == 'de'"
                class="group relative w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                <div class="flex items-center gap-4">
                    <span class="text-xl leading-none">DE</span>
                    <div class="flex-1">
                        <h3 class="text-base font-semibold">
                            <Text :target="I18n.PrefControl.languages.de"/>
                        </h3>
                        <p class="mt-0.5 text-sm text-gray-500">
                            <Text :target="I18n.PrefControl.languages.interfaceLanguage"/>
                        </p>
                    </div>
                </div>
            </button>
        </section>

        <div class="divider"></div>

        <section class="grid grid-cols-[minmax(18rem,37rem)] justify-center gap-5">
            <h2 class="text-sm font-semibold -mb-3 uppercase opacity-60">
                <Text :target="I18n.PrefControl.sections.updater"/>
            </h2>
            <label class="label">
                <input
                    type="checkbox"
                    :checked="vm.updatesActive"
                    class="toggle toggle-primary"
                    @change="vm.onUpdatesActiveToggle()"/>
                <Text :target="I18n.PrefControl.updater.updatesActive"/>
            </label>
            <div>
                <p class="opacity-70 mb-1">
                    <Text :target="I18n.PrefControl.updater.heathDescription"/>
                </p>
                <label class="input w-full">
                    <label class="label">
                        <Text :target="I18n.PrefControl.updater.healthUrl"/>
                    </label>
                    <input type="url" v-model="vm.healthUrl" @change="vm.onHealthUrlChange()"/>
                </label>
            </div>
        </section>

        <div class="divider"></div>

        <section class="grid grid-cols-[minmax(18rem,37rem)] justify-center gap-5">
            <h2 class="text-sm font-semibold -mb-3 uppercase opacity-60">
                <Text :target="I18n.PrefControl.sections.other"/>
            </h2>
            <label class="label">
                <input
                    type="checkbox"
                    :checked="vm.autoSyncCatalog"
                    class="toggle toggle-primary"
                    @change="vm.onAutoSyncCatalogToggle()"/>
                <Text :target="I18n.PrefControl.other.syncCatalog"/>
            </label>
        </section>

        <div class="divider"></div>

        <section class="grid grid-cols-[minmax(18rem,37rem)] justify-center gap-5">
            <button class="btn btn-error btn-soft w-fit ml-auto" @click="vm.onProfileDeleteBtn()">
                <LucideTrash />
                Delete Profile
            </button>
        </section>
    </div>
</template>
