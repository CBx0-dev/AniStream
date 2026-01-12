<script setup lang="ts">
import {useDialogControl} from 'vue-mvvm/dialog';
import {DetailControlModel} from './DetailControl.model';
import LucideX from '@/icons/LucideX.vue';
import LucidePlay from '@/icons/LucidePlay.vue';
import LucideTimerReset from '@/icons/LucideTimerReset.vue';


const vm: DetailControlModel = useDialogControl(DetailControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-4xl">
            <form method="dialog" class="flex justify-end" @submit.prevent="vm.closeDialog">
                <button class="btn btn-ghost btn-square">
                    <LucideX/>
                </button>
            </form>
            <div class="flex gap-3">
                <div class="shrink-0 w-[250px] h-[350px] bg-base-100 border border-base-300 rounded-sm">

                </div>
                <div class="grow flex flex-col gap-2">
                    <div class="shrink-0">
                        <h1 class="text-2xl font-semibold">The Title</h1>
                    </div>
                    <div class="grow overflow-y-auto">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, error distinctio?
                            Et, voluptate! Facere, doloribus tenetur commodi doloremque, dolorem eligendi inventore
                            obcaecati illo ipsum enim cum saepe, at odio aspernatur.
                        </p>
                    </div>
                    <div class="shrink-0 join justify-end">
                        <button class="join-item btn btn-neutral btn-soft">
                            <LucideTimerReset/>
                            Reset progression
                        </button>
                        <button class="join-item btn btn-primary btn-soft">
                            <LucidePlay/>
                            Watch
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.closeDialog">
            <button>close</button>
        </form>
    </dialog>
</template>