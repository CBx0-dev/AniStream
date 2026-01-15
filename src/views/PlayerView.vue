<script setup lang="ts">
import { useViewModel } from 'vue-mvvm';
import { PlayerViewModel } from '@views/PlayerView.model';

const vm: PlayerViewModel = useViewModel(PlayerViewModel);
</script>

<template>
    <div class="pt-5 px-5 pb-2">
        Back
    </div>
    <div class="px-5 pb-5 grow flex gap-3">
        <div class="grow flex flex-col gap-3">
            <div class="aspect-video card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Video
                </div>
            </div>
            <div class="flex justify-between">
                <button class="btn btn-soft">
                    WASD
                </button>
                <button class="btn btn-soft">
                    WASD
                </button>
            </div>
            <div class="grow card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Description
                </div>
            </div>
        </div>
        <div class="shrink-0 flex flex-col gap-3">
            <div class="shrink-0 card bg-base-100 card-border border-base-300">
                <div class="card-body">
                    Providers
                </div>
            </div>
            <div class="grow card bg-base-100 card-border border-base-300">
                <div class="card-body overflow-y-auto">
                    Episodes
                </div>
            </div>
        </div>
    </div>
</template>