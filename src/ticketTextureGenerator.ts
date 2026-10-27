import * as THREE from 'three'

/** Colours of the ticket (silver foil stock, career-site teal ink). */
const tier = {
  id: 'silver',
  paperHex: '#F1EEE6',
  inkHex: '#04343A',
  secondaryInkHex: '#3B5A5E'
}
type Tier = typeof tier

export const TEXT = {
  title: ['Travaillons', 'ensemble'],
  lead:
    'Ouvert aux opportunités dans le cloud natif, le DevOps, la mobilité autonome ou les villes connectées. Toulouse ou remote.',
  links: [
    ['LinkedIn', 'linkedin.com/in/poidevinfrancois'],
    ['Site perso', 'francois-poidevin.github.io/career'],
    ['Portfolio photo', 'flickr.com/photos/10698146@N06'],
    ['Roboflow IA', 'universe.roboflow.com/…/orthoparkingdetection']
  ],
  stub: 'Détacher pour un email'
}

export interface GeneratedTicketTextures {
  frontMap: THREE.CanvasTexture
  frontFoilMap: THREE.CanvasTexture
  backMap: THREE.CanvasTexture
  backFoilMap: THREE.CanvasTexture
}

const TEX_W = 1024
const TEX_H = 1740
/**
 * Perforation line sits at 72% down from top of ticket (y = 1252.8px in canvas space, v = 0.28 in UV space)
 */
export const PERF_RATIO_FROM_TOP = 0.72
const PERF_Y = Math.round(TEX_H * PERF_RATIO_FROM_TOP)

function drawRoundedTicketPath(ctx: CanvasRenderingContext2D, w: number, h: number, radius: number): void {
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(w - radius, 0)
  ctx.quadraticCurveTo(w, 0, w, radius)
  ctx.lineTo(w, h - radius)
  ctx.quadraticCurveTo(w, h, w - radius, h)
  ctx.lineTo(radius, h)
  ctx.quadraticCurveTo(0, h, 0, h - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
}

function punchPerforationCutouts(ctx: CanvasRenderingContext2D, w: number, isDark = false): void {
  const sideNotchRadius = 28
  const holeCount = 21
  const startX = 68
  const endX = w - 68
  const stepX = (endX - startX) / (holeCount - 1)
  const holeRadius = 8.2

  // First draw subtle debossed die-cut ring around each perforation hole
  ctx.save()
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(20,20,19,0.26)'
  ctx.lineWidth = 2.0
  for (let i = 0; i < holeCount; i++) {
    const hx = startX + i * stepX
    ctx.beginPath()
    ctx.arc(hx, PERF_Y, holeRadius + 1.2, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  // Now punch transparent cutouts
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = '#000000'

  ctx.beginPath()
  ctx.arc(0, PERF_Y, sideNotchRadius, 0, Math.PI * 2)
  ctx.arc(w, PERF_Y, sideNotchRadius, 0, Math.PI * 2)
  ctx.fill()

  for (let i = 0; i < holeCount; i++) {
    const hx = startX + i * stepX
    ctx.beginPath()
    ctx.arc(hx, PERF_Y, holeRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawPaperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, isDark: boolean): void {
  ctx.save()
  ctx.globalAlpha = isDark ? 0.045 : 0.032
  for (let i = 0; i < 4200; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * w
    const y = (Math.cos(i * 78.233) * 29431.1123 % 1 + 1) % 1 * h
    const len = 1 + (i % 3)
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000'
    ctx.fillRect(x, y, len, 1)
  }
  ctx.restore()
}
/**
 * Draws the intricate Guilloche Spirograph & Kinetic Prism Emblem both onto the visible diffuse canvas
 * and onto the RGB Foil/Emboss/Phase mask canvas.
 */
function drawGuillochePrismEmblem(
  baseCtx: CanvasRenderingContext2D,
  foilCtx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  tier: Tier
): void {
  const isDark = tier.id !== 'silver'

  // Outer fine geometric degree ring
  baseCtx.save()
  foilCtx.save()

  for (let i = 0; i < 120; i++) {
    const ang = (i / 120) * Math.PI * 2
    const isMajor = i % 10 === 0
    const isMid = i % 5 === 0
    const r0 = 212
    const r1 = isMajor ? 232 : isMid ? 225 : 219

    const x0 = cx + Math.cos(ang) * r0
    const y0 = cy + Math.sin(ang) * r0
    const x1 = cx + Math.cos(ang) * r1
    const y1 = cy + Math.sin(ang) * r1

    baseCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(20,20,19,0.72)'
    baseCtx.lineWidth = isMajor ? 2.4 : 1.3
    baseCtx.beginPath()
    baseCtx.moveTo(x0, y0)
    baseCtx.lineTo(x1, y1)
    baseCtx.stroke()

    const phaseByte = Math.round(((i / 120) * 255) % 255)
    foilCtx.strokeStyle = `rgb(245, 210, ${phaseByte})`
    foilCtx.lineWidth = isMajor ? 3.2 : 1.8
    foilCtx.beginPath()
    foilCtx.moveTo(x0, y0)
    foilCtx.lineTo(x1, y1)
    foilCtx.stroke()
  }

  // Multi-wave Guilloche Spirograph Curves
  const numWaves = 44
  for (let w = 0; w < numWaves; w++) {
    const tWave = w / numWaves
    const phaseShift = tWave * Math.PI * 2
    const phaseByte = Math.round(tWave * 255)

    baseCtx.beginPath()
    foilCtx.beginPath()

    const steps = 200
    for (let s = 0; s <= steps; s++) {
      const theta = (s / steps) * Math.PI * 2
      const r =
        138 +
        38 * Math.sin(6 * theta + phaseShift) +
        18 * Math.cos(12 * theta - phaseShift * 1.5)
      const px = cx + Math.cos(theta) * r
      const py = cy + Math.sin(theta) * r
      if (s === 0) {
        baseCtx.moveTo(px, py)
        foilCtx.moveTo(px, py)
      } else {
        baseCtx.lineTo(px, py)
        foilCtx.lineTo(px, py)
      }
    }

    baseCtx.strokeStyle = isDark
      ? `hsla(${40 + tWave * 220}, 70%, 78%, 0.42)`
      : `hsla(${210 + tWave * 160}, 35%, 24%, 0.40)`
    baseCtx.lineWidth = 1.35
    baseCtx.stroke()

    foilCtx.strokeStyle = `rgb(255, ${185 + (w % 60)}, ${phaseByte})`
    foilCtx.lineWidth = 2.2
    foilCtx.stroke()
  }

  // Central Faceted Holographic Octagon / Prism Star
  const facets = 16
  const innerRadius = 92
  for (let f = 0; f < facets; f++) {
    const a0 = (f / facets) * Math.PI * 2
    const a1 = ((f + 1) / facets) * Math.PI * 2
    const x0 = cx + Math.cos(a0) * innerRadius
    const y0 = cy + Math.sin(a0) * innerRadius
    const x1 = cx + Math.cos(a1) * innerRadius
    const y1 = cy + Math.sin(a1) * innerRadius

    baseCtx.beginPath()
    baseCtx.moveTo(cx, cy)
    baseCtx.lineTo(x0, y0)
    baseCtx.lineTo(x1, y1)
    baseCtx.closePath()

    const shade = f % 2 === 0 ? 0.88 : 0.62
    baseCtx.fillStyle = isDark
      ? `rgba(255, 255, 255, ${0.14 * shade})`
      : `rgba(20, 20, 22, ${0.12 * shade})`
    baseCtx.fill()
    baseCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(20,20,20,0.65)'
    baseCtx.lineWidth = 1.4
    baseCtx.stroke()

    // Each triangular facet gets a distinct diffraction phase in Blue channel + raised height in Green channel
    const facetPhase = Math.round(((f * 37) % 256))
    const facetHeight = f % 2 === 0 ? 235 : 175
    foilCtx.beginPath()
    foilCtx.moveTo(cx, cy)
    foilCtx.lineTo(x0, y0)
    foilCtx.lineTo(x1, y1)
    foilCtx.closePath()
    foilCtx.fillStyle = `rgb(255, ${facetHeight}, ${facetPhase})`
    foilCtx.fill()
  }

  // Concentric Holographic Core Ring
  baseCtx.beginPath()
  baseCtx.arc(cx, cy, 38, 0, Math.PI * 2)
  baseCtx.fillStyle = tier.paperHex
  baseCtx.fill()
  baseCtx.lineWidth = 3
  baseCtx.strokeStyle = tier.inkHex
  baseCtx.stroke()

  foilCtx.beginPath()
  foilCtx.arc(cx, cy, 38, 0, Math.PI * 2)
  foilCtx.fillStyle = 'rgb(255, 248, 128)'
  foilCtx.fill()

  // Center Edition Monogram inside Prism Core
  baseCtx.fillStyle = tier.inkHex
  baseCtx.font = '700 22px "JetBrains Mono", monospace'
  baseCtx.textAlign = 'center'
  baseCtx.textBaseline = 'middle'
  const monogram = 'FP·01'
  baseCtx.fillText(monogram, cx, cy + 1)

  baseCtx.restore()
  foilCtx.restore()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = []
  let cur = ''
  for (const word of text.split(' ')) {
    const next = cur ? `${cur} ${word}` : word
    if (cur && ctx.measureText(next).width > maxW) {
      lines.push(cur)
      cur = word
    } else cur = next
  }
  return lines.concat(cur)
}

const FONT_SANS = '"Bricolage Grotesque", "Geist", sans-serif'
const FONT_MONO = '"Geist Mono", ui-monospace, monospace'

/** Front: the only filled face. Section "Travaillons ensemble" printed on the body, empty stub. */
function drawFront(baseCtx: CanvasRenderingContext2D, foilCtx: CanvasRenderingContext2D): void {
  const w = TEX_W
  const h = TEX_H
  const pad = 34
  const left = pad + 46

  foilCtx.fillStyle = 'rgb(0, 128, 0)'
  foilCtx.fillRect(0, 0, w, h)

  baseCtx.clearRect(0, 0, w, h)
  baseCtx.save()
  drawRoundedTicketPath(baseCtx, w, h, 48)
  baseCtx.clip()
  baseCtx.fillStyle = tier.paperHex
  baseCtx.fillRect(0, 0, w, h)
  drawPaperGrain(baseCtx, w, h, false)

  baseCtx.strokeStyle = tier.inkHex
  baseCtx.lineWidth = 2.5
  baseCtx.strokeRect(pad, pad, w - pad * 2, h - pad * 2)
  foilCtx.strokeStyle = 'rgb(235, 220, 64)'
  foilCtx.lineWidth = 4.5
  foilCtx.strokeRect(pad, pad, w - pad * 2, h - pad * 2)

  // Holographic ribbon
  baseCtx.fillStyle = tier.inkHex
  baseCtx.fillRect(pad + 14, 74, w - (pad + 14) * 2, 40)
  foilCtx.fillStyle = 'rgb(235, 215, 96)'
  foilCtx.fillRect(pad + 14, 74, w - (pad + 14) * 2, 40)

  // Emblem (scaled)
  baseCtx.save()
  foilCtx.save()
  const s = 0.6
  const cy = 330
  for (const c of [baseCtx, foilCtx]) {
    c.translate(w / 2, cy)
    c.scale(s, s)
    c.translate(-w / 2, -cy)
  }
  drawGuillochePrismEmblem(baseCtx, foilCtx, w / 2, cy, tier)
  baseCtx.restore()
  foilCtx.restore()

  // Title (embossed)
  baseCtx.textAlign = 'center'
  baseCtx.textBaseline = 'alphabetic'
  baseCtx.font = `800 96px ${FONT_SANS}`
  foilCtx.textAlign = 'center'
  foilCtx.font = `800 96px ${FONT_SANS}`
  TEXT.title.forEach((line, i) => {
    baseCtx.fillStyle = tier.inkHex
    baseCtx.fillText(line, w / 2, 570 + i * 100)
    foilCtx.fillStyle = 'rgb(72, 252, 140)'
    foilCtx.fillText(line, w / 2, 570 + i * 100)
  })

  // Lead paragraph
  baseCtx.font = `500 31px ${FONT_SANS}`
  baseCtx.fillStyle = tier.secondaryInkHex
  wrap(baseCtx, TEXT.lead, w - left * 2).forEach((line, i) => baseCtx.fillText(line, w / 2, 790 + i * 44))

  // Links
  const top = 985
  baseCtx.strokeStyle = tier.secondaryInkHex
  baseCtx.lineWidth = 1
  baseCtx.beginPath()
  baseCtx.moveTo(left, top - 26)
  baseCtx.lineTo(w - left, top - 26)
  baseCtx.stroke()
  TEXT.links.forEach(([label, url], i) => {
    const y = top + 20 + i * 52
    baseCtx.textAlign = 'left'
    baseCtx.font = `700 27px ${FONT_SANS}`
    baseCtx.fillStyle = tier.inkHex
    baseCtx.fillText(label, left, y)
    foilCtx.textAlign = 'left'
    foilCtx.font = `700 27px ${FONT_SANS}`
    foilCtx.fillStyle = 'rgb(75, 250, 210)'
    foilCtx.fillText(label, left, y)
    baseCtx.textAlign = 'right'
    baseCtx.font = `500 19px ${FONT_MONO}`
    baseCtx.fillStyle = tier.secondaryInkHex
    baseCtx.fillText(url, w - left, y)
  })

  // Perforation line + foil strips
  baseCtx.save()
  baseCtx.strokeStyle = tier.inkHex
  baseCtx.lineWidth = 2.2
  baseCtx.setLineDash([10, 12])
  baseCtx.beginPath()
  baseCtx.moveTo(40, PERF_Y)
  baseCtx.lineTo(w - 40, PERF_Y)
  baseCtx.stroke()
  baseCtx.restore()
  foilCtx.fillStyle = 'rgb(240, 210, 180)'
  foilCtx.fillRect(pad + 14, PERF_Y - 16, w - (pad + 14) * 2, 6)
  foilCtx.fillRect(pad + 14, PERF_Y + 10, w - (pad + 14) * 2, 6)

  // Stub label (embossed like the title)
  const stubCy = PERF_Y + (h - PERF_Y) / 2 - 20
  for (const [c, fill] of [[baseCtx, tier.inkHex], [foilCtx, 'rgb(72, 252, 140)']] as const) {
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.font = `800 46px ${FONT_SANS}`
    c.fillStyle = fill
    c.fillText('Détacher pour un email', w / 2, stubCy)
  }
  baseCtx.font = `600 20px ${FONT_MONO}`
  baseCtx.fillStyle = tier.secondaryInkHex
  baseCtx.fillText('✂  - - - - - - - - - - - - - - - - - -  ✂', w / 2, stubCy + 52)

  baseCtx.fillStyle = tier.inkHex
  baseCtx.fillRect(pad + 54, h - pad - 84, w - (pad + 54) * 2, 24)
  foilCtx.fillStyle = 'rgb(235, 235, 200)'
  foilCtx.fillRect(pad + 54, h - pad - 84, w - (pad + 54) * 2, 24)

  baseCtx.restore()
  punchPerforationCutouts(baseCtx, w, false)
}

/** Back: blank card stock; only the tearable stub carries a label. */
function drawBack(baseCtx: CanvasRenderingContext2D, foilCtx: CanvasRenderingContext2D): void {
  const w = TEX_W
  const h = TEX_H
  const pad = 34

  foilCtx.fillStyle = 'rgb(0, 128, 0)'
  foilCtx.fillRect(0, 0, w, h)

  baseCtx.clearRect(0, 0, w, h)
  baseCtx.save()
  drawRoundedTicketPath(baseCtx, w, h, 48)
  baseCtx.clip()
  baseCtx.fillStyle = tier.paperHex
  baseCtx.fillRect(0, 0, w, h)
  drawPaperGrain(baseCtx, w, h, false)

  baseCtx.strokeStyle = tier.inkHex
  baseCtx.lineWidth = 2.5
  baseCtx.strokeRect(pad, pad, w - pad * 2, h - pad * 2)
  foilCtx.strokeStyle = 'rgb(235, 220, 90)'
  foilCtx.lineWidth = 4
  foilCtx.strokeRect(pad, pad, w - pad * 2, h - pad * 2)

  baseCtx.save()
  baseCtx.strokeStyle = tier.inkHex
  baseCtx.lineWidth = 2.2
  baseCtx.setLineDash([10, 12])
  baseCtx.beginPath()
  baseCtx.moveTo(40, PERF_Y)
  baseCtx.lineTo(w - 40, PERF_Y)
  baseCtx.stroke()
  baseCtx.restore()

  // Tearable stub label
  const cx = w / 2
  const cy = PERF_Y + (h - PERF_Y) / 2
  baseCtx.beginPath()
  baseCtx.arc(cx, cy, 120, 0, Math.PI * 2)
  baseCtx.lineWidth = 3
  baseCtx.stroke()
  foilCtx.beginPath()
  foilCtx.arc(cx, cy, 120, 0, Math.PI * 2)
  foilCtx.fillStyle = 'rgb(250, 235, 145)'
  foilCtx.fill()

  baseCtx.textAlign = 'center'
  baseCtx.textBaseline = 'middle'
  baseCtx.fillStyle = tier.inkHex
  baseCtx.font = `800 31px ${FONT_SANS}`
  baseCtx.fillText('Détacher', cx, cy - 20)
  baseCtx.fillText('pour un email', cx, cy + 20)

  baseCtx.restore()
  punchPerforationCutouts(baseCtx, w)
}

export class TicketTextureGenerator {
  public readonly textures: GeneratedTicketTextures
  private canvases: HTMLCanvasElement[]

  constructor() {
    this.canvases = [0, 1, 2, 3].map(() => {
      const c = document.createElement('canvas')
      c.width = TEX_W
      c.height = TEX_H
      return c
    })
    const [frontMap, frontFoilMap, backMap, backFoilMap] = this.canvases.map((c) => {
      const t = new THREE.CanvasTexture(c)
      t.anisotropy = 8
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      return t
    })
    this.textures = { frontMap, frontFoilMap, backMap, backFoilMap }
    this.update()
  }

  /** Redraw (call again once web fonts are loaded). */
  public update(): void {
    const [f, ff, b, bf] = this.canvases.map((c) => c.getContext('2d')!)
    drawFront(f, ff)
    drawBack(b, bf)
    Object.values(this.textures).forEach((t) => (t.needsUpdate = true))
  }
}
