<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ReportControlModel} from "@controls/ReportControl.model";

import LucideX from "@icons/LucideX.vue";

const vm: ReportControlModel = useDialogControl(ReportControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-2xl">
            <form method="dialog" class="flex items-center justify-between" @submit.prevent="vm.onCancel">
                <h2 class="text-xl font-semibold">Something went wrong</h2>
                <button class="btn btn-ghost btn-square">
                    <LucideX />
                </button>
            </form>

            <p class="opacity-70 text-sm">
                The application encountered an unexpected error. You can help us improve AniStream by sending a crash report.
                We value your privacy: no personal information is sent, only the technical details shown below.
            </p>

            <div class="bg-base-200 p-4 mt-4 rounded-lg overflow-auto max-h-60 text-xs font-mono">
                <div class="whitespace-pre-wrap mb-4">{{ vm.title }}</div>
                <div class="mb-4">
                    Version: {{ vm.version }}<br/>
                    Platform: {{ vm.platform }}<br/>
                    Language: {{ vm.lang}}<br/>
                    Theme: {{vm.theme }}<br/>
                </div>
                <div class="whitespace-pre-wrap">
                    {{ vm.errorStack }}
                </div>

            </div>

            <p class="mt-6 mb-2 text-sm opacity-70">
                If you have any additional information about what happened, please describe it below (preferably in English):
            </p>

            <div>
                <textarea
                    v-model="vm.message"
                    class="textarea textarea-bordered w-full h-24"
                    placeholder="e.g. What were you doing when the error occurred?">
                </textarea>
            </div>

            <p class="mt-4 text-sm opacity-70">
                Please restart the application to ensure it continues to function correctly, regardless of whether you choose to send this report.
            </p>

            <div class="modal-action">
                <button class="btn btn-ghost" @click="vm.onCancel">Cancel</button>
                <button class="btn btn-primary" @click="vm.onSubmit">Send Report</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.onCancel">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped>
</style>
