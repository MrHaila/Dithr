<template>
  <div class="flex items-center gap-1 rounded-full bg-gray-400 p-1 shadow-lg">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-colors"
      :class="
        modelValue === opt.value
          ? 'bg-zinc-800 text-gray-300 active:bg-zinc-900'
          : 'text-zinc-900 hover:bg-zinc-800/10 active:bg-zinc-800/20'
      "
      @click="emit('update:modelValue', opt.value)"
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

defineProps<{
  modelValue: T
  options: Option[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()
</script>
