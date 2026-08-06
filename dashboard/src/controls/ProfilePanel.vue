<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {ProfilePanelModel} from "@controls/ProfilePanel.model";

import LucideUsers from "@icons/LucideUsers.vue";
import LucideSearch from "@icons/LucideSearch.vue";
import LucidePlus from "@icons/LucidePlus.vue";
import LucidePencil from "@icons/LucidePencil.vue";
import LucideTrash2 from "@icons/LucideTrash2.vue";
import LucideShield from "@icons/LucideShield.vue";
import LucideMonitor from "@icons/LucideMonitor.vue";
import LucideCircleCheck from "@icons/LucideCircleCheck.vue";
import LucideCircleX from "@icons/LucideCircleX.vue";

const vm: ProfilePanelModel = useUserControl(ProfilePanelModel);
</script>

<template>
    <div class="bg-base-100 border border-base-300 rounded-box">
        <!-- Header -->
        <div class="flex flex-wrap items-center gap-4 p-4 border-b border-base-300">
            <div class="bg-base-200 border border-base-300 rounded-box p-3 text-primary">
                <LucideUsers class="size-6"/>
            </div>
            <div>
                <h1 class="text-lg font-semibold leading-tight">User profiles</h1>
                <p class="text-sm text-base-content/60">
                    <span class="text-primary font-medium">{{ vm.total }}</span> profiles
                    <span class="text-secondary">{{ vm.dashboardUsers }}</span> with dashboard access
                </p>
            </div>
            <div class="flex-1"></div>
            <label class="input input-sm input-bordered flex items-center gap-2 w-full sm:w-56">
                <LucideSearch class="size-4 opacity-60"/>
                <input v-model="vm.search" type="search" class="grow" placeholder="Search profiles"/>
            </label>
            <button class="btn btn-primary btn-sm" @click="vm.onCreateBtn()">
                <LucidePlus class="size-4"/>
                New profile
            </button>
        </div>
        <div class="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="profile in vm.filtered"
                 :key="profile.uuid"
                 class="border border-base-300 rounded-box p-4 flex flex-col gap-4 transition-shadow hover:shadow-md">
                <div class="flex items-center gap-3">
                    <div class="size-12 grid place-items-center shrink-0 select-none leading-none">
                        <img :src="vm.getAvatar(profile)"/>
                    </div>
                    <div class="min-w-0">
                        <div class="font-semibold truncate">{{ profile.name }}</div>
                        <div class="text-xs text-base-content/40 font-mono truncate">{{ profile.uuid }}</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    <span class="badge badge-sm badge-soft gap-1"
                          :class="profile.dashboard_user ? 'badge-secondary' : 'badge-ghost opacity-60'">
                        <LucideShield class="size-3"/> Dashboard
                    </span>
                    <span class="badge badge-sm badge-soft gap-1"
                          :class="profile.client_user ? 'badge-primary' : 'badge-ghost opacity-60'">
                        <LucideMonitor class="size-3"/> Client
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-y-1 text-sm text-base-content/70">
                    <span class="text-base-content/40">Theme</span>
                    <span class="text-right">{{ vm.getThemeLabel(profile.theme) }}</span>
                    <span class="text-base-content/40">Language</span>
                    <span class="text-right">{{ vm.getLocalLabel(profile.lang) }}</span>
                    <span class="text-base-content/40">ToS accepted</span>
                    <span class="text-right inline-flex justify-end items-center gap-1">
                        <LucideCircleCheck v-if="profile.tos_accepted" class="size-4 text-success"/>
                        <LucideCircleX v-else class="size-4 text-error"/>
                    </span>
                </div>

                <div class="flex gap-2 mt-auto pt-2 border-t border-base-300">
                    <button class="btn btn-ghost btn-sm flex-1" @click="vm.openEdit(profile)">
                        <LucidePencil class="size-4"/>
                        Edit
                    </button>
                    <button class="btn btn-soft btn-sm btn-square btn-error" @click="vm.onRemoveBtn(profile)">
                        <LucideTrash2 class="size-4"/>
                    </button>
                </div>
            </div>

            <div v-if="vm.filtered.length == 0"
                 class="col-span-full flex flex-col items-center gap-2 py-12 text-base-content/50">
                <LucideUsers class="size-8 opacity-40"/>
                <p>No profiles found</p>
            </div>
        </div>
    </div>
</template>
