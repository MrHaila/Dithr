<template>
  <ToggleSwitch :model-value="modelValue" :options="options" @update:model-value="emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

export type ContentType = 'circle' | 'text' | 'image'

defineProps<{
  modelValue: ContentType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ContentType): void
}>()

const options: { value: ContentType; label: string }[] = [
  { value: 'circle', label: 'Circ' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Img' },
]
</script>
