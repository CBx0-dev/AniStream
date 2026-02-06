<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ReportControlModel} from "@controls/ReportControl.model";
import I18n from "@/utils/i18n";
import Text from "@controls/Text.vue";

import LucideX from "@icons/LucideX.vue";

const vm: ReportControlModel = useDialogControl(ReportControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-2xl">
            <form method="dialog" class="flex items-center justify-between" @submit.prevent="vm.onCancel">
                <h2 class="text-xl font-semibold">
                    <Text :target="I18n.ReportControl.title"/>
                </h2>
                <button class="btn btn-ghost btn-square">
                    <LucideX />
                </button>
            </form>

            <p class="opacity-70 text-sm">
                <Text :target="I18n.ReportControl.description"/>
            </p>

            <div class="bg-base-200 p-4 mt-4 rounded-lg overflow-auto max-h-60 text-xs font-mono">
                <div class="whitespace-pre-wrap mb-4">{{ vm.title }}</div>
                <div class="mb-4">
                    <Text :target="I18n.ReportControl.environment.version"/>: {{ vm.version }}<br/>
                    <Text :target="I18n.ReportControl.environment.platform"/>: {{ vm.platform }}<br/>
                    <Text :target="I18n.ReportControl.environment.language"/>: {{ vm.lang}}<br/>
                    <Text :target="I18n.ReportControl.environment.theme"/>: {{vm.theme }}<br/>
                </div>
                <div class="whitespace-pre-wrap">
                    {{ vm.errorStack }}
                </div>
            </div>

            <p class="mt-6 mb-2 text-sm opacity-70">
                <Text :target="I18n.ReportControl.additionalInfo"/>
            </p>

            <div>
                <textarea
                    v-model="vm.message"
                    class="textarea textarea-bordered w-full h-24"
                    :placeholder="vm.placeholder">
                </textarea>
            </div>

            <p class="mt-4 text-sm opacity-70">
                <Text :target="I18n.ReportControl.restartNote"/>
            </p>

            <div class="modal-action">
                <button class="btn btn-ghost" @click="vm.onCancel">
                    <Text :target="I18n.ReportControl.actions.cancel"/>
                </button>
                <button class="btn btn-soft btn-primary" @click="vm.onSubmit">
                    <Text :target="I18n.ReportControl.actions.send"/>
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.onCancel">
            <button></button>
        </form>
    </dialog>
</template>

<style scoped>
</style>
