<template>
  <!--
    Gallery wall label ("tombstone"). Presents the live selections as a museum
    placard: artist + life dates, title + year, medium, dimensions. The global
    mono face makes it read like an engraved/printed gallery card.
  -->
  <div role="note" aria-label="Gallery label" class="w-max max-w-[15rem] cursor-default text-left select-none">
    <div class="text-[12px] leading-tight text-zinc-500">{{ title }}</div>
    <div class="text-[12px] leading-tight break-all text-zinc-500">by Anonymous, {{ year }}</div>
    <pre class="mt-1 text-[11px] leading-snug text-zinc-600">{{ medium }}</pre>
    <div class="mt-1 text-[11px] leading-snug text-zinc-600">{{ dims }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ContentType } from './ContentTypeToggle.vue'
import type { DitherMode } from './DitherModeToggle.vue'
import type { Gradient } from './GradientToggle.vue'
import type { RenderStyle } from './RenderStyleToggle.vue'
import type { Shape } from './ShapePicker.vue'

const props = defineProps<{
  content: ContentType
  shape: Shape
  text: string
  imageName: string
  mode: DitherMode
  gradient: Gradient
  renderStyle: RenderStyle
  width: number
  height: number
}>()

const year = new Date().getFullYear()

// Curator-ish titles for the primitive shapes.
const SHAPE_TITLES: Record<Shape, string> = {
  circle: 'Tondo',
  yinyang: 'Taijitu',
  illuminati: 'Illuminatus',
  pentagram: 'Pentaculum',
}

const title = computed(() => {
  if (props.content === 'shape') return SHAPE_TITLES[props.shape]
  if (props.content === 'text') {
    const t = props.text.trim()
    return t ? `“${t}”` : 'Untitled'
  }
  // Image: use the file name (extension stripped) as the title.
  const name = props.imageName.replace(/\.[^.]+$/, '').trim()
  return name || 'Readymade'
})

const medium = computed(() => {
  const parts = [props.mode === 'bayer' ? 'Bayer dithering' : 'Blue-noise dithering']
  if (props.gradient === 'top') parts.push('top-lit gradient')
  else if (props.gradient === 'bottom') parts.push('bottom-lit gradient')
  parts.push(props.renderStyle === 'solid' ? 'solid.' : 'outline')
  return parts.join(',\n')
})

const dims = computed(() => `${props.width} × ${props.height} px`)
</script>
