<template>
  <!--
    Reusable 3D-beveled pill button: light top edge + heavy bottom edge over a
    gray (default) or amber (primary) face, matching the app's controls. Callers
    add sizing/layout classes (they fall through to the root <button>).
  -->
  <button
    type="button"
    class="fbrackets relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-t border-b-4 px-5 py-2 text-sm font-semibold text-zinc-900 shadow-xl transition-colors select-none focus:outline-none"
    :class="
      variant === 'primary'
        ? 'border-t-amber-200 border-b-amber-600 bg-amber-400 hover:border-b-amber-700 hover:bg-amber-300 active:bg-amber-500'
        : 'border-t-gray-300 border-b-gray-700 bg-gray-400 hover:border-b-gray-800 hover:bg-gray-500 active:bg-gray-600'
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'primary' }>(), { variant: 'default' })
</script>
