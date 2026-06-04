<template>
  <!--
    Maker credit, styled as a wall placard to echo MuseumLabel — a jokey
    "who painted this" tombstone for the app itself. Sits absolute top-left
    behind the controls (see App's z-0) so it never blocks interaction;
    only the GitHub link opts back into pointer events.
  -->
  <div role="note" aria-label="About" class="pointer-events-none cursor-default text-left leading-tight select-none">
    <div class="text-lg text-zinc-500">Dithr</div>
    <a
      :href="repo"
      target="_blank"
      rel="noopener noreferrer"
      class="pointer-events-auto inline-flex items-center gap-1 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
    >
      Github
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M14 4 h6 v6" />
        <path d="M20 4 L10 14" />
        <path d="M19 13 v6 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 V6 a1 1 0 0 1 1 -1 h6" />
      </svg>
      <span class="sr-only">(opens in a new window)</span>
    </a>
  </div>
</template>

<script setup lang="ts">
const repo = 'https://github.com/MrHaila/dithr'
</script>
