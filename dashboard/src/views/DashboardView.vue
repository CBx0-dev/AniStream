<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {DashboardTab, DashboardViewModel} from "@views/DashboardView.model";

import UpdatePanel from "@controls/UpdatePanel.vue";
import SyncPanel from "@controls/SyncPanel.vue";
import AuditPanel from "@controls/AuditPanel.vue";
import ProfilePanel from "@controls/ProfilePanel.vue";

import LucideListChecks from "@icons/LucideListChecks.vue";
import LucideUsers from "@icons/LucideUsers.vue";
import LucideLogOut from "@icons/LucideLogOut.vue";

const vm: DashboardViewModel = useViewModel(DashboardViewModel);
</script>

<template>
    <div class="min-h-screen bg-base-200">
        <!-- Navbar -->
        <header class="sticky top-0 z-30 bg-base-100/80 backdrop-blur border-b border-base-300">
            <div class="container mx-auto px-4 h-16 flex items-center gap-3">
                <img src="/128x128.png" class="size-9 rounded-box" alt="AniStream"/>
                <div class="leading-tight">
                    <div class="font-bold">AniStream</div>
                    <div class="text-xs text-base-content/50">Admin Dashboard</div>
                </div>
                <div class="flex-1"></div>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-2">
                        <div class="avatar avatar-placeholder">
                            <div class="bg-primary text-primary-content w-8 rounded-full">
                                <span class="text-xs">AD</span>
                            </div>
                        </div>
                        <span class="hidden sm:inline">Administrator</span>
                    </div>
                    <ul tabindex="0"
                        class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-48 p-2 shadow border border-base-300">
                        <li>
                            <a @click="vm.logout()">
                                <LucideLogOut class="size-4"/>
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <main class="container mx-auto p-4 space-y-4">
            <div>
                <h1 class="text-2xl font-bold">Overview</h1>
                <p class="text-base-content/60">Monitor sync jobs and manage who can access AniStream.</p>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-base-100 border border-base-300 rounded-box p-4">
                    <div class="text-sm text-base-content/60">Total profiles</div>
                    <div class="text-3xl font-bold mt-1 text-primary">{{ vm.totalProfiles }}</div>
                </div>
                <div class="bg-base-100 border border-base-300 rounded-box p-4">
                    <div class="text-sm text-base-content/60">Total series</div>
                    <div class="text-3xl font-bold mt-1 text-info">{{ vm.totalSeries }}</div>
                </div>
                <div class="bg-base-100 border border-base-300 rounded-box p-4">
                    <div class="text-sm text-base-content/60">Total jobs today</div>
                    <div class="text-3xl font-bold mt-1 text-info">{{ vm.dayJobs }}</div>
                </div>
                <div class="bg-base-100 border border-base-300 rounded-box p-4">
                    <div class="text-sm text-base-content/60">Success rate today</div>
                    <div class="text-3xl font-bold mt-1 text-success">{{ vm.successRate }} %</div>
                </div>
            </div>
            <UpdatePanel/>
            <SyncPanel/>
            <div role="tablist" class="tabs tabs-box bg-base-100 border border-base-300 w-fit p-1">
                <a role="tab" class="tab gap-2" :class="{'tab-active': vm.activeTab == DashboardTab.Audit}"
                   @click="vm.activeTab = DashboardTab.Audit">
                    <LucideListChecks class="size-4"/>
                    Audit log
                </a>
                <a role="tab" class="tab gap-2" :class="{'tab-active': vm.activeTab == DashboardTab.Profiles}"
                   @click="vm.activeTab = DashboardTab.Profiles">
                    <LucideUsers class="size-4"/>
                    User profiles
                </a>
            </div>
            <AuditPanel v-show="vm.activeTab == DashboardTab.Audit"/>
            <ProfilePanel v-show="vm.activeTab == DashboardTab.Profiles"/>
        </main>
    </div>
</template>
