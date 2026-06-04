<template>
  <input
    :value="modelValue"
    type="text"
    aria-label="Text to dither"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    enterkeyhint="done"
    :placeholder="placeholder"
    class="w-full max-w-xs cursor-text rounded-3xl border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 px-8 py-4 text-center text-2xl font-bold text-zinc-900 shadow-xl transition-colors placeholder:text-zinc-900/40 hover:border-t-gray-300 hover:border-b-gray-800 hover:bg-gray-500 focus:border-t-gray-300 focus:border-b-gray-800 focus:bg-gray-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:w-auto sm:max-w-none"
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
