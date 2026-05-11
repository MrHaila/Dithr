<template>
  <ToggleSwitch :model-value="modelValue" :options="options" @update:model-value="emit('update:modelValue', $event)">
    <template #default="{ option, active }">
      <svg v-if="option.value === 'shape'" width="20" height="20" viewBox="0 0 20 20">
        <g :fill="active ? '#e5e7eb' : '#27272a'">
          <circle cx="6" cy="13" r="3.5" />
          <rect x="11" y="9.5" width="6.5" height="6.5" />
          <path d="M 10 3 L 14 9 L 6 9 Z" />
        </g>
      </svg>
      <svg v-else-if="option.value === 'text'" width="20" height="20" viewBox="0 0 20 20">
        <text
          x="10"
          y="11"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="sans-serif"
          font-weight="900"
          font-size="14"
          :fill="active ? '#e5e7eb' : '#27272a'"
        >
          T
        </text>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 20 20">
        <g :fill="active ? '#e5e7eb' : '#27272a'">
          <rect
            x="3"
            y="4"
            width="14"
            height="12"
            rx="1.5"
            fill="none"
            :stroke="active ? '#e5e7eb' : '#27272a'"
            stroke-width="1.5"
          />
          <circle cx="7" cy="8" r="1.2" />
          <path d="M 4 14 L 9 10 L 12 12.5 L 14.5 10.5 L 16 14 Z" />
        </g>
      </svg>
    </template>
  </ToggleSwitch>
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

export type ContentType = 'shape' | 'text' | 'image'

defineProps<{
  modelValue: ContentType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ContentType): void
}>()

const options: { value: ContentType; label: string }[] = [
  { value: 'shape', label: 'Shape' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
]
</script>
