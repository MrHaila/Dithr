<template>
  <div
    class="relative flex min-h-dvh w-full flex-col items-center justify-start gap-3 bg-zinc-800 p-4 pb-[calc(var(--bar-h,10rem)+0.75rem)] sm:justify-center sm:gap-6 sm:p-0 sm:pb-0"
    :style="barH ? { '--bar-h': barH } : undefined"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <h1 class="sr-only">Dithr — dithering playground</h1>
    <!-- Maker credit, top-left. z-0 keeps it under the canvas/controls (which paint
         later or sit at z-10) without dropping behind the root's own background. -->
    <MakerLabel class="absolute top-4 left-4 z-0" />
    <!-- w-fit shrinks this box to the canvas so the desktop label can hang off its right edge. -->
    <div class="relative w-fit">
      <DitherCanvas
        ref="dither"
        :mode="mode"
        :content="content"
        :text="text"
        :image-src="imageSrc"
        :gradient="gradient"
        :render-style="renderStyle"
        :shape="shape"
        :overlay="overlay"
        @resize="onResize"
      />
      <!-- Desktop: hang the label off the canvas' right edge, bottom-aligned, out of flow. -->
      <MuseumLabel v-bind="labelProps" class="absolute bottom-0 left-full ml-4 hidden lg:block" />
    </div>
    <ShapePicker v-if="content === 'shape'" v-model="shape" />
    <TextInput v-else-if="content === 'text'" v-model="text" placeholder="DITHR" />
    <ImagePicker v-else :name="imageName" @pick="setImage" />
    <!-- Mobile: label collapses below the content controls, right-aligned to match the controls' gutter. -->
    <div class="flex w-full justify-end sm:px-4 lg:hidden">
      <MuseumLabel v-bind="labelProps" />
    </div>
    <!--
      Controls. Mobile: this wrapper is a fixed, wrapping bottom bar and the inner
      group is `display:contents` so all four toggle groups wrap individually.
      Desktop (sm+): wrapper + group go `display:contents`/`flex` so the toggles
      return to their original fixed bottom-left / bottom-right corners.
    -->
    <div
      ref="controlBar"
      class="fixed inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-2 bg-zinc-800/85 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:contents"
    >
      <div class="contents sm:fixed sm:bottom-4 sm:left-4 sm:flex sm:items-stretch sm:gap-2">
        <ContentTypeToggle v-model="content" />
        <DitherModeToggle v-model="mode" />
        <GradientToggle v-model="gradient" />
        <RenderStyleToggle v-model="renderStyle" />
      </div>
      <!-- Export action. Bottom-right corner on desktop, last in the mobile bar;
           self-stretch matches the pill height in both layouts. -->
      <BevelButton class="self-stretch sm:fixed sm:right-4 sm:bottom-4" aria-haspopup="dialog" @click="openExport">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 v11" />
          <path d="M8 7 l4 -4 l4 4" />
          <path d="M6 11 H5.5 a2 2 0 0 0 -2 2 V19 a2 2 0 0 0 2 2 H18.5 a2 2 0 0 0 2 -2 V13 a2 2 0 0 0 -2 -2 H18" />
        </svg>
        Export
      </BevelButton>
    </div>
    <ExportModal ref="exportModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import BevelButton from './components/BevelButton.vue'
import ContentTypeToggle, { type ContentType } from './components/ContentTypeToggle.vue'
import DitherCanvas from './components/DitherCanvas.vue'
import DitherModeToggle, { type DitherMode } from './components/DitherModeToggle.vue'
import ExportModal from './components/ExportModal.vue'
import GradientToggle, { type Gradient } from './components/GradientToggle.vue'
import ImagePicker from './components/ImagePicker.vue'
import MakerLabel from './components/MakerLabel.vue'
import MuseumLabel from './components/MuseumLabel.vue'
import RenderStyleToggle, { type RenderStyle } from './components/RenderStyleToggle.vue'
import ShapePicker, { type Shape } from './components/ShapePicker.vue'
import TextInput from './components/TextInput.vue'

const mode = ref<DitherMode>('bayer')
const content = ref<ContentType>('shape')
const text = ref('Dithr')
const imageSrc = ref<string | null>(null)
const imageName = ref('')
const gradient = ref<Gradient>('top')
const renderStyle = ref<RenderStyle>('solid')
const shape = ref<Shape>('circle')
const canvasW = ref(480)
const canvasH = ref(480)
const dragState = ref<'none' | 'valid' | 'invalid'>('none')

const dither = useTemplateRef<InstanceType<typeof DitherCanvas>>('dither')
const exportModal = useTemplateRef<InstanceType<typeof ExportModal>>('exportModal')

// Mobile reserves bottom padding equal to the fixed control bar's *actual* height
// so the last in-flow content (the museum label) is never trapped behind it. The
// bar wraps to a variable number of rows depending on width, so we measure rather
// than hardcode. `--bar-h` feeds the root's `pb-[calc(...)]`; desktop overrides it
// with `sm:pb-0`, where the bar is `display:contents` and reports no useful height.
const controlBar = useTemplateRef<HTMLElement>('controlBar')
const barH = ref<string>()
let barObserver: ResizeObserver | undefined
onMounted(() => {
  const el = controlBar.value
  if (!el) return
  barObserver = new ResizeObserver(([entry]) => {
    const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
    barH.value = h > 0 ? `${Math.ceil(h)}px` : undefined
  })
  barObserver.observe(el)
})
onBeforeUnmount(() => barObserver?.disconnect())

function openExport() {
  const el = dither.value?.el
  if (el)
    exportModal.value?.open(el, renderStyle.value, {
      content: content.value,
      shape: shape.value,
      text: text.value,
      imageName: imageName.value,
    })
}

const labelProps = computed(() => ({
  content: content.value,
  shape: shape.value,
  text: text.value,
  imageName: imageName.value,
  mode: mode.value,
  gradient: gradient.value,
  renderStyle: renderStyle.value,
  width: canvasW.value,
  height: canvasH.value,
}))

// What the canvas overlay shows: live drag feedback wins; otherwise a resting hint
// while in image mode with nothing loaded yet.
const overlay = computed<'hint' | 'valid' | 'invalid' | null>(() => {
  if (dragState.value !== 'none') return dragState.value
  return content.value === 'image' && !imageSrc.value ? 'hint' : null
})

let currentUrl: string | null = null
function setImage(file: File) {
  if (currentUrl) URL.revokeObjectURL(currentUrl)
  currentUrl = URL.createObjectURL(file)
  imageSrc.value = currentUrl
  imageName.value = file.name
}

// Inspect the dragged payload without reading it (file contents aren't exposed
// during dragover). Optimistic on unknown types so OS drags don't read invalid.
function dragKind(dt: DataTransfer | null): 'valid' | 'invalid' {
  const files = dt ? Array.from(dt.items).filter((i) => i.kind === 'file') : []
  if (files.length === 0) return 'invalid'
  return files.some((f) => f.type.startsWith('image/') || f.type === '') ? 'valid' : 'invalid'
}

// dragenter/leave fire per child element, so count nesting to avoid flicker.
let dragDepth = 0
function onDragEnter(e: DragEvent) {
  dragDepth++
  dragState.value = dragKind(e.dataTransfer)
}
function onDragOver(e: DragEvent) {
  if (dragState.value === 'none') dragState.value = dragKind(e.dataTransfer)
}
function onDragLeave() {
  if (--dragDepth <= 0) {
    dragDepth = 0
    dragState.value = 'none'
  }
}
function onDrop(e: DragEvent) {
  dragDepth = 0
  dragState.value = 'none'
  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  content.value = 'image'
  setImage(file)
}

function onResize(size: { w: number; h: number }) {
  canvasW.value = size.w
  canvasH.value = size.h
}
</script>
