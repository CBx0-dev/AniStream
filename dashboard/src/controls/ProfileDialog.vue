<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ProfileDialogModel} from "@controls/ProfileDialog.model";

import LucideX from "@icons/LucideX.vue";
import LucideMonitor from "@icons/LucideMonitor.vue";
import LucideShield from "@icons/LucideShield.vue";

const vm: ProfileDialogModel = useDialogControl(ProfileDialogModel);
</script>

<template>
    <dialog class="modal" :class="{'modal-open': vm.isOpen}">
        <div class="modal-box max-w-xl flex flex-col">
            <div class="flex items-center gap-3 mb-4">
                <h3 class="text-lg font-semibold">{{ vm.title }}</h3>
                <div class="flex-1"></div>
                <button class="btn btn-ghost btn-sm btn-square" @click="vm.closeDialog()">
                    <LucideX class="size-4"/>
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex items-center gap-4">
                    <div class="size-16 grid place-items-center shrink-0 select-none leading-none">
                        <img :src="vm.avatar"/>
                    </div>
                    <label class="form-control flex-1">
                        <span class="label-text text-sm">Name</span>
                        <input v-model="vm.name" type="text" placeholder="Profile name"
                               class="input input-bordered w-full"/>
                    </label>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <label class="form-control">
                        <span class="label-text text-sm">Color</span>
                        <input v-model="vm.backgroundColorModel" type="color"
                               class="input input-bordered w-full h-10 p-1"/>
                    </label>
                    <label class="form-control">
                        <span class="label-text text-sm">Eyes</span>
                        <select v-model="vm.eye" class="select select-bordered w-full">
                            <option v-for="(eye, i) in vm.eyes" :key="eye" :value="eye">Eye {{ i + 1 }}</option>
                        </select>
                    </label>
                    <label class="form-control">
                        <span class="label-text text-sm">Mouth</span>
                        <select v-model="vm.mouth" class="select select-bordered w-full">
                            <option v-for="(mouth, i) in vm.mouths" :key="mouth" :value="mouth">
                                Mouth {{ i + 1 }}
                            </option>
                        </select>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <label class="form-control">
                        <span class="label-text text-sm">Theme</span>
                        <select v-model="vm.theme" class="select select-bordered w-full">
                            <option v-for="[value, name] in vm.themes" :key="value" :value="value">{{ name }}</option>
                        </select>
                    </label>
                    <label class="form-control">
                        <span class="label-text text-sm">Language</span>
                        <select v-model="vm.local" class="select select-bordered w-full">
                            <option v-for="[value, name] in vm.locals" :key="value" :value="value">{{ name }}</option>
                        </select>
                    </label>
                </div>

                <div class="border-t border-base-300 pt-3 space-y-2">
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input v-model="vm.tosAccepted" type="checkbox" class="toggle toggle-sm toggle-primary"/>
                        <span class="text-sm">Terms of service accepted</span>
                    </label>
                </div>
                <div class="border border-base-300 rounded-box p-3 space-y-3 bg-base-200/40">
                    <p class="text-sm font-medium text-base-content/70">Access</p>
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input v-model="vm.dashboardUser" type="checkbox"
                               class="toggle toggle-sm toggle-secondary"/>
                        <LucideShield class="size-4 text-base-content/60"/>
                        <div>
                            <div class="text-sm">Dashboard access</div>
                            <div class="text-xs text-base-content/50">Can sign in to this admin dashboard</div>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input v-model="vm.clientUser" type="checkbox"
                               class="toggle toggle-sm toggle-primary"/>
                        <LucideMonitor class="size-4 text-base-content/60"/>
                        <div>
                            <div class="text-sm">Client access</div>
                            <div class="text-xs text-base-content/50">Can sign in to the streaming client</div>
                        </div>
                    </label>
                </div>
                <div v-if="vm.isCreation">
                    <input v-model="vm.password"
                           type="password"
                           class="input w-full"
                           placeholder="Password"
                           maxlength="6"
                           minlength="6"/>
                </div>
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost"
                        @click="vm.closeDialog()">
                    Cancel
                </button>
                <button class="btn btn-primary"
                        :disabled="vm.name.trim().length == 0 || vm.isCreation && vm.password.length != 6"
                        @click="vm.onSubmitBtn()">
                    Save changes
                </button>
            </div>
        </div>
    </dialog>
</template>

<style scoped>

</style>