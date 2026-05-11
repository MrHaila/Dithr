<template>
  <ToggleSwitch :model-value="modelValue" :options="options" @update:model-value="emit('update:modelValue', $event)">
    <template #default="{ option, active }">
      <svg v-if="option.value === 'solid'" width="20" height="20" viewBox="0 0 20 20">
        <rect x="3" y="3" width="14" height="14" rx="3" :fill="active ? '#e5e7eb' : '#27272a'" />
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 20 20">
        <rect
          x="3.5"
          y="3.5"
          width="13"
          height="13"
          rx="2.5"
          fill="none"
          :stroke="active ? '#e5e7eb' : '#27272a'"
          stroke-width="2"
        />
      </svg>
    </template>
  </ToggleSwitch>
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

export type RenderStyle = 'solid' | 'outline'

defineProps<{
  modelValue: RenderStyle
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RenderStyle): void
}>()

const options: { value: RenderStyle; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Out' },
]
</script>
