<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {SettingsViewModel} from "@views/SettingsView.model";
import LucidePalette from "@icons/LucidePalette.vue";
import LucideInfo from "@icons/LucideInfo.vue";
import LucideNewspaper from "@icons/LucideNewspaper.vue";
import LucideArrowLeft from "@icons/LucideArrowLeft.vue";

import Text from "@controls/Text.vue";
import PrefControl from "@controls/PrefControl.vue";
import InfoControl from "@controls/InfoControl.vue";

import I18n from "@utils/i18n";

const vm: SettingsViewModel = useViewModel(SettingsViewModel);
</script>

<template>
    <div class="py-10 grow flex items-center">
        <div class="container mx-auto min-h-2/3">
            <div class="card bg-base-100 card-border border-base-300 h-full">
                <div class="card-body flex-row gap-2">
                    <div class="tabs tabs-lift h-full w-full">
                        <label class="tab" @click="vm.onBackBtn">
                            <input type="radio" name="settings-tabs"/>
                            <span class="inline-flex items-center gap-1">
                                <LucideArrowLeft />
                                <Text :target="I18n.SettingsView.back"/>
                            </span>
                        </label>
                        <label class="tab">
                            <input type="radio" name="settings-tabs" checked/>
                            <span class="inline-flex items-center gap-1">
                                <LucidePalette/>
                                <Text :target="I18n.SettingsView.pref"/>
                            </span>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
                            <PrefControl/>
                        </div>

                        <label class="tab">
                            <input type="radio" name="settings-tabs"/>
                            <span class="inline-flex items-center gap-1">
                                <LucideNewspaper/>
                                <Text :target="I18n.SettingsView.changelog"/>
                            </span>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
                            <Text :target="I18n.SettingsView.changelogContent" />
                        </div>

                        <label class="tab">
                            <input type="radio" name="settings-tabs"/>
                            <span class="inline-flex items-center gap-1">
                                <LucideInfo/>
                                <Text :target="I18n.SettingsView.info"/>
                            </span>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
                            <InfoControl/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
