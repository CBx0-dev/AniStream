<script setup lang="ts">
import {useTemplateRef} from "vue";
import {useDialogControl} from "vue-mvvm/dialog";

import {PinDialogModel} from "@controls/PinDialog.model";
import Text from "@controls/Text.vue";

import LucideInfo from "@icons/LucideInfo.vue";

import I18n from "@utils/i18n";

const vm: PinDialogModel = useDialogControl(PinDialogModel);
const inputs = useTemplateRef("input");

vm.onFocus.subscribe((index) => {
    if (!inputs.value || inputs.value.length == 0 || index < 0 || index >= vm.pinLength) {
        return;
    }

    inputs.value[index].focus();
    inputs.value[index].select();
});

</script>

<template>
    <dialog class="modal" :open="vm.isOpen">
        <div class="modal-box max-w-2xl space-y-4">
            <h1 class="text-xl text-center">
                <Text :target="I18n.PinDialog.title" />
            </h1>
            <div class="flex justify-center gap-2">
                <input v-for="(_, i) in vm.pinLength"
                       :key="i" ref="input"
                       v-model="vm.pin[i]"
                       type="password"
                       maxlength="1"
                       class="input w-12 h-12 text-center text-xl font-mono"
                       :disabled="vm.isTrying"
                       @input="vm.onInput(i, $event)"
                       @keydown="vm.onKeyDown(i, $event)"
                       @paste="vm.onPaste($event)"/>
            </div>
            <div v-if="vm.failed" class="alert alert-error alert-soft">
                <LucideInfo class="size-5" />
                <Text :target="I18n.PinDialog.wrong" />
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.closeDialog()">
            <button></button>
        </form>
    </dialog>
</template>
