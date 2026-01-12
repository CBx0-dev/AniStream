<script setup lang="ts">
import { useViewModel } from "vue-mvvm";
import { StreamsViewModel } from './StreamsView.model';
import LucideSearch from "@icons/LucideSearch.vue";
import LucideArrowLeft from "@/icons/LucideArrowLeft.vue";
import LucideListVideo from "@/icons/LucideListVideo.vue";
import LucideCloudSync from "@/icons/LucideCloudSync.vue";

const vm: StreamsViewModel = useViewModel(StreamsViewModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between w-full">
                    <button class="btn btn-link btn-neutral hover:text-primary cursor-default" @click="vm.onBackBtn">
                        <LucideArrowLeft />
                        Back to providers
                    </button>
                    <div class="join">
                        <button class="join-item btn btn-neutral btn-soft">
                            <LucideCloudSync />
                            Sync streams
                        </button>
                        <button class="join-item btn btn-neutral btn-soft">
                            <LucideListVideo />
                            Watchlist
                        </button>
                    </div>
                </div>
                <label class="input w-full">
                    <LucideSearch />
                    <input type="text" class="grow" placeholder="Search" />
                </label>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,250px)] justify-center gap-3 py-6">
            <div v-for="i of 10"
                :key="i"
                class="w-[250px] h-[350px] bg-base-100 border border-base-300 rounded-sm hover:scale-110 hover:shadow-sm duration-300">
            </div>
        </div>
        <div class="text-center text-gray-400" id="line">
            Nothing to show
        </div>
    </div>
</template>