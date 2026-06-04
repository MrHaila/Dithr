<template>
  <label
    class="fbrackets relative flex w-full max-w-xs cursor-pointer items-center justify-center gap-4 rounded-3xl border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 px-8 py-4 text-zinc-900 shadow-xl transition-colors select-none hover:border-t-gray-400 hover:border-b-gray-800 hover:bg-gray-500 active:border-t-gray-500 active:border-b-gray-800 active:bg-gray-600 sm:w-auto sm:max-w-none"
  >
    <span class="shrink-0 text-lg font-bold">Choose image</span>
    <span v-if="name" class="min-w-0 truncate text-sm opacity-70">{{ name }}</span>
    <input type="file" accept="image/*,.svg" class="sr-only" @change="onChange" />
  </label>
</template>

<script setup lang="ts">
defineProps<{ name?: string }>()

const emit = defineEmits<{
  (e: 'pick', file: File): void
}>()

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('pick', file)
}
</script>
