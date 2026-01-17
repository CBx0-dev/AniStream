<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {PrefControlModel} from "@controls/PrefControl.model";
import I18n from "@utils/i18n";

import Text from "@/controls/Text.vue";

const vm: PrefControlModel = useUserControl(PrefControlModel);
</script>

<template>
    <div class="space-y-6 max-w-2xl mx-auto">
        <section>
            <h2 class="text-lg font-semibold mb-4 opacity-70 uppercase tracking-wide">
                <Text :target="I18n.PrefControl.sections.theme"/>
            </h2>
            <div class="flex flex-wrap gap-5">
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
            </div>
        </section>

        <div class="divider"></div>

        <section>
            <h2 class="text-lg font-semibold mb-4 opacity-70 uppercase tracking-wide">
                <Text :target="I18n.PrefControl.sections.language"/>
            </h2>
            <div class="flex flex-wrap gap-4">
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
            </div>
        </section>
    </div>
</template>
