<script setup lang="ts">
import {useUserControl} from "vue-mvvm";
import {ChangelogControlModel} from "@controls/ChangelogControl.model";

const vm: ChangelogControlModel = useUserControl(ChangelogControlModel);
</script>

<template>
    <div class="flex h-[calc(100vh-300px)] gap-6 relative">
        <div v-if="vm.loading" class="absolute inset-0 flex items-center justify-center bg-base-100/50 z-10">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div class="w-48 shrink-0 overflow-y-auto pr-2 border-r border-base-300">
            <ul class="menu menu-md p-0 gap-1 w-full">
                <li v-for="entry in vm.changelogs" :key="entry.version">
                    <a @click="vm.scrollToVersion(entry.version)"
                       :data-active="vm.activeVersion == entry.version"
                       class="rounded-md data-[active=true]:active">
                        v{{ entry.version }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="grow overflow-y-auto scroll-smooth pr-4 custom-scrollbar" id="changelog-container">
            <div class="pb-10">
                <template v-for="entry in vm.changelogs"
                          :key="entry.version">
                    <section :id="`changelog-${entry.version}`"
                         class="space-y-4"
                         v-html="entry.parsedContent">
                    </section>
                    <div class="divider last:hidden"></div>
                </template>
            </div>
        </div>
    </div>
</template>