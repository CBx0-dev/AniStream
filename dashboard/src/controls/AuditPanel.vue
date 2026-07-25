<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {AuditPanelModel} from "@controls/AuditPanel.model";
import AuditPanelRow from "@controls/AuditPanelRow.vue";

import {AuditKind, AuditStatus} from "@models/audit.model";

import LucideSearch from "@icons/LucideSearch.vue";
import LucideRefreshCw from "@icons/LucideRefreshCw.vue";
import LucideListChecks from "@icons/LucideListChecks.vue";
import LucideChevronLeft from "@icons/LucideChevronLeft.vue";
import LucideChevronRight from "@icons/LucideChevronRight.vue";
import LucideChevronsLeft from "@icons/LucideChevronsLeft.vue";
import LucideChevronsRight from "@icons/LucideChevronsRight.vue";

const vm: AuditPanelModel = useUserControl(AuditPanelModel);
</script>

<template>
    <div class="bg-base-100 border border-base-300 rounded-box">
        <div class="flex flex-wrap items-center gap-4 p-4 border-b border-base-300">
            <div class="bg-base-200 border border-base-300 rounded-box p-3 text-primary">
                <LucideListChecks class="size-6"/>
            </div>
            <div>
                <h1 class="text-lg font-semibold leading-tight">Audit log</h1>
                <p class="text-sm text-base-content/60">
                    <span class="text-primary font-medium">{{ vm.total }}</span> total
                    <span class="text-info">{{ vm.running }}</span> running
                    <span class="text-info">{{ vm.queued }}</span> queued
                    <span class="text-error">{{ vm.failed }}</span> failed
                    <span class="text-success">{{ vm.completed }}</span> completed
                </p>
            </div>
            <div class="flex-1"></div>
            <button class="btn btn-ghost"
                    :disabled="vm.refreshing"
                    @click="vm.onRefreshBtn()">
                <LucideRefreshCw class="size-4"/>
                Refresh
            </button>
        </div>

        <div class="flex flex-wrap items-center gap-3 p-4">
            <label class="input input-sm input-bordered flex items-center gap-2 w-full sm:w-72">
                <LucideSearch class="size-4 opacity-60"/>
                <input v-model="vm.search"
                       type="search"
                       class="grow"
                       placeholder="Search..."/>
            </label>

            <div role="tablist" class="tabs tabs-box tabs-sm bg-base-200 p-1">
                <a role="tab"
                   class="tab"
                   :class="{'tab-active': vm.kindFilter == -1}"
                   @click="vm.kindFilter = -1">
                    All
                </a>
                <a role="tab"
                   class="tab"
                   :class="{'tab-active': vm.kindFilter == AuditKind.Series}"
                   @click="vm.kindFilter = AuditKind.Series">
                    Series
                </a>
                <a role="tab"
                   class="tab"
                   :class="{'tab-active': vm.kindFilter == AuditKind.Provider}"
                   @click="vm.kindFilter = AuditKind.Provider">
                    Provider
                </a>
            </div>

            <select v-model="vm.statusFilter" class="select select-sm select-bordered">
                <option :value="-1">All statuses</option>
                <option :value="AuditStatus.Queued">Queued</option>
                <option :value="AuditStatus.Processing">Running</option>
                <option :value="AuditStatus.Completed">Completed</option>
                <option :value="AuditStatus.Failed">Failed</option>
            </select>

            <div class="flex-1"></div>
            <span class="text-sm text-base-content/50">{{ vm.filtered.length }} shown</span>
        </div>

        <div class="overflow-x-auto">
            <table class="table table-zebra">
                <thead>
                <tr>
                    <th>Job</th>
                    <th>Target</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Finished</th>
                    <th>Duration</th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                <AuditPanelRow v-for="item of vm.paged"
                               :key="`${item.kind}-${item.provider}-${item.job_id}`"
                               :model="item"/>
                <tr v-if="vm.filtered.length == 0">
                    <td colspan="7">
                        <div class="flex flex-col items-center gap-2 py-12 text-base-content/50">
                            <LucideSearch class="size-8 opacity-40"/>
                            <p>No jobs match your filters</p>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-if="vm.filtered.length > 0"
             class="flex flex-wrap items-center gap-3 p-4 border-t border-base-300">
            <span class="text-sm text-base-content/50">
                Showing {{ vm.rangeStart }} - {{ vm.rangeEnd }} of {{ vm.filtered.length }}
            </span>
            <div class="flex-1"></div>
            <div class="join">
                <button class="join-item btn btn-sm"
                        :disabled="vm.page <= 1"
                        @click="vm.onFirstPageBtn()">
                    <LucideChevronsLeft class="size-4"/>
                </button>
                <button class="join-item btn btn-sm"
                        :disabled="vm.page <= 1"
                        @click="vm.onPrevPageBtn()">
                    <LucideChevronLeft class="size-4"/>
                </button>
                <button v-for="p in vm.pageCount" :key="p"
                        class="join-item btn btn-sm"
                        :class="{'btn-active btn-primary': p == vm.page}"
                        @click="vm.onPageBtn(p)">
                    {{ p }}
                </button>
                <button class="join-item btn btn-sm"
                        :disabled="vm.page >= vm.pageCount"
                        @click="vm.onNextPageBtn()">
                    <LucideChevronRight class="size-4"/>
                </button>
                <button class="join-item btn btn-sm"
                        :disabled="vm.page >= vm.pageCount"
                        @click="vm.onLastPageBtn()">
                    <LucideChevronsRight class="size-4"/>
                </button>
            </div>
        </div>
    </div>
</template>
