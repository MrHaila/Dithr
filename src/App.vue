<template>
  <div
    class="flex min-h-dvh w-full flex-col items-center justify-start gap-3 bg-zinc-800 p-4 pb-40 sm:justify-center sm:gap-6 sm:p-0 sm:pb-0"
  >
    <h1 class="sr-only">Dithr — dithering playground</h1>
    <!-- w-fit shrinks this box to the canvas so the desktop label can hang off its right edge. -->
    <div class="relative w-fit">
      <DitherCanvas
        :mode="mode"
        :content="content"
        :text="text"
        :image-src="imageSrc"
        :gradient="gradient"
        :render-style="renderStyle"
        :shape="shape"
        @resize="onResize"
      />
      <!-- Desktop: hang the label off the canvas' right edge, bottom-aligned, out of flow. -->
      <MuseumLabel v-bind="labelProps" class="absolute bottom-0 left-full ml-4 hidden lg:block" />
    </div>
    <ShapePicker v-if="content === 'shape'" v-model="shape" />
    <TextInput v-else-if="content === 'text'" v-model="text" placeholder="DITHR" />
    <ImagePicker v-else @pick="onPick" />
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
      class="fixed inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-2 bg-zinc-800/85 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:contents"
    >
      <div class="contents sm:fixed sm:bottom-4 sm:left-4 sm:flex sm:gap-2">
        <DitherModeToggle v-model="mode" />
        <GradientToggle v-model="gradient" />
        <RenderStyleToggle v-model="renderStyle" />
      </div>
      <ContentTypeToggle v-model="content" class="sm:fixed sm:right-4 sm:bottom-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import ContentTypeToggle, { type ContentType } from './components/ContentTypeToggle.vue'
import DitherCanvas from './components/DitherCanvas.vue'
import DitherModeToggle, { type DitherMode } from './components/DitherModeToggle.vue'
import GradientToggle, { type Gradient } from './components/GradientToggle.vue'
import ImagePicker from './components/ImagePicker.vue'
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

function onPick(payload: { url: string; name: string }) {
  imageSrc.value = payload.url
  imageName.value = payload.name
}

function onResize(size: { w: number; h: number }) {
  canvasW.value = size.w
  canvasH.value = size.h
}
</script>
