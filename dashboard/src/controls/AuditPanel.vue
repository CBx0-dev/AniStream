<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {AuditPanelModel, JobStatus} from "@controls/AuditPanel.model";

import LucideSearch from "@icons/LucideSearch.vue";
import LucideRefreshCw from "@icons/LucideRefreshCw.vue";
import LucideListChecks from "@icons/LucideListChecks.vue";
import LucideCircleCheck from "@icons/LucideCircleCheck.vue";
import LucideCircleX from "@icons/LucideCircleX.vue";
import LucideClock from "@icons/LucideClock.vue";
import LucideChevronLeft from "@icons/LucideChevronLeft.vue";
import LucideChevronRight from "@icons/LucideChevronRight.vue";
import LucideCopy from "@icons/LucideCopy.vue";
import LucideX from "@icons/LucideX.vue";

const vm: AuditPanelModel = useUserControl(AuditPanelModel);
</script>

<template>
    <div class="bg-base-100 border border-base-300 rounded-box">
        <!-- Header -->
        <div class="flex flex-wrap items-center gap-4 p-4 border-b border-base-300">
            <div class="bg-base-200 border border-base-300 rounded-box p-3 text-primary">
                <LucideListChecks class="size-6"/>
            </div>
            <div>
                <h1 class="text-lg font-semibold leading-tight">Audit log</h1>
                <p class="text-sm text-base-content/60">
                    <span class="text-primary font-medium">{{ vm.stats.total }}</span> jobs ·
                    <span class="text-info">{{ vm.stats.running }}</span> running ·
                    <span class="text-error">{{ vm.stats.failed }}</span> failed
                </p>
            </div>
            <div class="flex-1"></div>
            <button class="btn btn-ghost btn-sm" :disabled="vm.refreshing" @click="vm.refresh()">
                <LucideRefreshCw class="size-4" :class="{'animate-spin': vm.refreshing}"/>
                Refresh
            </button>
        </div>

        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3 p-4">
            <label class="input input-sm input-bordered flex items-center gap-2 w-full sm:w-72">
                <LucideSearch class="size-4 opacity-60"/>
                <input v-model="vm.search" type="search" class="grow" placeholder="Search by target or job ID"/>
            </label>

            <div role="tablist" class="tabs tabs-box tabs-sm bg-base-200 p-1">
                <a role="tab" class="tab" :class="{'tab-active': vm.kindFilter === 'all'}"
                   @click="vm.setKindFilter('all')">All</a>
                <a role="tab" class="tab" :class="{'tab-active': vm.kindFilter === 'series'}"
                   @click="vm.setKindFilter('series')">Series</a>
                <a role="tab" class="tab" :class="{'tab-active': vm.kindFilter === 'provider'}"
                   @click="vm.setKindFilter('provider')">Provider</a>
            </div>

            <select v-model="vm.statusFilter" class="select select-sm select-bordered">
                <option :value="'all'">All statuses</option>
                <option :value="JobStatus.Pending">Pending</option>
                <option :value="JobStatus.Running">Running</option>
                <option :value="JobStatus.Completed">Completed</option>
                <option :value="JobStatus.Failed">Failed</option>
            </select>

            <div class="flex-1"></div>
            <span class="text-sm text-base-content/50">{{ vm.filtered.length }} shown</span>
        </div>

        <!-- Table -->
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
                <tr v-for="job in vm.paged" :key="job.kind + '-' + job.id" class="hover:bg-base-200/60">
                    <td>
                        <div class="font-mono text-sm">#{{ job.id }}</div>
                        <div class="badge badge-sm badge-ghost mt-1 capitalize">{{ job.kind }}</div>
                    </td>
                    <td>
                        <div class="font-medium">{{ job.target }}</div>
                        <div v-if="job.expires" class="text-xs text-base-content/50">
                            expires {{ vm.formatDateTime(job.expires) }}
                        </div>
                    </td>
                    <td>
                        <span class="badge badge-sm gap-1" :class="vm.statusBadgeClass(job.status)">
                            <LucideCircleCheck v-if="job.status === JobStatus.Completed" class="size-3"/>
                            <LucideCircleX v-else-if="job.status === JobStatus.Failed" class="size-3"/>
                            <LucideClock v-else class="size-3"/>
                            {{ vm.statusLabel(job.status) }}
                        </span>
                    </td>
                    <td class="text-sm text-base-content/70">{{ vm.formatDateTime(job.started) }}</td>
                    <td class="text-sm text-base-content/70">{{ vm.formatDateTime(job.completed) }}</td>
                    <td class="text-sm text-base-content/70">{{ vm.duration(job) }}</td>
                    <td>
                        <button v-if="job.status === JobStatus.Failed && job.error"
                                class="btn btn-ghost btn-xs text-error gap-1"
                                @click="vm.openError(job)">
                            <LucideCircleX class="size-3.5"/>
                            View error
                        </button>
                        <span v-else class="text-base-content/30">—</span>
                    </td>
                </tr>
                <tr v-if="vm.filtered.length === 0">
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

        <!-- Pagination -->
        <div v-if="vm.filtered.length > 0"
             class="flex flex-wrap items-center gap-3 p-4 border-t border-base-300">
            <span class="text-sm text-base-content/50">
                Showing {{ vm.rangeStart }}–{{ vm.rangeEnd }} of {{ vm.filtered.length }}
            </span>
            <div class="flex-1"></div>
            <div class="join">
                <button class="join-item btn btn-sm" :disabled="vm.page <= 1" @click="vm.prevPage()">
                    <LucideChevronLeft class="size-4"/>
                </button>
                <button v-for="p in vm.pageCount" :key="p"
                        class="join-item btn btn-sm"
                        :class="{'btn-active btn-primary': p === vm.page}"
                        @click="vm.goToPage(p)">
                    {{ p }}
                </button>
                <button class="join-item btn btn-sm" :disabled="vm.page >= vm.pageCount" @click="vm.nextPage()">
                    <LucideChevronRight class="size-4"/>
                </button>
            </div>
        </div>

        <!-- Error dialog -->
        <div v-if="vm.errorJob" class="modal modal-open">
            <div class="modal-box max-w-3xl flex flex-col max-h-[85vh]">
                <div class="flex items-start gap-3 mb-3">
                    <div class="bg-error/10 text-error rounded-box p-2 mt-0.5">
                        <LucideCircleX class="size-5"/>
                    </div>
                    <div class="min-w-0">
                        <h3 class="text-lg font-semibold leading-tight">Job failed</h3>
                        <p class="text-sm text-base-content/60 truncate">
                            <span class="font-mono">#{{ vm.errorJob.id }}</span> · {{ vm.errorJob.target }}
                        </p>
                    </div>
                    <div class="flex-1"></div>
                    <button class="btn btn-ghost btn-sm btn-circle" @click="vm.closeError()">
                        <LucideX class="size-4"/>
                    </button>
                </div>

                <pre class="flex-1 overflow-auto bg-base-200 border border-base-300 rounded-box p-4
                            text-xs leading-relaxed font-mono whitespace-pre-wrap break-words">{{ vm.errorJob.error }}</pre>

                <div class="modal-action">
                    <button class="btn btn-ghost btn-sm gap-2" @click="vm.copyError()">
                        <LucideCircleCheck v-if="vm.copied" class="size-4 text-success"/>
                        <LucideCopy v-else class="size-4"/>
                        {{ vm.copied ? "Copied" : "Copy" }}
                    </button>
                    <button class="btn btn-sm" @click="vm.closeError()">Close</button>
                </div>
            </div>
            <div class="modal-backdrop bg-black/40" @click="vm.closeError()"></div>
        </div>
    </div>
</template>
