<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ToSControlModel} from "@controls/ToSControl.model";
import LucideInfo from "@icons/LucideInfo.vue";
import tos from "@/../ToS.txt?raw";
import disclaimer from "@/../LegalDisclaimer.txt?raw";

const vm: ToSControlModel = useDialogControl(ToSControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-4xl h-2/3">
            <section>
                <h2 class="text-lg font-semibold mb-4 opacity-70 uppercase tracking-wide">
                    Legal Disclaimer
                </h2>
                <div class="p-2 max-h-[350px] overflow-y-auto bg-base-200 border border-base-300 rounded-box">
                    <pre>{{ disclaimer }}</pre>
                </div>
            </section>
            <div class="divider"></div>
            <section>
                <h2 class="text-lg font-semibold mb-4 opacity-70 uppercase tracking-wide">
                    Terms of Service
                </h2>
                <div class="p-2 max-h-[350px] overflow-y-auto bg-base-200 border border-base-300 rounded-box">
                    <pre>{{ tos }}</pre>
                </div>
            </section>
            <section class="my-2">
                <label class="label">
                    <input type="checkbox" class="checkbox checkbox-sm" v-model="vm.acceptedTerms"/>
                    I confirm that I have read and agree to the terms of service.
                </label>
                <div class="flex justify-end gap-4 mt-3">
                    <div role="alert" class="alert alert-error alert-soft py-1" v-show="vm.showError">
                        <LucideInfo/>
                        <span>
                            You have to <strong>accept</strong> the terms of service.
                        </span>
                    </div>
                    <button class="btn btn-primary" @click="vm.onContinueBtn">
                        Continue
                    </button>
                </div>
            </section>
        </div>
    </dialog>
</template>
