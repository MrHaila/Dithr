<template>
  <ToggleSwitch :model-value="modelValue" :options="options" @update:model-value="emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

export type DitherMode = 'bayer' | 'blue'

defineProps<{
  modelValue: DitherMode
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DitherMode): void
}>()

const options: { value: DitherMode; label: string }[] = [
  { value: 'bayer', label: 'Bay' },
  { value: 'blue', label: 'Blue' },
]
</script>
