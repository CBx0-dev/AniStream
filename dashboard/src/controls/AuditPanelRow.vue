<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {AuditPanelRowModel} from "@controls/AuditPanelRow.model";

import {type AuditModel, AuditStatus} from "@models/audit.model";

import LucideClock from "@icons/LucideClock.vue";
import LucideCircleX from "@icons/LucideCircleX.vue";
import LucideCircleCheck from "@icons/LucideCircleCheck.vue";

const props = defineProps<{
    model: AuditModel;
}>();

const vm: AuditPanelRowModel = useUserControl(AuditPanelRowModel, props.model);
</script>

<template>
    <tr class="hover:bg-base-200/60">
        <td>
            <div class="font-mono text-sm">#{{ props.model.job_id }}</div>
            <div class="flex gap-1 mt-1">
                <div class="badge badge-sm badge-soft capitalize">
                    {{ vm.kind }}
                </div>
                <div class="badge badge-sm badge-soft">
                    {{ props.model.provider }}
                </div>
            </div>
        </td>
        <td>
            <div class="font-medium text-nowrap">{{ props.model.job_name }}</div>
            <div v-if="vm.expires" class="text-xs text-base-content/50">
                expires {{ vm.expires }}
            </div>
        </td>
        <td>
            <span class="badge badge-sm badge-soft gap-1" :class="vm.statusBadgeClasses">
                <LucideCircleCheck v-if="props.model.status == AuditStatus.Completed" class="size-3"/>
                <LucideCircleX v-else-if="props.model.status == AuditStatus.Failed" class="size-3"/>
                <LucideClock v-else class="size-3"/>
                {{ vm.statusLabel }}
            </span>
        </td>
        <td class="text-sm text-base-content/70">{{ vm.started }}</td>
        <td class="text-sm text-base-content/70">
            <template v-if="vm.completed">
                {{ vm.completed }}
            </template>
            <template v-else>
                &#x2010;
            </template>
        </td>
        <td class="text-sm text-base-content/70">
            <template v-if="vm.duration">
                {{ vm.duration }}
            </template>
            <template v-else>
                &#x2010;
            </template>
        </td>
        <td>
            <button v-if="props.model.error"
                    class="btn btn-ghost btn-xs text-error gap-1"
                    @click="vm.onErrorBtn()">
                <LucideCircleX class="size-3.5"/>
                View error
            </button>
            <span v-else class="text-base-content/30">&#x2013;</span>
        </td>
    </tr>
</template>

<style scoped>

</style>