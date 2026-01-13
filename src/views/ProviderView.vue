<script setup lang="ts">
import {useViewModel} from "vue-mvvm";
import {ProviderViewModel} from "@views/ProviderView.model";
import LucideSettings from "@icons/LucideSettings.vue";
import I18n from "@utils/i18n";

const vm: ProviderViewModel = useViewModel(ProviderViewModel);
</script>

<template>
    <div class="container m-auto">
        <div class="fixed bottom-5 right-5">
            <button class="btn btn-lg btn-neutral btn-soft btn-square">
                <LucideSettings/>
            </button>
        </div>
        <h1 class="text-3xl text-center">{{ vm.i18n(I18n.ProviderView.title) }}</h1>
        <div class="flex justify-center pt-4">
            <div class="join">
                <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/50"
                     @click="vm.onAniworldBtn">
                    <div class="card-body">
                        <img src="/aniworld-dark.svg" alt="Aniworld" class="w-[250px]"/>
                    </div>
                </div>
                <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/50"
                     @click="vm.onStoBtn">
                    <div class="card-body">
                        <img src="/sto.svg" alt="Sto" class="w-[250px]"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>