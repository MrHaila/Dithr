export type Shape = 'circle' | 'yinyang' | 'illuminati' | 'pentagram'

/* eslint-disable typescript-eslint/prefer-readonly-parameter-types */
export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, w: number, h: number) {
  ctx.fillStyle = '#ffffff'
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.45
  if (shape === 'circle') drawCircle(ctx, cx, cy, r)
  else if (shape === 'yinyang') drawYinYang(ctx, cx, cy, r)
  else if (shape === 'illuminati') drawIlluminati(ctx, cx, cy, r)
  else drawPentagram(ctx, cx, cy, r)
}

function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawYinYang(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillRect(cx, cy - r, r, r * 2)
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy - r / 2, r / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(cx, cy + r / 2, r / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(cx, cy - r / 2, r * 0.12, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy + r / 2, r * 0.12, 0, Math.PI * 2)
  ctx.fill()
}

function drawIlluminati(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.lineTo(cx + r * 0.95, cy + r * 0.65)
  ctx.lineTo(cx - r * 0.95, cy + r * 0.65)
  ctx.closePath()
  ctx.fill()

  const eyeCy = cy + r * 0.1

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  const ringStep = r * 0.3
  ctx.lineWidth = r * 0.06
  for (let radius = r * 0.7; radius < r * 1.7; radius += ringStep) {
    ctx.beginPath()
    ctx.arc(cx, eyeCy, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.ellipse(cx, eyeCy, r * 0.55, r * 0.27, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, eyeCy, r * 0.22, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(cx, eyeCy, r * 0.08, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawPentagram(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  const starR = r
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    pts.push({ x: cx + Math.cos(a) * starR, y: cy + Math.sin(a) * starR })
  }
  const order = [0, 2, 4, 1, 3]

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  for (let i = 0; i < order.length; i++) {
    const p = pts[order[i]]
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()
  ctx.lineWidth = Math.max(2, r * 0.06)
  ctx.lineJoin = 'miter'
  ctx.miterLimit = 10
  ctx.stroke()
  ctx.restore()
}
