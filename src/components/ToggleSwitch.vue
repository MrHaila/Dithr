<template>
  <div
    role="radiogroup"
    :aria-label="label"
    class="flex items-center gap-1 rounded-full border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 p-1 shadow-xl"
  >
    <button
      v-for="(opt, i) in options"
      :key="String(opt.value)"
      type="button"
      role="radio"
      :aria-label="opt.label"
      :aria-checked="modelValue === opt.value"
      :tabindex="modelValue === opt.value ? 0 : -1"
      :title="opt.label"
      class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:h-10 sm:w-10"
      :class="
        modelValue === opt.value
          ? 'bg-zinc-800 text-gray-300 active:bg-zinc-900'
          : 'text-zinc-900 hover:bg-zinc-800/10 active:bg-zinc-800/20'
      "
      @click="emit('update:modelValue', opt.value)"
      @keydown="onKeydown($event, i)"
    >
      <slot :option="opt" :active="modelValue === opt.value">{{ opt.label }}</slot>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
interface Option {
  value: T
  label: string
}

const props = defineProps<{
  modelValue: T
  options: Option[]
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

// Radiogroup keyboard model: arrows / Home / End move selection and roving focus.
function onKeydown(e: KeyboardEvent, i: number) {
  const n = props.options.length
  let next = -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  else return
  e.preventDefault()
  const group = (e.currentTarget as HTMLElement).parentElement
  emit('update:modelValue', props.options[next].value)
  ;(group?.children[next] as HTMLElement | undefined)?.focus()
}
</script>
