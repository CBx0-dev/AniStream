<script setup lang="ts">
import { useViewModel } from "vue-mvvm";
import { ProviderViewModel } from "./ProviderView.model";

const vm: ProviderViewModel = useViewModel(ProviderViewModel);
</script>

<template>
    <div class="container m-auto">
        <h1></h1>
        <div class="join mx-auto">
            <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/20">
                <div class="card-body">
                </div>
            </div>
            <div class="join-item card bg-base-100 card-border border-base-300 hover:bg-primary/20">
                <div class="card-body">
                </div>
            </div>
        </div>
    </div>
</template>