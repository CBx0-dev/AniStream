<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {SettingsViewModel} from "@views/SettingsView.model";
import LucidePalette from "@icons/LucidePalette.vue";
import LucideInfo from "@icons/LucideInfo.vue";
import LucideNewspaper from "@icons/LucideNewspaper.vue";

import Text from "@controls/Text.vue";
import ThemeControl from "@controls/ThemeControl.vue";

import i18n from "@utils/i18n";

const vm: SettingsViewModel = useViewModel(SettingsViewModel);
</script>

<template>
    <div class="container m-auto h-2/3">
        <div class="card bg-base-100 card-border border-base-300 h-full">
            <div class="card-body flex-row gap-2">
                <div class="tabs tabs-lift h-full w-full">
                    <label class="tab">
                        <input type="radio" name="settings-tabs" checked/>
                        <span class="inline-flex items-center gap-1">
                            <LucidePalette/>
                            <Text :target="i18n.SettingsView.pref"/>
                        </span>
                    </label>
                    <div class="tab-content bg-base-100 border-base-300 p-6">
                        <ThemeControl/>
                    </div>

                    <label class="tab">
                        <input type="radio" name="settings-tabs"/>
                        <span class="inline-flex items-center gap-1">
                            <LucideNewspaper/>
                            <Text :target="i18n.SettingsView.changelog"/>
                        </span>
                    </label>
                    <div class="tab-content bg-base-100 border-base-300 p-6">
                        Tab 1 Content
                    </div>

                    <label class="tab">
                        <input type="radio" name="settings-tabs"/>
                        <span class="inline-flex items-center gap-1">
                            <LucideInfo/>
                            <Text :target="i18n.SettingsView.info"/>
                        </span>
                    </label>
                    <div class="tab-content bg-base-100 border-base-300 p-6">
                        Tab 3 Content
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
