<template>
  <input
    :value="modelValue"
    type="text"
    :placeholder="placeholder"
    class="cursor-text rounded-3xl border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 px-8 py-4 text-center text-2xl font-bold text-zinc-900 shadow-xl transition-colors outline-none placeholder:text-zinc-900/40 hover:border-t-gray-200 hover:border-b-gray-800 focus:border-t-gray-200 focus:border-b-gray-800 focus:bg-gray-500"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
