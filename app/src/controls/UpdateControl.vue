<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {UpdateControlModel} from "@controls/UpdateControl.model";

import LucideX from "@icons/LucideX.vue";
import LucideInfo from "@icons/LucideInfo.vue";

import I18n from "@utils/i18n";

import Text from "@controls/Text.vue";

const vm: UpdateControlModel = useDialogControl(UpdateControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-xl">
            <form method="dialog" class="flex items-center justify-between" @submit.prevent="vm.onCancel">
                <h2 class="text-xl font-semibold">
                    <Text :target="I18n.UpdateControl.title"/>
                </h2>
                <button :data-hidde="!vm.isPromptState" class="btn btn-ghost btn-square data-[hidde=true]:invisible">
                    <LucideX/>
                </button>
            </form>

            <div class="mt-4">
                <div class="grid grid-cols-2 gap-4 bg-base-200 p-4 rounded-lg">
                    <div>
                        <p class="text-xs uppercase opacity-50 font-bold tracking-wider">
                            <Text :target="I18n.UpdateControl.version.current"/>
                        </p>
                        <p class="text-lg font-mono">{{ vm.currentVersion }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase opacity-50 font-bold tracking-wider text-primary">
                            <Text :target="I18n.UpdateControl.version.new"/>
                        </p>
                        <p class="text-lg font-mono text-primary">{{ vm.updatingVersion }}</p>
                    </div>
                </div>

                <div class="mt-6 text-sm opacity-80 leading-relaxed">
                    <Text :target="I18n.UpdateControl.description" :args="[vm.currentVersion, vm.updatingVersion]"/>
                </div>

                <div v-if="vm.body" class="mt-6">
                    <p class="text-xs uppercase opacity-50 font-bold tracking-wider mb-2">
                        <Text :target="I18n.UpdateControl.releaseNotes"/>
                    </p>
                    <div class="bg-base-300/50 rounded-lg p-4 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap font-sans border border-base-content/5" v-html="vm.body">
                    </div>
                </div>

                <div class="mt-6 flex items-start gap-3 p-3 bg-info/10 rounded-lg text-info text-xs">
                    <LucideInfo class="w-4 h-4" />
                    <Text :target="I18n.UpdateControl.restartNote"/>
                </div>
            </div>

            <label v-if="vm.isPromptState" class="label mt-8 text-sm cursor-pointer hover:bg-base-200 px-2 rounded-md transition-colors">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" v-model="vm.ignoreThisUpdate"/>
                <span class="label-text ml-2">
                    <Text :target="I18n.UpdateControl.ignore"/>
                </span>
            </label>
            <div v-else-if="vm.isDownloadingState" class="mt-8">
                <progress v-if="vm.total != null" class="progress progress-primary" :value="vm.downloaded" :max="vm.total"/>
                <div v-if="vm.total != null" class="flex justify-between text-[10px] opacity-50 font-mono">
                    <span>{{ (vm.downloaded / 1024 / 1024).toFixed(2) }} MB</span>
                    <span>{{ (vm.total / 1024 / 1024).toFixed(2) }} MB</span>
                </div>
            </div>

            <div v-if="vm.isPromptState" class="modal-action">
                <button class="btn btn-ghost" @click="vm.onCancel">
                    <Text :target="I18n.UpdateControl.cancel"/>
                </button>
                <button class="btn btn-primary px-8" :disabled="vm.ignoreThisUpdate" @click="vm.onStart">
                    <Text :target="I18n.UpdateControl.start"/>
                </button>
            </div>
            <div v-else class="modal-action">
                <button class="btn btn-primary px-8" :disabled="vm.isDownloadingState" @click="vm.onInstallBtn">
                    <Text :target="I18n.UpdateControl.install"/>
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.onCancel">
            <button></button>
        </form>
    </dialog>
</template>
