<template>
  <ToggleSwitch :model-value="modelValue" :options="options" @update:model-value="emit('update:modelValue', $event)">
    <template #default="{ option, active }">
      <svg v-if="option.value === 'bayer'" width="20" height="20" viewBox="0 0 20 20">
        <g :fill="active ? '#e5e7eb' : '#27272a'">
          <rect x="3" y="3" width="3" height="3" />
          <rect x="9" y="3" width="3" height="3" />
          <rect x="6" y="6" width="3" height="3" />
          <rect x="12" y="6" width="3" height="3" />
          <rect x="3" y="9" width="3" height="3" />
          <rect x="9" y="9" width="3" height="3" />
          <rect x="6" y="12" width="3" height="3" />
          <rect x="12" y="12" width="3" height="3" />
        </g>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 20 20">
        <g :fill="active ? '#e5e7eb' : '#27272a'">
          <rect x="3" y="4" width="2" height="2" />
          <rect x="9" y="3" width="2" height="2" />
          <rect x="14" y="5" width="2" height="2" />
          <rect x="5" y="8" width="2" height="2" />
          <rect x="11" y="9" width="2" height="2" />
          <rect x="15" y="11" width="2" height="2" />
          <rect x="3" y="13" width="2" height="2" />
          <rect x="8" y="14" width="2" height="2" />
          <rect x="13" y="15" width="2" height="2" />
        </g>
      </svg>
    </template>
  </ToggleSwitch>
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
  { value: 'bayer', label: 'Bayer' },
  { value: 'blue', label: 'Blue' },
]
</script>
