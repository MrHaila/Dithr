<template>
  <div class="flex h-screen w-full flex-col items-center justify-center gap-6 bg-zinc-800">
    <DitherCanvas
      :mode="mode"
      :content="content"
      :text="text"
      :image-src="imageSrc"
      :gradient="gradient"
      :render-style="renderStyle"
    />
    <TextInput v-if="content === 'text'" v-model="text" placeholder="DITHR" />
    <ImagePicker v-else-if="content === 'image'" @pick="imageSrc = $event" />
    <div class="fixed bottom-4 left-4 flex gap-2">
      <DitherModeToggle v-model="mode" />
      <GradientToggle v-model="gradient" />
      <RenderStyleToggle v-model="renderStyle" />
    </div>
    <ContentTypeToggle v-model="content" class="fixed right-4 bottom-4" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ContentTypeToggle, { type ContentType } from './components/ContentTypeToggle.vue'
import DitherCanvas from './components/DitherCanvas.vue'
import DitherModeToggle, { type DitherMode } from './components/DitherModeToggle.vue'
import GradientToggle, { type Gradient } from './components/GradientToggle.vue'
import ImagePicker from './components/ImagePicker.vue'
import RenderStyleToggle, { type RenderStyle } from './components/RenderStyleToggle.vue'
import TextInput from './components/TextInput.vue'

const mode = ref<DitherMode>('bayer')
const content = ref<ContentType>('circle')
const text = ref('DITHR')
const imageSrc = ref<string | null>(null)
const gradient = ref<Gradient>('top')
const renderStyle = ref<RenderStyle>('solid')
</script>
