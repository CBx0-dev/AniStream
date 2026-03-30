<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {ProfileViewModel} from "@views/ProfileView.model";

import LucidePlus from "@icons/LucidePlus.vue";

import ProfileSetupControl from "@controls/ProfileSetupControl.vue";

const vm: ProfileViewModel = useViewModel(ProfileViewModel);
</script>

<template>
    <div v-if="vm.showProfileSetupForm">
        <ProfileSetupControl />
    </div>
    <div v-else class="container flex justify-center items-center h-2/3 m-auto gap-4">
        <button v-for="profile of vm.profiles" :key="profile.profile_id" class="group flex flex-col items-center gap-2 focus:outline-none">
            <div class="relative rounded-box border border-base-300 bg-base-100 transition hover:border-primary group-focus:border-primary group-focus:ring-2 group-focus:ring-primary overflow-clip">
                <img :src="vm.getProfilePicture(profile)"
                     :alt="profile.name"
                     class="w-24 h-24 select-none"/>
            </div>
            <span class="text-sm font-medium text-gray-600 group-hover:text-primary">
                {{ profile.name }}
            </span>
        </button>
        <button class="group flex flex-col items-center gap-2 focus:outline-none" @click="vm.onNewProfileBtn()">
            <div class="relative rounded-box border border-base-300 bg-base-100 transition hover:border-primary group-focus:border-primary group-focus:ring-2 group-focus:ring-primary overflow-clip">
                <div class="w-24 h-24 inline-flex justify-center items-center">
                    <LucidePlus class="select-none m-auto size-8" />
                </div>
            </div>
            <span class="text-sm font-medium text-gray-600 group-hover:text-primary">
                New Profile
            </span>
        </button>
    </div>
</template>