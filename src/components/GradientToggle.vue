<template>
  <ToggleSwitch
    label="Gradient direction"
    :model-value="modelValue"
    :options="options"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #default="{ option, active }">
      <svg v-if="option.value === 'top'" width="20" height="20" viewBox="0 0 20 20">
        <defs>
          <linearGradient :id="`g-top-${active}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" :stop-color="active ? '#e5e7eb' : '#27272a'" />
            <stop offset="1" :stop-color="active ? '#3f3f46' : '#a1a1aa'" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="14" height="14" rx="3" :fill="`url(#g-top-${active})`" />
      </svg>
      <svg v-else-if="option.value === 'bottom'" width="20" height="20" viewBox="0 0 20 20">
        <defs>
          <linearGradient :id="`g-bot-${active}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" :stop-color="active ? '#3f3f46' : '#a1a1aa'" />
            <stop offset="1" :stop-color="active ? '#e5e7eb' : '#27272a'" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="14" height="14" rx="3" :fill="`url(#g-bot-${active})`" />
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" fill="none" :stroke="active ? '#e5e7eb' : '#27272a'" stroke-width="1.8" />
        <line x1="5" y1="15" x2="15" y2="5" :stroke="active ? '#e5e7eb' : '#27272a'" stroke-width="1.8" />
      </svg>
    </template>
  </ToggleSwitch>
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

export type Gradient = 'top' | 'bottom' | 'off'

defineProps<{
  modelValue: Gradient
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Gradient): void
}>()

const options: { value: Gradient; label: string }[] = [
  { value: 'top', label: 'Gradient top' },
  { value: 'bottom', label: 'Gradient bottom' },
  { value: 'off', label: 'No gradient' },
]
</script>
