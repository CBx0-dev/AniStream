<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {AuditPanelModel} from "@controls/AuditPanel.model";

const vm: AuditPanelModel = useUserControl(AuditPanelModel);
</script>

<template>
    <div class="bg-base-100 border border-base-300 rounded-box p-4">
        <div class="flex gap-5">
            <div>
                <h1 class="text-lg">Audit log</h1>
                <p class="text-sm">
                    <span class="text-primary">1420</span> jobs processed
                </p>
            </div>
            <div class="flex-1"></div>
            <div>

            </div>
        </div>
        <div class="overflow-auto">
            <table class="w-full">
                <thead>
                <tr>
                    <td>Job ID</td>
                    <td>Name</td>
                    <td>Triggered</td>
                    <td>Status</td>
                </tr>
                </thead>
                <tbody>

                </tbody>
                <tfoot>
                    
                </tfoot>
            </table>
        </div>
    </div>
</template>
