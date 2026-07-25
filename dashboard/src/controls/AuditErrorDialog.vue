<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {AuditErrorDialogModel} from "@controls/AuditErrorDialog.model";

import LucideCircleX from "@icons/LucideCircleX.vue";
import LucideCircleCheck from "@icons/LucideCircleCheck.vue";
import LucideX from "@icons/LucideX.vue";
import LucideCopy from "@icons/LucideCopy.vue";

const vm: AuditErrorDialogModel = useDialogControl(AuditErrorDialogModel);
</script>

<template>
    <dialog class="modal" :class="{'modal-open': vm.isOpen}">
        <div class="modal-box max-w-3xl flex flex-col max-h-[85vh]">
            <div class="flex items-start gap-3 mb-3">
                <div class="bg-error/10 text-error rounded-box p-2 mt-0.5">
                    <LucideCircleX class="size-5"/>
                </div>
                <div class="min-w-0">
                    <h3 class="text-lg font-semibold leading-tight">Job failed</h3>
                    <p class="text-sm text-base-content/60 truncate">
                        <span class="font-mono">#{{ vm.id }}</span> {{ vm.title }}
                    </p>
                </div>
                <div class="flex-1"></div>
                <button class="btn btn-ghost btn-square" @click="vm.closeDialog()">
                    <LucideX class="size-4"/>
                </button>
            </div>

            <pre
                class="flex-1 overflow-auto bg-base-200 border border-base-300 rounded-box p-4 text-xs leading-relaxed font-mono whitespace-pre-wrap wrap-break-word">
{{ vm.error }}
            </pre>

            <div class="modal-action">
                <button class="btn btn-ghost gap-2" @click="vm.onCopyErrorBtn()">
                    <LucideCircleCheck v-if="vm.copied" class="size-4 text-success"/>
                    <LucideCopy v-else class="size-4"/>
                    {{ vm.copied ? "Copied" : "Copy" }}
                </button>
                <button class="btn" @click="vm.closeDialog()">Close</button>
            </div>
        </div>
    </dialog>
</template>

<style scoped>

</style>