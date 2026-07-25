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
import LucideX from "@icons/LucideX.vue";

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
                    <span class="text-primary font-medium">{{ vm.total }}</span> profiles ·
                    <span class="text-secondary">{{ vm.dashboardUsers }}</span> with dashboard access
                </p>
            </div>
            <div class="flex-1"></div>
            <label class="input input-sm input-bordered flex items-center gap-2 w-full sm:w-56">
                <LucideSearch class="size-4 opacity-60"/>
                <input v-model="vm.search" type="search" class="grow" placeholder="Search profiles"/>
            </label>
            <button class="btn btn-primary btn-sm" @click="vm.openCreate()">
                <LucidePlus class="size-4"/>
                New profile
            </button>
        </div>

        <!-- Grid -->
        <div class="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="profile in vm.filtered" :key="profile.id"
                 class="border border-base-300 rounded-box p-4 flex flex-col gap-4 transition-shadow hover:shadow-md">
                <div class="flex items-center gap-3">
                    <div class="rounded-full size-12 grid place-items-center shrink-0 select-none leading-none"
                         :style="{backgroundColor: profile.backgroundColor}">
                        <div class="font-mono text-black/70 text-center">
                            <div class="text-[11px] tracking-widest">{{ profile.eye }} {{ profile.eye }}</div>
                            <div class="text-xs -mt-0.5">{{ profile.mouth }}</div>
                        </div>
                    </div>
                    <div class="min-w-0">
                        <div class="font-semibold truncate">{{ profile.name }}</div>
                        <div class="text-xs text-base-content/40 font-mono truncate">{{ profile.uuid }}</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    <span class="badge badge-sm gap-1"
                          :class="profile.dashboardAccess ? 'badge-secondary' : 'badge-ghost opacity-60'">
                        <LucideShield class="size-3"/> Dashboard
                    </span>
                    <span class="badge badge-sm gap-1"
                          :class="profile.clientAccess ? 'badge-primary' : 'badge-ghost opacity-60'">
                        <LucideMonitor class="size-3"/> Client
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-y-1 text-sm text-base-content/70">
                    <span class="text-base-content/40">Theme</span>
                    <span class="text-right">{{ vm.themeLabel(profile.theme) }}</span>
                    <span class="text-base-content/40">Language</span>
                    <span class="text-right">{{ vm.langLabel(profile.lang) }}</span>
                    <span class="text-base-content/40">Sync catalog</span>
                    <span class="text-right inline-flex justify-end items-center gap-1">
                        <LucideCircleCheck v-if="profile.syncCatalog" class="size-4 text-success"/>
                        <LucideCircleX v-else class="size-4 text-base-content/30"/>
                    </span>
                    <span class="text-base-content/40">ToS accepted</span>
                    <span class="text-right inline-flex justify-end items-center gap-1">
                        <LucideCircleCheck v-if="profile.tosAccepted" class="size-4 text-success"/>
                        <LucideCircleX v-else class="size-4 text-warning"/>
                    </span>
                </div>

                <div class="flex gap-2 mt-auto pt-2 border-t border-base-300">
                    <button class="btn btn-ghost btn-sm flex-1" @click="vm.openEdit(profile)">
                        <LucidePencil class="size-4"/> Edit
                    </button>
                    <button class="btn btn-ghost btn-sm text-error" @click="vm.remove(profile)">
                        <LucideTrash2 class="size-4"/>
                    </button>
                </div>
            </div>

            <div v-if="vm.filtered.length === 0"
                 class="col-span-full flex flex-col items-center gap-2 py-12 text-base-content/50">
                <LucideUsers class="size-8 opacity-40"/>
                <p>No profiles found</p>
            </div>
        </div>

        <!-- Editor modal -->
        <div v-if="vm.editing" class="modal modal-open">
            <div class="modal-box max-w-lg">
                <div class="flex items-center gap-3 mb-4">
                    <h3 class="text-lg font-semibold">{{ vm.isNew ? "Create profile" : "Edit profile" }}</h3>
                    <div class="flex-1"></div>
                    <button class="btn btn-ghost btn-sm btn-circle" @click="vm.closeEditor()">
                        <LucideX class="size-4"/>
                    </button>
                </div>

                <div class="space-y-4">
                    <!-- Avatar + name -->
                    <div class="flex items-center gap-4">
                        <div class="rounded-full size-16 grid place-items-center shrink-0 select-none leading-none"
                             :style="{backgroundColor: vm.editing.backgroundColor}">
                            <div class="font-mono text-black/70 text-center">
                                <div class="text-sm tracking-widest">{{ vm.editing.eye }} {{ vm.editing.eye }}</div>
                                <div class="-mt-1">{{ vm.editing.mouth }}</div>
                            </div>
                        </div>
                        <label class="form-control flex-1">
                            <span class="label-text text-sm">Name</span>
                            <input v-model="vm.editing.name" type="text" placeholder="Profile name"
                                   class="input input-bordered w-full"/>
                        </label>
                    </div>

                    <!-- Avatar options -->
                    <div class="grid grid-cols-3 gap-3">
                        <label class="form-control">
                            <span class="label-text text-sm">Color</span>
                            <input v-model="vm.editing.backgroundColor" type="color"
                                   class="input input-bordered w-full h-10 p-1"/>
                        </label>
                        <label class="form-control">
                            <span class="label-text text-sm">Eyes</span>
                            <select v-model="vm.editing.eye" class="select select-bordered w-full">
                                <option v-for="e in vm.eyeOptions" :key="e" :value="e">{{ e }}</option>
                            </select>
                        </label>
                        <label class="form-control">
                            <span class="label-text text-sm">Mouth</span>
                            <select v-model="vm.editing.mouth" class="select select-bordered w-full">
                                <option v-for="m in vm.mouthOptions" :key="m" :value="m">{{ m }}</option>
                            </select>
                        </label>
                    </div>

                    <!-- Preferences -->
                    <div class="grid grid-cols-2 gap-3">
                        <label class="form-control">
                            <span class="label-text text-sm">Theme</span>
                            <select v-model="vm.editing.theme" class="select select-bordered w-full">
                                <option v-for="t in vm.themeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
                            </select>
                        </label>
                        <label class="form-control">
                            <span class="label-text text-sm">Language</span>
                            <select v-model="vm.editing.lang" class="select select-bordered w-full">
                                <option v-for="l in vm.langOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
                            </select>
                        </label>
                    </div>

                    <div class="border-t border-base-300 pt-3 space-y-2">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="vm.editing.tosAccepted" type="checkbox" class="toggle toggle-sm toggle-primary"/>
                            <span class="text-sm">Terms of service accepted</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="vm.editing.syncCatalog" type="checkbox" class="toggle toggle-sm toggle-primary"/>
                            <span class="text-sm">Sync catalog to this profile</span>
                        </label>
                    </div>

                    <!-- Access flags -->
                    <div class="border border-base-300 rounded-box p-3 space-y-3 bg-base-200/40">
                        <p class="text-sm font-medium text-base-content/70">Access</p>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="vm.editing.dashboardAccess" type="checkbox"
                                   class="toggle toggle-sm toggle-secondary"/>
                            <LucideShield class="size-4 text-base-content/60"/>
                            <div>
                                <div class="text-sm">Dashboard access</div>
                                <div class="text-xs text-base-content/50">Can sign in to this admin dashboard</div>
                            </div>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="vm.editing.clientAccess" type="checkbox"
                                   class="toggle toggle-sm toggle-primary"/>
                            <LucideMonitor class="size-4 text-base-content/60"/>
                            <div>
                                <div class="text-sm">Client access</div>
                                <div class="text-xs text-base-content/50">Can sign in to the streaming client</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn btn-ghost" @click="vm.closeEditor()">Cancel</button>
                    <button class="btn btn-primary" :disabled="vm.editing.name.trim().length === 0" @click="vm.save()">
                        {{ vm.isNew ? "Create" : "Save changes" }}
                    </button>
                </div>
            </div>
            <div class="modal-backdrop bg-black/40" @click="vm.closeEditor()"></div>
        </div>
    </div>
</template>
