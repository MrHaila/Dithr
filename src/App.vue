<template>
  <div class="flex h-screen w-full items-center justify-center bg-[#282c33]">
    <div class="flex items-center justify-center rounded-3xl bg-[#abb2bf] p-12">
      <canvas ref="canvasRef" :width="CANVAS_W" :height="CANVAS_H" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const PIXEL_SIZE = 4
const CANVAS_W = 480
const CANVAS_H = 480

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

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!

  const w = CANVAS_W / PIXEL_SIZE
  const h = CANVAS_H / PIXEL_SIZE

  // Draw gradient circle at low res
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const offCtx = off.getContext('2d')!

  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.45

  const grad = offCtx.createLinearGradient(cx, cy - r, cx, cy + r)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(1, '#000000')

  offCtx.fillStyle = grad
  offCtx.beginPath()
  offCtx.arc(cx, cy, r, 0, Math.PI * 2)
  offCtx.fill()

  const { data } = offCtx.getImageData(0, 0, w, h)

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 128) continue

      const lum = data[i] / 255
      const isWhite = lum > bayerThreshold(x, y)
      if (isWhite) continue
      ctx.fillStyle = '#000000'
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
    }
  }
})
</script>
