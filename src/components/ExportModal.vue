<template>
  <!--
    Native <dialog> as a modal: showModal() gives us the top-layer, a focus
    trap, Esc-to-dismiss and the ::backdrop for free. The export itself just
    composites the live dithered canvas bitmap (passed to open()) so the result
    is exactly what's on screen, plus an optional frame, background and recolor.
  -->
  <dialog
    ref="dialogRef"
    aria-labelledby="export-title"
    class="m-auto max-h-[90dvh] w-[min(92vw,22rem)] overflow-auto rounded-2xl bg-zinc-800 text-zinc-200 shadow-2xl backdrop:bg-black/60"
    @click="onBackdropClick"
    @close="onClose"
  >
    <div class="flex flex-col gap-4 p-5">
      <h2 id="export-title" class="flex items-center gap-2 text-base font-bold text-zinc-100">
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
      </h2>

      <!-- Preview. The checker shows through wherever the export is transparent. -->
      <div class="flex flex-col items-center gap-1">
        <canvas ref="previewRef" class="checker max-h-[38dvh] max-w-full rounded-md" aria-label="Export preview" />
        <p class="text-[11px] text-zinc-500">{{ outDims.w }} × {{ outDims.h }} px</p>
      </div>

      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-semibold text-zinc-400">Background</span>
          <ToggleSwitch v-model="bg" size="sm" label="Export background" :options="bgOptions">
            <template #default="{ option, active }">
              <svg v-if="option.value === 'dark'" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <rect x="3" y="3" width="12" height="12" rx="3" :fill="active ? '#e5e7eb' : '#27272a'" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <g :fill="active ? '#e5e7eb' : '#27272a'">
                  <rect
                    x="3"
                    y="3"
                    width="12"
                    height="12"
                    rx="2"
                    fill="none"
                    :stroke="active ? '#e5e7eb' : '#27272a'"
                    stroke-width="1.4"
                  />
                  <rect x="3" y="3" width="6" height="6" />
                  <rect x="9" y="9" width="6" height="6" />
                </g>
              </svg>
            </template>
          </ToggleSwitch>
        </div>

        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-semibold text-zinc-400">Frame</span>
          <ToggleSwitch v-model="frame" size="sm" label="Export frame" :options="frameOptions">
            <template #default="{ option, active }">
              <svg v-if="option.value === 'show'" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <rect
                  x="3"
                  y="3"
                  width="12"
                  height="12"
                  rx="3"
                  fill="none"
                  :stroke="active ? '#e5e7eb' : '#27272a'"
                  stroke-width="2"
                />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <g fill="none" :stroke="active ? '#e5e7eb' : '#27272a'" stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="3" width="12" height="12" rx="3" />
                  <line x1="4" y1="14" x2="14" y2="4" />
                </g>
              </svg>
            </template>
          </ToggleSwitch>
        </div>

        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-semibold text-zinc-400">Color</span>
          <ToggleSwitch v-model="color" size="sm" label="Export color" :options="colorOptions">
            <template #default="{ option, active }">
              <svg v-if="option.value === 'current'" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <g :fill="active ? '#e5e7eb' : '#27272a'">
                  <rect x="3" y="3" width="3" height="3" />
                  <rect x="8" y="3" width="3" height="3" />
                  <rect x="5.5" y="5.5" width="3" height="3" />
                  <rect x="10.5" y="5.5" width="3" height="3" />
                  <rect x="3" y="8" width="3" height="3" />
                  <rect x="8" y="8" width="3" height="3" />
                  <rect x="5.5" y="10.5" width="3" height="3" />
                  <rect x="10.5" y="10.5" width="3" height="3" />
                </g>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="9" r="6" :fill="active ? '#e5e7eb' : '#27272a'" />
              </svg>
            </template>
          </ToggleSwitch>
        </div>

        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-semibold text-zinc-400">Resolution</span>
          <ToggleSwitch v-model="res" size="sm" label="Export resolution" :options="resOptions">
            <template #default="{ option, active }">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <text
                  x="9"
                  y="9"
                  text-anchor="middle"
                  dominant-baseline="central"
                  font-family="'Departure Mono', monospace"
                  font-size="10"
                  font-weight="700"
                  :fill="active ? '#e5e7eb' : '#27272a'"
                >
                  {{ option.value }}×
                </text>
              </svg>
            </template>
          </ToggleSwitch>
        </div>
      </div>

      <p v-if="error" role="alert" class="text-xs text-amber-400">{{ error }}</p>

      <!-- macOS HIG: actions right-aligned, primary (Export) rightmost, Cancel secondary to its left. -->
      <div class="flex justify-end gap-3 pt-1">
        <BevelButton @click="close">Cancel</BevelButton>
        <BevelButton variant="primary" @click="doExport">Export</BevelButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'

import BevelButton from './BevelButton.vue'
import { artworkTitle, type ArtworkMeta, snakeCase } from './museumTitle'
import type { RenderStyle } from './RenderStyleToggle.vue'
import ToggleSwitch from './ToggleSwitch.vue'

type Bg = 'dark' | 'transparent'
type FrameOpt = 'show' | 'hide'
type ColorOpt = 'current' | 'black'
type Res = '1' | '2'

// Frame geometry mirrors the on-page canvas panel: rounded-3xl (24px) + p-6 (24px).
const FRAME_PAD = 24
const FRAME_RADIUS = 24
// The solid panel's drop shadow. A framed solid export reserves this much air so
// the soft shadow fades out instead of being clipped at the bitmap edge.
const SHADOW_BLUR = 22
const SHADOW_OFFSET_Y = 10
const SOLID_MARGIN = SHADOW_BLUR + SHADOW_OFFSET_Y
// zinc-800, the app background
const DARK = '#27272a'
const GRAY_400 = '#9ca3af'
const GRAY_300 = '#d1d5db'
const GRAY_700 = '#374151'

const bgOptions: { value: Bg; label: string }[] = [
  { value: 'dark', label: 'Dark background' },
  { value: 'transparent', label: 'Transparent background' },
]
const frameOptions: { value: FrameOpt; label: string }[] = [
  { value: 'show', label: 'Show frame' },
  { value: 'hide', label: 'Hide frame' },
]
const colorOptions: { value: ColorOpt; label: string }[] = [
  { value: 'current', label: 'Keep current color' },
  { value: 'black', label: 'Force black' },
]
const resOptions: { value: Res; label: string }[] = [
  { value: '1', label: '1× resolution' },
  { value: '2', label: '2× resolution' },
]

const bg = ref<Bg>('dark')
const frame = ref<FrameOpt>('show')
const color = ref<ColorOpt>('current')
const res = ref<Res>('2')
const error = ref('')

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const previewRef = useTemplateRef<HTMLCanvasElement>('previewRef')

// Source bitmap + render style + artwork meta captured when the dialog opens;
// static while open.
let source: HTMLCanvasElement | null = null
let meta: ArtworkMeta | null = null
const renderStyle = ref<RenderStyle>('solid')
const srcW = ref(0)
const srcH = ref(0)

function open(src: HTMLCanvasElement, style: RenderStyle, artMeta: ArtworkMeta) {
  source = src
  meta = artMeta
  srcW.value = src.width
  srcH.value = src.height
  renderStyle.value = style
  error.value = ''
  const dlg = dialogRef.value
  if (!dlg) return
  if (!dlg.open) dlg.showModal()
  // showModal() promotes the dialog synchronously and the preview <canvas> is
  // always in the DOM and sized explicitly, so no layout tick is needed.
  renderPreview()
  // Focus the first option (the Background toggle's selected radio) rather than
  // the primary button, so keyboard users land on the inputs.
  dialogRef.value?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus()
}

// Solid panels reserve shadow air; outline panels sit tight to the border.
function frameMargin(): number {
  if (frame.value !== 'show') return 0
  return renderStyle.value === 'solid' ? SOLID_MARGIN : 0
}

// Final exported pixel size, surfaced as a caption so the resolution toggle has
// a visible effect (the preview itself is display-scaled and looks identical).
const outDims = computed(() => {
  const pad = frame.value === 'show' ? FRAME_PAD : 0
  const margin = frameMargin()
  const scale = Number(res.value)
  return { w: (srcW.value + (pad + margin) * 2) * scale, h: (srcH.value + (pad + margin) * 2) * scale }
})

function close() {
  dialogRef.value?.close()
}

function onClose() {
  source = null
}

// ::backdrop clicks land on the <dialog> element itself; inner clicks don't.
function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) close()
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

// Recolor the (single-color, hard-edged) dither bitmap by keeping its alpha and
// flooding the opaque pixels with one color.
function recolor(src: HTMLCanvasElement, fill: string): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = src.width
  out.height = src.height
  const ctx = out.getContext('2d')!
  ctx.drawImage(src, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, out.width, out.height)
  return out
}

// Draw the panel that mirrors the on-page canvas frame. `rect` is already scaled.
function drawFrame(
  ctx: CanvasRenderingContext2D,
  s: number,
  rect: { x: number; y: number; w: number; h: number; r: number },
) {
  const { x, y, w, h, r } = rect
  if (renderStyle.value === 'solid') {
    // gray-400 panel with a drop shadow…
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur = SHADOW_BLUR * s
    ctx.shadowOffsetY = SHADOW_OFFSET_Y * s
    roundRectPath(ctx, x, y, w, h, r)
    ctx.fillStyle = GRAY_400
    ctx.fill()
    ctx.restore()
    // …then the subtle top-light / bottom-shade borders, clipped to the panel.
    ctx.save()
    roundRectPath(ctx, x, y, w, h, r)
    ctx.clip()
    ctx.fillStyle = GRAY_300
    ctx.fillRect(x, y, w, 1 * s)
    ctx.fillStyle = GRAY_700
    ctx.fillRect(x, y + h - 4 * s, w, 4 * s)
    ctx.restore()
  } else {
    // outline panel: 4px gray-400 stroke, inset so it stays inside the box.
    const lw = 4 * s
    roundRectPath(ctx, x + lw / 2, y + lw / 2, w - lw, h - lw, r - lw / 2)
    ctx.lineWidth = lw
    ctx.strokeStyle = GRAY_400
    ctx.stroke()
  }
}

// Composite the export at the given device scale. Returns null if no source.
function compose(scale: number): HTMLCanvasElement | null {
  if (!source) return null
  const W = source.width
  const H = source.height
  const framed = frame.value === 'show'
  const pad = framed ? FRAME_PAD : 0
  const margin = frameMargin()
  const panelW = W + pad * 2
  const panelH = H + pad * 2

  const out = document.createElement('canvas')
  out.width = (panelW + margin * 2) * scale
  out.height = (panelH + margin * 2) * scale
  const ctx = out.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  const s = scale

  if (bg.value === 'dark') {
    ctx.fillStyle = DARK
    ctx.fillRect(0, 0, out.width, out.height)
  }

  if (framed) {
    drawFrame(ctx, s, { x: margin * s, y: margin * s, w: panelW * s, h: panelH * s, r: FRAME_RADIUS * s })
  }

  const ink = color.value === 'black' ? recolor(source, '#000000') : source
  const offset = (margin + pad) * s
  ctx.drawImage(ink, offset, offset, W * s, H * s)
  return out
}

function renderPreview() {
  const full = compose(1)
  const cv = previewRef.value
  if (!cv || !full) return
  cv.width = full.width
  cv.height = full.height
  const ctx = cv.getContext('2d')!
  ctx.clearRect(0, 0, cv.width, cv.height)
  ctx.drawImage(full, 0, 0)
}

function doExport() {
  error.value = ''
  const out = compose(Number(res.value))
  if (!out) return
  try {
    out.toBlob((blob) => {
      if (!blob) {
        error.value = 'Export failed — could not encode the image.'
        return
      }
      const slug = meta ? snakeCase(artworkTitle(meta)) : ''
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = slug ? `dithr_${slug}.png` : 'dithr.png'
      document.body.append(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      close()
    }, 'image/png')
  } catch {
    // A cross-origin image taints the canvas and blocks readback.
    error.value = 'Export blocked — the image is cross-origin and can’t be saved.'
  }
}

// Live-update the preview as options change while the dialog is open. `res` is
// omitted: it only scales the file, not the display-scaled preview pixels (the
// outDims caption surfaces its effect instead).
watch([bg, frame, color], () => {
  if (dialogRef.value?.open) renderPreview()
})

defineExpose({ open })
</script>

<style scoped>
/* Light checker so both ink colors (dark #27272a, mid-gray #9ca3af) stay readable
   against the transparent-background preview. */
.checker {
  background-color: #ffffff;
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0;
}
</style>
