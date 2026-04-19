<script setup lang="ts">
import {useViewModel} from "vue-mvvm";

import {ListViewModel} from "@views/ListView.model";

import I18n from "@utils/i18n";

import LucideArrowLeft from "@icons/LucideArrowLeft.vue";
import LucideEdit from "@icons/LucideEdit.vue";
import LucideTrash from "@icons/LucideTrash.vue";

import Text from "@controls/Text.vue";
import ImageHash from "@controls/ImageHash.vue";
import LucideCheck from "@icons/LucideCheck.vue";

const vm: ListViewModel = useViewModel(ListViewModel);
</script>

<template>
    <div class="container mx-auto py-10">
        <div class="card bg-base-100 card-border border-base-300">
            <div class="card-body">
                <div class="flex justify-between items-center w-full">
                    <button class="btn btn-link hover:text-primary" @click="vm.onBackBtn">
                        <LucideArrowLeft/>
                        <Text :target="I18n.ListView.navbar.back"/>
                    </button>
                    <div>
                        <h1 class="inline-flex items-center gap-1">
                            <template v-if="vm.editTitle">
                                <input v-model="vm.title" class="input" @change="vm.onTitleSaveBtn()"/>
                                <button class="btn btn-soft btn-primary btn-square" @click="vm.onTitleSaveBtn()">
                                    <LucideCheck />
                                </button>
                            </template>
                            <template v-else>
                                {{ vm.title }}
                                <button class="btn btn-ghost btn-square" @click="vm.onTitleEditBtn()">
                                    <LucideEdit/>
                                </button>
                            </template>
                        </h1>
                    </div>
                    <div>
                        <button class="btn btn-soft btn-error" @click="vm.onDeleteBtn()">
                            <LucideTrash/>
                            <Text :target="I18n.ListView.navbar.delete" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,150px)] justify-center gap-3 py-6">
            <ImageHash
                v-for="series of vm.series"
                :key="series.series_id"
                class="border border-base-300 rounded-box hover:scale-110 hover:shadow-sm duration-300"
                :provider-folder="vm.providerFolder"
                :hash="series.preview_image"
                :width="150"
                :height="225"
                @click="vm.onCardClick(series)"/>
        </div>
    </div>
</template>
