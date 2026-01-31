<script setup lang="ts">
import {useUserControl} from "vue-mvvm";

import {HLSPlayerModel} from "@controls/HLSPlayer.model";

const vm: HLSPlayerModel = useUserControl(HLSPlayerModel);
</script>

<template>
    {{ vm }}
</template>
