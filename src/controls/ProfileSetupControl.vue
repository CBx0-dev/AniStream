<script setup lang="ts">
import {useUserControl} from "vue-mvvm";
import {ProfileSetupControlModel} from "@controls/ProfileSetupControl.model";

import I18n from "@utils/i18n";

import Text from "@controls/Text.vue";
import ColorPicker from "@controls/ColorPicker.vue";

const vm: ProfileSetupControlModel = useUserControl(ProfileSetupControlModel);
</script>

<template>
    <div class="container mx-auto p-8 bg-base-100 rounded-box shadow-sm border border-base-300">
        <h2 class="text-3xl font-bold mb-8 text-center">Create Your Profile</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="flex flex-col items-center gap-6">
                <div class="avatar">
                    <div
                        class="w-48 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden bg-base-200">
                        <img :src="vm.avatarSvg" alt="Avatar Preview"/>
                    </div>
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        Profile Name
                    </label>
                    <input type="text" v-model="vm.name" placeholder="Enter your name"
                           class="input input-bordered w-full focus:input-primary"/>
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        Background Color
                    </label>
                    <ColorPicker :initial-color="vm.backgroundColor" @update:color="(color: string) => vm.backgroundColor = color" />
                </div>
            </div>
            <div class="lg:col-span-2 space-y-8">
                <div>
                    <h2 class="text-sm font-semibold mb-5 opacity-70 uppercase tracking-widest flex items-center gap-2">
                        <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Eyes
                    </h2>
                    <div class="flex overflow-x-auto gap-4 py-2 px-1 no-scrollbar">
                        <button v-for="eye in ProfileSetupControlModel.EYES"
                                :key="eye"
                                :data-selected="vm.eye == eye"
                                class="w-20 h-20 aspect-square overflow-clip rounded-xl border border-base-300 bg-base-100 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
                                @click="vm.onEyeItem(eye)">
                            <img :src="vm.getAvatarWithEye(eye)" :alt="eye" class="w-full h-full"/>
                        </button>
                    </div>
                </div>
                <div>
                    <h2 class="text-sm font-semibold mb-5 opacity-70 uppercase tracking-widest flex items-center gap-2">
                        <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Mouth
                    </h2>
                    <div class="flex overflow-x-auto gap-4 py-2 px-1 no-scrollbar">
                        <button v-for="mouth in ProfileSetupControlModel.MOUTHS"
                                :key="mouth"
                                :data-selected="vm.mouth == mouth"
                                class="w-20 h-20 aspect-square overflow-clip rounded-xl border border-base-300 bg-base-100 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
                                @click="vm.onMouthItem(mouth)">
                            <img :src="vm.getAvatarWithMouth(mouth)" :alt="mouth" class="w-full h-full"/>
                        </button>
                    </div>
                </div>

                <div class="space-y-10">
                    <section>
                        <h2 class="text-sm font-semibold mb-5 opacity-70 uppercase tracking-widest flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            <Text :target="I18n.PrefControl.sections.theme"/>
                        </h2>
                        <div class="grid grid-cols-[minmax(auto,288px)_minmax(auto,288px)] w-full gap-4">
                            <button
                                @click="vm.onAniworldLightThemeBtn"
                                data-theme="aniworld-light"
                                :data-selected="vm.theme == 'aniworld-light'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <h3 class="text-lg font-semibold">
                                    <Text :target="I18n.PrefControl.aniworldLight.title"/>
                                </h3>

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
                                :data-selected="vm.theme == 'aniworld-dark'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <h3 class="text-lg font-semibold">
                                    <Text :target="I18n.PrefControl.aniworldDark.title"/>
                                </h3>

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
                                :data-selected="vm.theme == 'sto-light'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <h3 class="text-lg font-semibold">
                                    <Text :target="I18n.PrefControl.stoLight.title"/>
                                </h3>

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
                                :data-selected="vm.theme == 'sto-dark'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <h3 class="text-lg font-semibold">
                                    <Text :target="I18n.PrefControl.stoDark.title"/>
                                </h3>

                                <div class="mt-4 flex gap-2">
                                    <span class="h-6 w-6 rounded-full bg-primary"></span>
                                    <span class="h-6 w-6 rounded-full bg-secondary"></span>
                                    <span class="h-6 w-6 rounded-full bg-base-300"></span>
                                    <span class="h-6 w-6 rounded-full bg-base-100 border border-base-300"></span>
                                </div>
                            </button>
                        </div>
                    </section>
                    <section>
                        <h2 class="text-sm font-semibold mb-5 opacity-70 uppercase tracking-widest flex items-center gap-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            <Text :target="I18n.PrefControl.sections.language"/>
                        </h2>
                        <div class="grid grid-cols-[minmax(auto,288px)_minmax(auto,288px)] w-full gap-4">
                            <button
                                @click="vm.onEnLocalBtn"
                                :data-selected="vm.local == 'en'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <div class="flex items-center gap-4">
                                    <span class="text-xl leading-none">EN</span>
                                    <div class="flex-1">
                                        <h3 class="text-base font-semibold">
                                            <Text :target="I18n.PrefControl.languages.en"/>
                                        </h3>
                                    </div>
                                </div>
                            </button>

                            <button
                                @click="vm.onDeLocalBtn"
                                :data-selected="vm.local == 'de'"
                                class="relative w-full max-w-72 rounded-box border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary">
                                <div class="flex items-center gap-4">
                                    <span class="text-xl leading-none">DE</span>
                                    <div class="flex-1">
                                        <h3 class="text-base font-semibold">
                                            <Text :target="I18n.PrefControl.languages.de"/>
                                        </h3>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-end gap-6 pt-8">
            <div class="flex gap-4 w-full md:w-auto">
                <button class="btn btn-ghost flex-1 md:flex-none">Cancel</button>
                <button class="btn btn-primary px-12 flex-1 md:flex-none" :disabled="!vm.name"
                        @click="vm.onCreateProfileBtn()">
                    Create Profile
                </button>
            </div>
        </div>
    </div>
</template>