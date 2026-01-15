<script setup lang="ts">
import { useDialogControl } from 'vue-mvvm/dialog';
import { DetailControlModel } from '@controls/DetailControl.model';
import LucideX from '@/icons/LucideX.vue';
import LucidePlay from '@/icons/LucidePlay.vue';
import LucideTimerReset from '@/icons/LucideTimerReset.vue';
import I18n from '@/utils/i18n';
import Text from './Text.vue';
import LucideEllipsisVertical from '@/icons/LucideEllipsisVertical.vue';
import LucidePlus from '@/icons/LucidePlus.vue';
import ImageHash from "@controls/ImageHash.vue";

const vm: DetailControlModel = useDialogControl(DetailControlModel);
</script>

<template>
    <dialog class="modal" :open="vm.opened">
        <div class="modal-box max-w-4xl">
            <form method="dialog" class="flex justify-end" @submit.prevent="vm.closeDialog">
                <button class="btn btn-ghost btn-square">
                    <LucideX />
                </button>
            </form>
            <div class="flex gap-3 max-h-[450px]">
                <ImageHash
                    class="shrink-0 border border-base-300 rounded-sm"
                    :provider-folder="vm.providerFolder"
                    :hash="vm.previewImage"
                    :width="300"
                    :height="450" />
                <div class="grow flex flex-col gap-2">
                    <div class="shrink-0">
                        <h1 class="text-2xl font-semibold">{{ vm.title }}</h1>
                    </div>
                    <div class="shrink-0">
                        <div class="flex gap-1">
                            <div v-if="vm.mainGenre" class="badge badge-sm badge-soft badge-primary">
                                {{ vm.getGenreName(vm.mainGenre!.key) }}
                            </div>
                            <div v-for="genre in vm.genreChunk" class="badge badge-sm badge-soft text-nowrap">
                                {{ vm.getGenreName(genre.key) }}
                            </div>
                            <div v-if="vm.genreOverflow > 0" class="badge badge-sm badge-soft text-nowrap">
                                +{{ vm.genreOverflow }}
                            </div>

                        </div>
                    </div>
                    <div class="grow overflow-y-auto">
                        <p>
                            {{ vm.description }}
                        </p>
                    </div>
                    <div class="shrink-0 flex justify-end items-center gap-5">
                        <div class="tooltip w-full max-w-[150px] h-fit" data-tip="Watch progression">
                            <progress class="progress progress-primary max-w-[150px]" :value="vm.watchProgression" max="100" />
                        </div>
                        <div class="join">
                            <button class="join-item btn btn-primary btn-soft">
                                <LucidePlay />
                                <Text :target="I18n.DetailControl.watch" />
                            </button>
                            <button class="join-item btn btn-soft" :popovertarget="vm.popoverId"
                                :style="`anchor-name:${vm.anchorId}`">
                                <LucideEllipsisVertical />
                                <Teleport to="#app">
                                    <ul class="dropdown menu w-fit rounded-box bg-base-100 shadow-sm" popover
                                        :id="vm.popoverId" :style="`position-anchor:${vm.anchorId}`">
                                        <li>
                                            <a @click="vm.onResetProgressionBtn">
                                                <LucideTimerReset />
                                                <Text :target="I18n.DetailControl.reset" />
                                            </a>
                                            <a @click="vm.onAddWatchlistBtn">
                                                <LucidePlus />
                                                <Text :target="I18n.DetailControl.addWatchlist" />
                                            </a>
                                            <a @click="vm.onAddListBtn">
                                                <LucidePlus />
                                                <Text :target="I18n.DetailControl.addList" />
                                            </a>
                                        </li>
                                    </ul>
                                </Teleport>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.closeDialog">
            <button class="cursor-default">close</button>
        </form>
    </dialog>
</template>