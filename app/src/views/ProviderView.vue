<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {ProviderViewModel} from "@views/ProviderView.model";

import LucideSettings from "@icons/LucideSettings.vue";

import I18n from "@utils/i18n";

import Text from "@controls//Text.vue";

const vm: ProviderViewModel = useViewModel(ProviderViewModel);
</script>

<template>
    <div class="relative container flex justify-center items-center h-2/3 m-auto">
        <div class="absolute bottom-5 right-5">
            <button class="btn btn-lg btn-soft btn-square" @click="vm.onSettingsBtn">
                <LucideSettings/>
            </button>
        </div>
        <div class="absolute bottom-5 left-5">
            <button class="btn btn-lg btn-soft btn-square overflow-clip" @click="vm.onProfileBtn()">
                <img v-if="vm.profileImage" :src="vm.profileImage"/>
            </button>
        </div>
        <div>
            <h1 class="text-3xl text-center">
                <Text :target="I18n.ProviderView.title"/>
            </h1>
            <h2 class="text-xl text-center text-base-content/70 mt-2">
                <Text :target="I18n.ProviderView.subtitle"/>
            </h2>
            <div class="grid grid-cols-2 mx-auto gap-4 p-9">
                <button class="card bg-base-100 card-border border-base-300 duration-300 transition-transform hover:bg-primary/50 hover:-translate-y-1/10"
                     @click="vm.onAniworldBtn">
                    <div class="card-body">
                        <img src="/aniworld-dark.svg" alt="Aniworld" class="w-[250px] select-none"/>
                    </div>
                </button>
                <button class="card bg-base-100 card-border border-base-300 duration-300 transition-transform hover:bg-primary/50 hover:-translate-y-1/10"
                     @click="vm.onStoBtn">
                    <div class="card-body">
                        <img src="/sto.svg" alt="Sto" class="w-[250px] select-none"/>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>