<template>
  <!-- pointer-events-none so it never steals the drop or the resize handle. -->
  <div
    class="pointer-events-none absolute inset-3 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 text-center transition-all duration-150"
    :class="cls"
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-transform duration-150"
      :class="{ '-translate-y-0.5': state === 'valid' }"
      aria-hidden="true"
    >
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
    </svg>
    <span class="text-sm font-bold">{{ title }}</span>
    <span class="text-xs opacity-70">{{ sub }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// `state` is the drag feedback when a file hovers, or 'hint' as the resting prompt.
// `dark` flips the ink for outline render, where the canvas is transparent over the dark app bg.
const props = defineProps<{ state: 'hint' | 'valid' | 'invalid'; dark: boolean }>()

const title = computed(() =>
  props.state === 'valid' ? 'Drop to load' : props.state === 'invalid' ? 'Not an image' : 'Drag & drop an image',
)
const sub = computed(() => (props.state === 'invalid' ? 'Images only' : 'or choose below'))
const cls = computed(() => {
  if (props.state === 'invalid') return 'border-red-500 bg-red-500/10 text-red-600'
  if (props.state === 'valid')
    return props.dark
      ? 'scale-[1.015] border-gray-100 bg-white/10 text-gray-100'
      : 'scale-[1.015] border-zinc-900 bg-white/40 text-zinc-900'
  return props.dark ? 'border-gray-500 text-gray-400' : 'border-gray-600/50 text-zinc-700'
})
</script>
