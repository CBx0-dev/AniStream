<script setup lang="ts">
import {useTemplateRef} from "vue";
import {useViewModel} from "vue-mvvm";

import {LoginViewModel} from "@views/LoginView.model";

import SvgSpinners180RingWithBg from "@icons/SvgSpinners180RingWithBg.vue";
import LucideCircleAlert from "@icons/LucideCircleAlert.vue";

const vm: LoginViewModel = useViewModel(LoginViewModel);
const inputs = useTemplateRef("inputs");

vm.onFocus.subscribe((index: number) => {
    if (!inputs.value || inputs.value.length == 0 || index < 0 || index >= vm.pinLength) {
        return;
    }

    inputs.value[index].focus();
    inputs.value[index].select();
});
</script>

<template>
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div class="card bg-base-100 shadow-sm w-full max-w-md">
            <div class="card-body">
                <div class="avatar justify-center">
                    <div class="bg-base-200 border border-base-300 p-3 rounded-full">
                        <img src="/128x128.png" class="w-20"/>
                    </div>
                </div>
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold">Sign In</h1>
                    <p class="text-base-content/70 mt-2">
                        {{ vm.title }}
                    </p>
                </div>
                <div v-if="vm.step == 0" class="space-y-5">
                    <div class="form-control">
                        <input
                            v-model="vm.username"
                            type="text"
                            placeholder="Username"
                            class="input input-bordered input-lg w-full"
                            autofocus/>
                    </div>

                    <button
                        class="btn btn-primary btn-lg w-full"
                        :disabled="!vm.username"
                        @click="vm.onUsernameSubmitBtn()">
                        Continue
                    </button>
                </div>
                <div v-else class="space-y-6">
                    <div class="text-center">
                        <div class="font-medium">{{ vm.username }}</div>
                        <button
                            class="btn btn-link btn-xs"
                            @click="vm.step = 0">
                            Change username
                        </button>
                    </div>
                    <div class="flex justify-center gap-2">
                        <input
                            v-for="(_, index) in vm.pinLength"
                            :key="index"
                            ref="inputs"
                            type="password"
                            :disabled="vm.isTrying"
                            class="input w-12 h-12 text-center text-xl font-mono"
                            v-model="vm.pin[index]"
                            @input="vm.onPinInput(index, $event)"
                            @keydown="vm.onPinKeyDown(index, $event)"
                            @paste="vm.onPinPaste($event)"/>
                    </div>
                    <button
                        class="btn btn-primary btn-lg w-full"
                        :disabled="vm.isTrying || vm.pin.length < 6"
                        @click="vm.onFullPinInput()">
                        <SvgSpinners180RingWithBg v-if="vm.isTrying" />
                        Sign In
                    </button>
                    <div v-if="vm.error" class="alert alert-error alert-soft">
                        <LucideCircleAlert />
                        {{ vm.error }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>