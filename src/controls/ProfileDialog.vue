<script setup lang="ts">
import {useDialogControl} from "vue-mvvm/dialog";

import {ProfileDialogModel} from "@controls/ProfileDialog.model";
import ProfileSetupControl from "@controls/ProfileSetupControl.vue";

const vm: ProfileDialogModel = useDialogControl(ProfileDialogModel);
</script>

<template>
    <dialog class="modal" :open="vm.isOpen">
        <div class="modal-box max-w-7xl">
            <ProfileSetupControl ref="profile-setup-control" />
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="vm.closeDialog()">
            <button></button>
        </form>
    </dialog>
</template>