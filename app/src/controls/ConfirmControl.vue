<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ConfirmControlModel} from "@controls/ConfirmControl.model";
import LucideX from "@icons/LucideX.vue";

const vm: ConfirmControlModel = useDialogControl(ConfirmControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-md">
            <form method="dialog" class="flex items-center justify-between" @submit.prevent="vm.closeDialog">
                <h2 class="text-xl font-semibold">{{ vm.title }}</h2>
                <button class="btn btn-ghost btn-square">
                    <LucideX />
                </button>
            </form>
            <p class="opacity-70">{{ vm.description }}</p>
            <div class="join w-full justify-end mt-10">
                <button class="join-item btn btn-error btn-soft" @click="vm.onNoBtn">
                    No
                </button>
                <button class="join-item btn btn-primary btn-soft" @click="vm.onYesBtn">
                    Yes
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.closeDialog">
            <button class="cursor-default">close</button>
        </form>
    </dialog>
</template>

<style scoped>

</style>