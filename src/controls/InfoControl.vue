<script setup lang="ts">
import {useUserControl} from "vue-mvvm";
import {InfoControlModel} from "@controls/InfoControl.model";
import I18n from "@/utils/i18n";
import Text from "@controls/Text.vue";

const vm: InfoControlModel = useUserControl(InfoControlModel);
</script>

<template>
    <div class="space-y-6 max-w-2xl mx-auto">
        <div class="flex items-center gap-4">
            <div class="avatar placeholder">
                <div class="rounded-lg w-14">
                    <img src="/128x128.png" alt="AS"/>
                </div>
            </div>

            <div>
                <h1 class="text-lg font-semibold">AniStream</h1>
                <p class="text-sm opacity-70">
                    <Text :target="I18n.InfoControl.description" />
                </p>
            </div>
        </div>
        <section>
            <h2 class="text-sm font-semibold mb-2 uppercase opacity-60">
                <Text :target="I18n.InfoControl.application.title" />
            </h2>

            <div class="grid grid-cols-2 gap-y-2 text-sm">
                <span class="font-medium">
                    <Text :target="I18n.InfoControl.application.version" />
                </span>
                <span>v{{ vm.version }}</span>

                <span class="font-medium">
                    <Text :target="I18n.InfoControl.application.platform" />
                </span>
                <span>{{ vm.platform }}</span>
            </div>
        </section>
        <div class="divider"></div>
        <section class="space-y-4">
            <h2 class="text-sm font-semibold uppercase opacity-60">
                <Text :target="I18n.InfoControl.storage.title" />
            </h2>

            <div class="flex w-full bg-base-200 border border-base-300 rounded-lg h-3 overflow-clip">
                <div data-theme="aniworld-light" class="bg-primary h-full" :style="`width: ${vm.aniworldAssetsUsagePercentage}%`" :title="I18n.InfoControl.storage.aniworld[1].join(' ') + ' ' + I18n.InfoControl.storage.assets[1].join(' ')"></div>
                <div data-theme="aniworld-light" class="bg-secondary h-full" :style="`width: ${vm.aniworldMetadataUsagePercentage}%`" :title="I18n.InfoControl.storage.aniworld[1].join(' ') + ' ' + I18n.InfoControl.storage.metadata[1].join(' ')"></div>
                <div data-theme="sto-light" class="bg-primary h-full" :style="`width: ${vm.stoAssetsUsagePercentage}%`" :title="I18n.InfoControl.storage.sto[1].join(' ') + ' ' + I18n.InfoControl.storage.assets[1].join(' ')"></div>
                <div data-theme="sto-light" class="bg-secondary h-full" :style="`width: ${vm.stoMetadataUsagePercentage}%`" :title="I18n.InfoControl.storage.sto[1].join(' ') + ' ' + I18n.InfoControl.storage.metadata[1].join(' ')"></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <h3 class="text-xs font-bold uppercase flex items-center gap-2">
                        <div data-theme="aniworld-light" class="w-2 h-2 rounded-full bg-primary"></div>
                        <Text :target="I18n.InfoControl.storage.aniworld" />
                    </h3>
                    <div class="flex justify-between text-sm">
                        <span class="opacity-70">
                            <Text :target="I18n.InfoControl.storage.assets" />
                        </span>
                        <span class="font-medium">{{ vm.formatBytes(vm.aniworldAssetsUsage) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="opacity-70">
                            <Text :target="I18n.InfoControl.storage.metadata" />
                        </span>
                        <span class="font-medium">{{ vm.formatBytes(vm.aniworldMetadataUsage) }}</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <h3 class="text-xs font-bold uppercase flex items-center gap-2">
                        <div data-theme="sto-light" class="w-2 h-2 rounded-full bg-primary"></div>
                        <Text :target="I18n.InfoControl.storage.sto" />
                    </h3>
                    <div class="flex justify-between text-sm">
                        <span class="opacity-70">
                            <Text :target="I18n.InfoControl.storage.assets" />
                        </span>
                        <span class="font-medium">{{ vm.formatBytes(vm.stoAssetsUsage) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="opacity-70">
                            <Text :target="I18n.InfoControl.storage.metadata" />
                        </span>
                        <span class="font-medium">{{ vm.formatBytes(vm.stoMetadataUsage) }}</span>
                    </div>
                </div>
            </div>

            <div class="pt-2 border-t border-base-300 flex justify-between items-center">
                <span class="text-sm font-semibold">
                    <Text :target="I18n.InfoControl.storage.total" />
                </span>
                <span class="text-lg font-bold text-primary">{{ vm.formatBytes(vm.totalUsage) }}</span>
            </div>
        </section>
        <div class="divider"></div>
        <section class="space-y-2">
            <h2 class="text-sm font-semibold uppercase opacity-60">
                <Text :target="I18n.InfoControl.credits.title" />
            </h2>

            <p class="text-sm opacity-80">
                <Text :target="I18n.InfoControl.credits.description" />
            </p>

            <ul class="list-disc list-inside text-sm space-y-1">
                <li>
                    <Text :target="I18n.InfoControl.credits.storyset.pre" />
                    <a
                        href="https://storyset.com/"
                        target="_blank"
                        class="link link-primary ml-1"
                    >
                        <Text :target="I18n.InfoControl.credits.storyset.post" />
                    </a>
                </li>
                <li>
                    <Text :target="I18n.InfoControl.credits.lucide.pre" />
                    <a
                        href="https://iconify.design/"
                        target="_blank"
                        class="link link-primary ml-1"
                    >
                        <Text :target="I18n.InfoControl.credits.lucide.post" />
                    </a>
                </li>
            </ul>
        </section>
        <p class="text-xs opacity-50 pt-4">
            © {{ new Date().getFullYear() }} CBx0. <Text :target="I18n.InfoControl.copyright" />
        </p>
    </div>
</template>
