<template>
  <div class="flex h-screen w-full items-center justify-center bg-zinc-800">
    <DitherCanvas :mode="mode" />
    <DitherModeToggle v-model="mode" class="fixed bottom-4 left-4" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import DitherCanvas from './components/DitherCanvas.vue'
import DitherModeToggle, { type DitherMode } from './components/DitherModeToggle.vue'

const mode = ref<DitherMode>('bayer')
</script>
