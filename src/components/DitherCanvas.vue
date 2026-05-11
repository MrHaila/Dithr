<template>
  <div
    class="relative flex items-center justify-center rounded-3xl p-6 transition-colors"
    :class="
      renderStyle === 'solid'
        ? 'border-t border-b-4 border-t-gray-300 border-b-gray-700 bg-gray-400 shadow-xl'
        : 'border-4 border-gray-400'
    "
  >
    <canvas ref="canvasRef" :width="canvasW" :height="canvasH" />
    <svg
      class="absolute right-3 bottom-3 cursor-se-resize opacity-40 transition-opacity hover:opacity-80"
      width="20"
      height="20"
      viewBox="-2 -2 24 24"
      @mousedown="onHandleMouseDown"
    >
      <path
        d="M 20 6 A 14 14 0 0 1 6 20"
        fill="none"
        :stroke="renderStyle === 'solid' ? '#282c33' : '#9ca3af'"
        stroke-width="3.5"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import blueNoiseUrl from '../assets/blue-noise-128.png'
import type { ContentType } from './ContentTypeToggle.vue'
import type { DitherMode } from './DitherModeToggle.vue'
import type { Gradient } from './GradientToggle.vue'
import type { RenderStyle } from './RenderStyleToggle.vue'
import type { Shape } from './ShapePicker.vue'
import { drawShape } from './shapes'

const props = defineProps<{
  mode: DitherMode
  content: ContentType
  text: string
  imageSrc: string | null
  gradient: Gradient
  renderStyle: RenderStyle
  shape: Shape
}>()

const PIXEL_SIZE = 4
const MIN_SIZE = 80
const BLUE_SIZE = 128

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasW = ref(480)
const canvasH = ref(480)
const blueTile = ref<Uint8Array | null>(null)
const loadedImage = ref<HTMLImageElement | null>(null)

// prettier-ignore
const BAYER_8 = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
]

function bayerThreshold(x: number, y: number): number {
  return BAYER_8[(y % 8) * 8 + (x % 8)] / 64
}

function blueThreshold(x: number, y: number): number {
  const t = blueTile.value!
  return t[(y & (BLUE_SIZE - 1)) * BLUE_SIZE + (x & (BLUE_SIZE - 1))] / 256
}

function loadBlueNoise() {
  const img = new Image()
  img.src = blueNoiseUrl
  img.addEventListener('load', () => {
    const off = document.createElement('canvas')
    off.width = BLUE_SIZE
    off.height = BLUE_SIZE
    const c = off.getContext('2d')!
    c.drawImage(img, 0, 0)
    const { data } = c.getImageData(0, 0, BLUE_SIZE, BLUE_SIZE)
    const out = new Uint8Array(BLUE_SIZE * BLUE_SIZE)
    for (let i = 0; i < out.length; i++) out[i] = data[i * 4]
    blueTile.value = out
    render()
  })
}

function drawText(offCtx: CanvasRenderingContext2D, w: number, h: number) {
  const text = props.text || ''
  if (!text) return
  offCtx.fillStyle = '#000000'
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  let fontSize = Math.floor(h * 0.5)
  offCtx.font = `900 ${fontSize}px sans-serif`
  const maxWidth = w * 0.9
  while (fontSize > 4 && offCtx.measureText(text).width > maxWidth) {
    fontSize -= 1
    offCtx.font = `900 ${fontSize}px sans-serif`
  }
  offCtx.fillText(text, w / 2, h / 2)
}

function drawImage(offCtx: CanvasRenderingContext2D, w: number, h: number) {
  const img = loadedImage.value
  if (!img) return
  const scale = Math.min(w / img.width, h / img.height) * 0.9
  const dw = img.width * scale
  const dh = img.height * scale
  offCtx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

function verticalBounds(data: Uint8ClampedArray, w: number, h: number): [number, number] {
  let minY = h
  let maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] >= 128) {
        if (y < minY) minY = y
        if (y > maxY) maxY = y
        break
      }
    }
  }
  return [minY, maxY]
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  if (props.mode === 'blue' && !blueTile.value) return
  const ctx = canvas.getContext('2d')!
  const W = canvasW.value
  const H = canvasH.value
  const w = W / PIXEL_SIZE
  const h = H / PIXEL_SIZE

  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const offCtx = off.getContext('2d')!

  if (props.content === 'shape') drawShape(offCtx, props.shape, w, h)
  else if (props.content === 'text') drawText(offCtx, w, h)
  else drawImage(offCtx, w, h)

  const { data } = offCtx.getImageData(0, 0, w, h)

  ctx.clearRect(0, 0, W, H)

  const threshold = props.mode === 'bayer' ? bayerThreshold : blueThreshold
  const gradient = props.gradient

  const [minY, maxY] = verticalBounds(data, w, h)
  const span = Math.max(1, maxY - minY)

  for (let y = 0; y < h; y++) {
    const t = (y - minY) / span
    const lum = gradient === 'off' ? 0 : gradient === 'top' ? 1 - t : t
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 128) continue
      if (lum > threshold(x, y)) continue
      ctx.fillStyle = props.renderStyle === 'solid' ? '#27272a' : '#9ca3af'
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
    }
  }
}

watch(
  () => props.imageSrc,
  (src) => {
    if (!src) {
      loadedImage.value = null
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.addEventListener('load', () => {
      loadedImage.value = img
      render()
    })
  },
)

let dragging = false
let startX = 0
let startY = 0
let startW = 0
let startH = 0

function onHandleMouseDown(e: MouseEvent) {
  dragging = true
  startX = e.clientX
  startY = e.clientY
  startW = canvasW.value
  startH = canvasH.value
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!dragging) return
  const snap = (v: number) => Math.round(v / PIXEL_SIZE) * PIXEL_SIZE
  canvasW.value = Math.max(MIN_SIZE, snap(startW + e.clientX - startX))
  canvasH.value = Math.max(MIN_SIZE, snap(startH + e.clientY - startY))
}

function onMouseUp() {
  dragging = false
}

watch(
  [
    canvasW,
    canvasH,
    () => props.mode,
    () => props.content,
    () => props.text,
    () => props.gradient,
    () => props.renderStyle,
    () => props.shape,
  ],
  () => nextTick(render),
)

onMounted(() => {
  loadBlueNoise()
  render()
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>
