<script setup lang="ts">
import { useUserControl } from "vue-mvvm";
import { TextControlModel } from "@/controls/Text.model";

const props = defineProps<{
    target: readonly [string, readonly string[]];
    args?: any[];
}>();

const vm: TextControlModel = useUserControl(TextControlModel);
</script>

<template>
    <span v-html="vm.i18n(props.target, ...(props.args ?? []))" />
</template>