<template>
  <div
    role="radiogroup"
    aria-label="Shape"
    class="flex items-center gap-2 rounded-3xl border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 p-2 shadow-xl"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-label="opt.label"
      :aria-checked="modelValue === opt.value"
      :tabindex="modelValue === opt.value ? 0 : -1"
      :title="opt.label"
      class="fbrackets relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl transition-colors focus:outline-none"
      :class="
        modelValue === opt.value
          ? 'bg-zinc-800 text-gray-300 active:bg-zinc-900'
          : 'text-zinc-900 hover:bg-zinc-800/10 active:bg-zinc-800/20'
      "
      @click="emit('update:modelValue', opt.value)"
      @keydown="onKeydown($event, i)"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle v-if="opt.value === 'circle'" cx="16" cy="16" r="10" fill="currentColor" />
        <g v-else-if="opt.value === 'yinyang'">
          <mask :id="`yy-${opt.value}-${modelValue === opt.value}`">
            <rect x="0" y="0" width="32" height="32" fill="white" />
            <rect x="16" y="6" width="10" height="20" fill="black" />
            <circle cx="16" cy="11" r="5" fill="white" />
            <circle cx="16" cy="21" r="5" fill="black" />
            <circle cx="16" cy="11" r="1.4" fill="black" />
            <circle cx="16" cy="21" r="1.4" fill="white" />
          </mask>
          <circle
            cx="16"
            cy="16"
            r="10"
            fill="currentColor"
            :mask="`url(#yy-${opt.value}-${modelValue === opt.value})`"
          />
        </g>
        <g v-else-if="opt.value === 'illuminati'">
          <mask :id="`ill-${opt.value}-${modelValue === opt.value}`">
            <rect x="0" y="0" width="32" height="32" fill="white" />
            <circle cx="16" cy="17" r="8" fill="none" stroke="black" stroke-width="1" />
            <circle cx="16" cy="17" r="10.5" fill="none" stroke="black" stroke-width="1" />
            <ellipse cx="16" cy="17" rx="6" ry="3" fill="black" />
            <circle cx="16" cy="17" r="1.6" fill="white" />
          </mask>
          <path
            d="M 16 5 L 28 26 L 4 26 Z"
            fill="currentColor"
            :mask="`url(#ill-${opt.value}-${modelValue === opt.value})`"
          />
        </g>
        <g v-else>
          <circle cx="16" cy="16" r="11" fill="currentColor" />
          <path
            d="M 16 6 L 21.88 24.09 L 6.49 12.91 L 25.51 12.91 L 10.12 24.09 Z"
            fill="none"
            :stroke="modelValue === opt.value ? '#27272a' : '#9ca3af'"
            stroke-width="1.4"
            stroke-linejoin="miter"
          />
        </g>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Shape } from './shapes'

export type { Shape }

defineProps<{
  modelValue: Shape
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Shape): void
}>()

const options: { value: Shape; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'yinyang', label: 'Yin-yang' },
  { value: 'illuminati', label: 'Illuminati' },
  { value: 'pentagram', label: 'Pentagram' },
]

// Radiogroup keyboard model: arrows / Home / End move selection and roving focus.
function onKeydown(e: KeyboardEvent, i: number) {
  const n = options.length
  let next = -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  else return
  e.preventDefault()
  const group = (e.currentTarget as HTMLElement).parentElement
  emit('update:modelValue', options[next].value)
  ;(group?.children[next] as HTMLElement | undefined)?.focus()
}
</script>
