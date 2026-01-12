<script setup lang="ts">
import { useViewModel } from "vue-mvvm";
import { ProviderViewModel } from "./ProviderView.model";

const vm: ProviderViewModel = useViewModel(ProviderViewModel);
</script>

<template>
    <div class="container m-auto">
        <div class="fixed top-5 right-5">
            <button class="btn btn-primary btn-soft btn-square">
                X
            </button>
        </div>
        <h1 class="text-3xl text-center">Select provider</h1>
        <div class="flex justify-center pt-4">
            <div class="join">
                <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/20" @click="vm.onAniworldBtn">
                    <div class="card-body">
                        Aniworld
                    </div>
                </div>
                <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/20" @click="vm.onStoBtn">
                    <div class="card-body">
                        Sto
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>