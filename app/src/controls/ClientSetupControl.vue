<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {ClientSetupControlModel} from "@controls/ClientSetupControl.model";

import SvgSpinners180RingWithBg from "@icons/SvgSpinners180RingWithBg.vue"
import Text from "@controls/Text.vue";

import I18n from "@utils/i18n";

const vm: ClientSetupControlModel = useUserControl(ClientSetupControlModel);
</script>

<template>
    <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="grid grid-cols-[1.2fr_320px]">
            <div class="p-8 flex flex-col justify-center gap-6">
                <div>
                    <h2 class="text-4xl font-bold">
                        <Text :target="I18n.ClientSetupControl.title"/>
                    </h2>
                    <p class="mt-2 text-base-content/70">
                        <Text :target="I18n.ClientSetupControl.subtitle"/>
                    </p>
                </div>
                <div class="join">
                    <input class="input input-bordered join-item flex-1"
                           placeholder="https://..."
                           v-model="vm.url"/>
                    <button class="btn btn-primary join-item"
                            :disabled="!vm.allowSubmit || vm.isChecking"
                            @click="vm.onSubmitBtn()">
                        <SvgSpinners180RingWithBg v-if="vm.isChecking" />
                        <Text :target="I18n.ClientSetupControl.open"/>
                    </button>
                </div>
                <p class="text-xs text-base-content/60">
                    <Text :target="I18n.ClientSetupControl.setupGuide.pre"/>
                    <a href="https://github.com/CBx0-dev/AniStream" target="_blank" class="link link-primary">
                        <Text :target="I18n.ClientSetupControl.setupGuide.link"/>
                    </a>
                    <Text :target="I18n.ClientSetupControl.setupGuide.post"/>
                </p>
                <div v-if="vm.error" class="alert alert-soft alert-error">
                    {{ vm.error }}
                </div>
            </div>
            <div class="bg-base-200 border-l border-base-300 flex items-center justify-center p-6">
                <img v-if="vm.movieImage"
                     :src="vm.movieImage"
                     class="rounded-xl shadow-2xl max-h-96 object-cover"/>
                <div v-else
                     class="text-center text-base-content/40">
                </div>
            </div>
        </div>
    </div>
</template>
