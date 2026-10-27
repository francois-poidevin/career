import './ticket.css'
import * as THREE from 'three'
import { SoundEngine } from './soundEngine'
import { TicketTextureGenerator } from './ticketTextureGenerator'
import { COLS, NUM_COLS, TICKET_HEIGHT, TICKET_WIDTH, VerletPaperEngine } from './verletPaperEngine'
import { createContactShadowMaterial, createHolographicPassMaterial } from './holographicShader'

const MAILTO = 'mailto:francois.poidevin@yahoo.fr?subject=' + encodeURIComponent('Travaillons ensemble')
const SEAM_V = 0.28 // perforation, UV.y

const stageEl = document.getElementById('ticket-stage') as HTMLElement
const hintEl = document.getElementById('ticket-hint') as HTMLElement
const pill = document.getElementById('ticket-pill') as HTMLElement
const resetBtn = document.getElementById('ticket-reset') as HTMLButtonElement

const HINT_FRONT = 'Déchire le talon « Détacher pour un email » pour m\'écrire. Double-clic : retourner le billet.'
const HINT_BACK = 'Fais glisser le doigt le long des pointillés, ou tire le talon vers le bas. Double-clic : retourner.'

const sound = new SoundEngine()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
camera.position.set(0, -0.04, 6.85)
camera.lookAt(0, -0.04, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
stageEl.prepend(renderer.domElement)

const texGen = new TicketTextureGenerator()

// The mailto fires once the stub is fully torn off, whichever face is showing.
let mailTimer = 0
const verlet = new VerletPaperEngine(
  (_col, p) => sound.playFiberRipTick(p, 1),
  () => {
    sound.playStubDetachChord()
    resetBtn.hidden = false
    hintEl.textContent = 'Ouverture de ton client mail…'
    mailTimer = window.setTimeout(() => (location.href = MAILTO), 900)
  }
)

const shadow = createContactShadowMaterial(texGen.textures.frontMap)
shadow.setDarkTheme(true) // section background is dark teal
const shadowMesh = new THREE.Mesh(verlet.geometry, shadow.material)
shadowMesh.renderOrder = 1
scene.add(shadowMesh)

const pass = createHolographicPassMaterial(texGen.textures)
const u = pass.uniforms
const passMesh = new THREE.Mesh(verlet.geometry, pass.material)
passMesh.renderOrder = 2
scene.add(passMesh)

// Fonts come from Google Fonts: redraw canvases once they are in.
Promise.all([
  document.fonts.load('800 96px "Bricolage Grotesque"'),
  document.fonts.load('500 31px "Bricolage Grotesque"'),
  document.fonts.load('500 19px "Geist Mono"')
]).then(() => texGen.update(), () => {})

// ---------- actions ----------
const flip = () => {
  const f = verlet.toggleFlip()
  hintEl.textContent = f ? HINT_BACK : HINT_FRONT
  sound.playCardFlexWhoosh(0.7)
}
const reset = () => {
  clearTimeout(mailTimer)
  verlet.resetPass(true)
  resetBtn.hidden = true
  hintEl.textContent = verlet.isFlipped ? HINT_BACK : HINT_FRONT
  u.uTearProgress.value = 0
  sound.playCardFlexWhoosh(0.8)
}
resetBtn.addEventListener('click', reset)
stageEl.addEventListener('dblclick', flip)
hintEl.textContent = HINT_FRONT

// ---------- pointer ----------
const ray = new THREE.Raycaster()
const ndc = new THREE.Vector2()
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const hitPt = new THREE.Vector3()
let down = false
let slicing = false
let lastU: number | null = null
let seamHover = 0

const setPointer = (e: PointerEvent) => {
  const r = stageEl.getBoundingClientRect()
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  pill.style.left = `${e.clientX - r.left}px`
  pill.style.top = `${e.clientY - r.top}px`
  ray.setFromCamera(ndc, camera)
}
const showPill = (t: string | null) => {
  if (t) pill.textContent = t
  pill.classList.toggle('is-visible', !!t)
}
const tornPct = () => Math.round((1 - verlet.getIntactSeamCount() / NUM_COLS) * 100)

stageEl.addEventListener('pointerdown', (e) => {
  setPointer(e)
  down = true
  stageEl.setPointerCapture(e.pointerId)
  const hit = ray.intersectObject(passMesh, false)[0]
  if (hit?.uv) {
    const uv = hit.uv
    if (Math.abs(uv.y - SEAM_V) < 0.055 && !verlet.isFullyDetached) {
      slicing = true
      lastU = uv.x
      verlet.sliceSeamAtU(verlet.isFlipped ? 1 - uv.x : uv.x, 1.5)
      return
    }
    const col = Math.round((verlet.isFlipped ? 1 - uv.x : uv.x) * COLS)
    const stub = uv.y < SEAM_V
    const row = stub
      ? Math.min(26 + Math.round(((SEAM_V - uv.y) / SEAM_V) * 10), 35)
      : Math.min(24, Math.round(((1 - uv.y) / (1 - SEAM_V)) * 24))
    verlet.grabbedIndex = verlet.idx(row, col)
    verlet.isDraggingStub = stub
    verlet.grabbedWorldPoint.copy(hit.point)
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), hit.point)
    sound.playCardFlexWhoosh(0.45)
  } else {
    plane.set(new THREE.Vector3(0, 0, 1), 0)
    if (ray.ray.intersectPlane(plane, hitPt) && Math.abs(hitPt.y - (0.5 - 0.72) * TICKET_HEIGHT) < 0.26 && !verlet.isFullyDetached) {
      slicing = true
      lastU = hitPt.x / TICKET_WIDTH + 0.5
    }
  }
})

stageEl.addEventListener('pointermove', (e) => {
  setPointer(e)
  verlet.hoverTiltY = ndc.x * 0.34
  verlet.hoverTiltX = -ndc.y * 0.22

  if (down && slicing && !verlet.isFullyDetached) {
    plane.set(new THREE.Vector3(0, 0, 1), 0)
    if (ray.ray.intersectPlane(plane, hitPt)) {
      const raw = hitPt.x / TICKET_WIDTH + 0.5
      const x = verlet.isFlipped ? 1 - raw : raw
      if (lastU !== null) {
        for (let s = 0; s <= 8; s++) {
          const v = lastU + (x - lastU) * (s / 8)
          if (v >= -0.05 && v <= 1.05) verlet.sliceSeamAtU(Math.max(0, Math.min(1, v)), 1.55)
        }
      }
      lastU = x
      u.uPointerUv.value.set(Math.max(0, Math.min(1, raw)), SEAM_V)
      seamHover = 1
      showPill(`Déchirure ${tornPct()}%`)
    }
    return
  }
  if (down && verlet.grabbedIndex !== -1) {
    if (ray.ray.intersectPlane(plane, hitPt)) {
      verlet.grabbedWorldPoint.copy(hitPt)
      verlet.grabbedWorldPoint.z = Math.min(0.65, 0.22 + Math.hypot(ndc.x, ndc.y) * 0.28)
      if (verlet.isDraggingStub && !verlet.isFullyDetached) showPill(tornPct() ? `Déchirure ${tornPct()}%` : 'Tire vers le bas')
    }
    return
  }
  const uv = ray.intersectObject(passMesh, false)[0]?.uv
  if (uv && !verlet.isFullyDetached) {
    u.uPointerUv.value.copy(uv)
    if (Math.abs(uv.y - SEAM_V) < 0.055) { seamHover = 1; showPill('✂ Déchire ici') }
    else if (uv.y < SEAM_V) { seamHover = 0.45; showPill('Tire le talon') }
    else { seamHover = 0; showPill(null) }
  } else { seamHover = 0; showPill(null) }
})

const release = () => {
  down = slicing = false
  lastU = null
  if (verlet.grabbedIndex !== -1) {
    const intact = verlet.getIntactSeamCount()
    if (verlet.isDraggingStub && intact > 0 && intact <= Math.floor(NUM_COLS * 0.35)) verlet.triggerZipperTear(1)
    verlet.grabbedIndex = -1
    verlet.isDraggingStub = false
  }
  showPill(null)
}
stageEl.addEventListener('pointerup', release)
stageEl.addEventListener('pointercancel', release)
stageEl.addEventListener('pointerleave', () => {
  if (!down) { verlet.hoverTiltX = verlet.hoverTiltY = 0; seamHover = 0; showPill(null) }
})

// ---------- loop (paused while off-screen) ----------
const resize = () => {
  const w = stageEl.clientWidth, h = stageEl.clientHeight
  if (!w || !h) return
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
new ResizeObserver(resize).observe(stageEl)
resize()

const clock = new THREE.Clock()
let visible = false
const frame = () => {
  if (!visible) return
  requestAnimationFrame(frame)
  const dt = clock.getDelta()
  const t = clock.elapsedTime
  verlet.step(dt, t)
  u.uTime.value = t
  u.uSeamHoverIntensity.value += (seamHover - u.uSeamHoverIntensity.value) * 0.15
  u.uTearProgress.value = 1 - verlet.getIntactSeamCount() / NUM_COLS
  renderer.render(scene, camera)
}
new IntersectionObserver(([e]) => {
  const was = visible
  visible = e.isIntersecting
  if (visible && !was) { clock.getDelta(); requestAnimationFrame(frame) }
}, { rootMargin: '10% 0px' }).observe(stageEl)
