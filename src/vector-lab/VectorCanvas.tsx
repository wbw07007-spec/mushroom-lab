import { useEffect, useRef, useState } from 'react'
import {
  Box3, BufferGeometry, ConeGeometry, CylinderGeometry, Group, Line, LineBasicMaterial,
  LineDashedMaterial, Mesh, MeshBasicMaterial, OrthographicCamera, Quaternion, Scene, SphereGeometry,
  Vector3, WebGLRenderer,
} from 'three'
import type { Material, Object3D } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Vec } from './vector-math'
import type { Diagram } from './vector-scenes'

type View = 'space' | 'xy' | 'xz' | 'yz'
type CameraAction = 'reset' | 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'fit'
type CameraCommand = { id: number; action: CameraAction }
type CanvasProps = {
  diagram: Diagram
  highlighted: readonly string[]
  guides: boolean
  view: View
  command: CameraCommand
  unavailable: string
  label: string
  guideLabel?: string
}
type RendererInputs = Pick<CanvasProps, 'diagram' | 'highlighted' | 'guides'>
type ProjectedLabel = { at: Vector3; node: HTMLSpanElement; priority: number }
type Rect = { x: number; y: number; w: number; h: number }

const axisColors = ['#864834', '#346e5e', '#495d8f']
const presets: Record<View, { towardCamera: Vec; up: Vec }> = {
  space: { towardCamera: [1.32, -1.65, 1.22], up: [0, 0, 1] },
  xy: { towardCamera: [0, 0, 1], up: [0, 1, 0] },
  xz: { towardCamera: [0, -1, 0], up: [0, 0, 1] },
  yz: { towardCamera: [1, 0, 0], up: [0, 0, 1] },
}
const worldUp = new Vector3(0, 1, 0)
const toThree = (v: Vec) => new Vector3(...v)
const isFiniteVector = (vector: Vec) => vector.every(Number.isFinite)
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi))
const rectanglesOverlap = (a: Rect, b: Rect) =>
  a.x < b.x+b.w+3 && a.x+a.w+3 > b.x && a.y < b.y+b.h+3 && a.y+a.h+3 > b.y

function releaseGeometry(group: Object3D) {
  const materials = new Set<Material>()
  group.traverse(object => {
    if (!(object instanceof Mesh || object instanceof Line)) return
    object.geometry.dispose()
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
  })
  materials.forEach(material => material.dispose())
}

function diagramPositions(diagram: Diagram, includeRelationPoints: boolean) {
  // Solving only two equations can also yield remote candidate points on skew
  // lines. Include those, as well as the intersection, when the learner fits.
  const points = diagram.points
    .filter(point => includeRelationPoints || !/intersect|crossing|^p[12]$/i.test(point.id))
    .map(point => point.at)
  return [...points, ...diagram.arrows.flatMap(arrow => [arrow.from, arrow.to]), ...diagram.lines.map(line => line.point)]
    .filter(isFiniteVector).map(toThree)
}

function createCanvas(host: HTMLDivElement, initialView: View, initial: RendererInputs, onUnavailable: (unavailable: boolean) => void) {
  const canvas = document.createElement('canvas')
  let context: WebGL2RenderingContext | null = null
  let renderer: WebGLRenderer
  try {
    context = canvas.getContext('webgl2', { antialias: true, alpha: true })
    if (!context) return
    renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true })
  } catch {
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return
  }

  const labelsLayer = document.createElement('div')
  labelsLayer.setAttribute('aria-hidden', 'true')
  Object.assign(labelsLayer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' })
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' })
  canvas.setAttribute('aria-hidden', 'true')
  host.append(canvas, labelsLayer)
  renderer.setClearColor('#fffefa', 1)
  const scene = new Scene()
  const content = new Group()
  scene.add(content)
  const camera = new OrthographicCamera(-1, 1, 1, -1)

  let controls: OrbitControls | undefined
  let current = initial
  let view = initialView
  let frame = 0
  let labels: ProjectedLabel[] = []
  let center = new Vector3()
  let radius = 5
  let width = 0
  let height = 0
  let manual = false
  let lost = false

  function placeLabels() {
    const used: Rect[] = []
    for (const item of labels) {
      const p = item.at.clone().project(camera)
      if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || Math.abs(p.z) > 1) {
        item.node.hidden = true
        continue
      }
      item.node.hidden = false
      const w = item.node.offsetWidth
      const h = item.node.offsetHeight
      const anchorX = (p.x+1)*width/2
      const anchorY = (1-p.y)*height/2
      const offsets = [[8, -h-6], [8, 6], [-w-8, -h-6], [-w-8, 6], [8, -2*h-8], [-w-8, h+8]]
      const candidates = offsets.map(([dx, dy]) => ({
        x: clamp(anchorX+dx, 2, Math.max(2, width-w-2)),
        y: clamp(anchorY+dy, 2, Math.max(2, height-h-2)), w, h,
      }))
      const choice = candidates.find(candidate => !used.some(other => rectanglesOverlap(candidate, other))) ?? candidates[0]
      used.push(choice)
      item.node.style.left = choice.x + 'px'
      item.node.style.top = choice.y + 'px'
    }
  }

  function queueRender() {
    if (frame || lost || !width || !height) return
    frame = requestAnimationFrame(() => {
      frame = 0
      try {
        renderer.render(scene, camera)
        placeLabels()
      } catch {
        showUnavailable()
      }
    })
  }

  function sizeCamera() {
    const aspect = width / Math.max(height, 1)
    const halfWidth = radius * Math.max(1, aspect)
    const halfHeight = radius * Math.max(1, 1/Math.max(aspect, 0.05))
    camera.left = -halfWidth
    camera.right = halfWidth
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.near = Math.max(0.001, radius / 100)
    camera.far = radius * 38
    camera.updateProjectionMatrix()
    queueRender()
  }

  function resize() {
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    sizeCamera()
  }

  function labelAt(at: Vector3, value: string, color: string, priority: number, highlighted = false) {
    const node = document.createElement('span')
    node.className = 'vector-canvas-label'
    node.textContent = value
    node.style.setProperty('--vector-label-color', color)
    node.style.position = 'absolute'
    node.style.whiteSpace = 'nowrap'
    if (highlighted) node.dataset.highlighted = 'true'
    if (priority < 0) node.dataset.tick = 'true'
    labelsLayer.append(node)
    labels.push({ at, node, priority })
  }

  function stroke(points: Vector3[], color: string, opacity: number, dash?: [number, number], overlay = false) {
    const geometry = new BufferGeometry().setFromPoints(points)
    const parameters = { color, opacity, transparent: opacity < 1, depthTest: !overlay, depthWrite: !overlay }
    const material = dash
      ? new LineDashedMaterial({ ...parameters, dashSize: dash[0], gapSize: dash[1] })
      : new LineBasicMaterial(parameters)
    const line = new Line(geometry, material)
    if (dash) line.computeLineDistances()
    if (overlay) line.renderOrder = 2
    content.add(line)
  }

  function cylinder(from: Vector3, to: Vector3, r: number, color: string, opacity: number) {
    const delta = to.clone().sub(from)
    const length = delta.length()
    if (!length) return
    const mesh = new Mesh(new CylinderGeometry(r, r, length, 10),
      new MeshBasicMaterial({ color, opacity, transparent: opacity < 1 }))
    mesh.position.copy(from).lerp(to, 0.5)
    mesh.quaternion.setFromUnitVectors(worldUp, delta.normalize())
    content.add(mesh)
  }

  function dot(at: Vector3, r: number, color: string, opacity: number) {
    const mesh = new Mesh(new SphereGeometry(r, 14, 10),
      new MeshBasicMaterial({ color, opacity, transparent: opacity < 1 }))
    mesh.position.copy(at)
    content.add(mesh)
  }

  function rebuild() {
    releaseGeometry(content)
    content.clear()
    labelsLayer.replaceChildren()
    labels = []
    const { diagram, highlighted, guides } = current
    const emphasis = new Set(highlighted)
    const thickness = radius * 0.006
    const axesLength = radius * 0.92
    const step = 10 ** Math.floor(Math.log10(axesLength/3))
    const gridStep = step * (axesLength/step > 10 ? 5 : axesLength/step > 5 ? 2 : 1)
    const gridWidth = Math.max(gridStep, Math.floor(axesLength / gridStep) * gridStep)
    const axisA = view === 'yz' ? 1 : 0
    const axisB = view === 'xz' || view === 'yz' ? 2 : 1
    const gridNormal = 3-axisA-axisB
    const gridPoint = (a: number, b: number) => new Vector3().setComponent(axisA, a).setComponent(axisB, b)

    if (guides) {
      for (let i = -Math.round(gridWidth/gridStep); i <= Math.round(gridWidth/gridStep); i++) {
        if (!i) continue
        const level = i * gridStep
        stroke([gridPoint(-gridWidth, level), gridPoint(gridWidth, level)], '#a5b4a8', 0.25)
        stroke([gridPoint(level, -gridWidth), gridPoint(level, gridWidth)], '#a5b4a8', 0.25)
      }
    }

    const hiddenAxis = { space: -1, xy: 2, xz: 1, yz: 0 }[view]
    for (let i = 0; i < 3; i++) {
      if (i === hiddenAxis) continue
      const end = new Vector3().setComponent(i, axesLength)
      const negative = end.clone().negate()
      const origin = new Vector3()
      stroke([negative, origin], axisColors[i], 0.32, [thickness*5, thickness*3])
      stroke([origin, end], axisColors[i], 0.88)
      if (guides) {
        const tickPos = new Vector3().setComponent(i, gridStep)
        const tickDirection = new Vector3().setComponent((i+1)%3, thickness * 4)
        stroke([tickPos.clone().sub(tickDirection), tickPos.clone().add(tickDirection)], axisColors[i], 0.6)
        labelAt(tickPos, String(gridStep), axisColors[i], -1)
      }
      labelAt(end, 'xyz'[i], axisColors[i], 0)
    }

    for (const object of diagram.lines) {
      const direction = toThree(object.direction)
      if (!isFiniteVector(object.point) || !isFiniteVector(object.direction) || direction.lengthSq() === 0) continue
      direction.normalize()
      const base = toThree(object.point)
      const nearest = base.clone().addScaledVector(direction, center.clone().sub(base).dot(direction))
      const active = emphasis.has(object.id)
      const span = radius * 16
      stroke([nearest.clone().addScaledVector(direction, -span), nearest.clone().addScaledVector(direction, span)],
        object.color, active ? 1 : 0.75, [thickness * 17, thickness * 9], true)
      if (active) cylinder(nearest.clone().addScaledVector(direction, -span), nearest.clone().addScaledVector(direction, span),
        thickness * 1.75, object.color, 0.28)
      labelAt(nearest.clone().addScaledVector(direction, radius*0.37), object.label, object.color, active ? 3 : 1, active)
    }

    for (const arrow of diagram.arrows) {
      if (!isFiniteVector(arrow.from) || !isFiniteVector(arrow.to)) continue
      const from = toThree(arrow.from)
      const to = toThree(arrow.to)
      const active = emphasis.has(arrow.id)
      const delta = to.clone().sub(from)
      const length = delta.length()
      if (length === 0) {
        dot(to, thickness * (active ? 3 : 2.4), arrow.color, 0.62)
        labelAt(to, arrow.label, arrow.color, active ? 3 : 1, active)
        continue
      }
      const headLength = Math.min(thickness * (active ? 12 : 9), length * 0.48)
      const headRadius = Math.min(thickness * (active ? 4 : 3), length * 0.22)
      const direction = delta.normalize()
      const tail = to.clone().addScaledVector(direction, -headLength)
      cylinder(from, tail, Math.min(thickness * (active ? 1.9 : 1.1), length*0.08), arrow.color, 1)
      const head = new Mesh(new ConeGeometry(headRadius, headLength, 12), new MeshBasicMaterial({ color: arrow.color }))
      head.position.copy(tail).lerp(to, 0.5)
      head.quaternion.setFromUnitVectors(worldUp, direction)
      content.add(head)
      labelAt(from.clone().lerp(to, 0.62), arrow.label, arrow.color, active ? 3 : 1, active)
    }

    for (const point of diagram.points) {
      if (!isFiniteVector(point.at)) continue
      const at = toThree(point.at)
      const active = emphasis.has(point.id)
      if (guides && at.lengthSq()) {
        const a = at.getComponent(axisA)
        const b = at.getComponent(axisB)
        const foot = at.clone().setComponent(gridNormal, 0)
        stroke([at, foot, gridPoint(a, 0)], point.color, 0.4, [thickness*8, thickness*5])
        stroke([foot, gridPoint(0, b)], point.color, 0.4, [thickness*8, thickness*5])
      }
      if (active) dot(at, thickness * 4.6, point.color, 0.26)
      dot(at, thickness * (active ? 2.9 : 2.1), point.color, 1)
      labelAt(at, point.label, point.color, active ? 4 : 2, active)
    }
    labels.sort((a, b) => b.priority - a.priority)
    queueRender()
  }

  function markManual() { manual = true }

  function disconnect() {
    controls?.removeEventListener('change', queueRender)
    controls?.removeEventListener('start', markManual)
    controls?.dispose()
    controls = undefined
  }

  function connect() {
    controls = new OrbitControls(camera, canvas)
    controls.enableRotate = view === 'space'
    controls.minZoom = 0.16
    controls.maxZoom = 10
    controls.target.copy(center)
    controls.update()
    canvas.style.touchAction = view === 'space' ? 'none' : 'pan-y'
    controls.addEventListener('change', queueRender)
    controls.addEventListener('start', markManual)
  }

  function frameView(includeRelationPoints: boolean, preserveDirection = false) {
    const positions = diagramPositions(current.diagram, includeRelationPoints)
    const bounds = new Box3().setFromPoints([new Vector3(), ...positions])
    const target = includeRelationPoints ? bounds.getCenter(new Vector3()) : new Vector3()
    const needed = Math.max(2.5, ...positions.map(p => p.distanceTo(target))) * 1.3
    const direction = preserveDirection ? camera.position.clone().sub(controls?.target ?? center).normalize() : toThree(presets[view].towardCamera).normalize()
    disconnect()
    center = target
    radius = needed
    camera.up.copy(toThree(presets[view].up))
    camera.position.copy(center).addScaledVector(direction, radius*3.2)
    camera.zoom = 1
    camera.lookAt(center)
    sizeCamera()
    connect()
    rebuild()
  }

  function setView(next: View) {
    if (view === next) return
    view = next
    frameView(false)
    manual = false
  }

  function update(data: RendererInputs) {
    current = data
    const needed = Math.max(2.5, ...diagramPositions(current.diagram, false).map(p => p.distanceTo(center))) * 1.3
    if (!manual && needed > radius*1.05) frameView(false, true)
    else rebuild()
  }

  function apply(command: CameraAction) {
    if (command === 'reset' || command === 'fit') {
      frameView(command === 'fit', command === 'fit')
      manual = command === 'fit'
    } else if (controls) {
      manual = true
      if (command === 'in' || command === 'out') {
        camera.zoom = clamp(camera.zoom * (command === 'in' ? 1.22 : 1/1.22), controls.minZoom, controls.maxZoom)
        camera.updateProjectionMatrix()
      } else if (view === 'space') {
        const offset = camera.position.clone().sub(controls.target)
        const axis = command === 'left' || command === 'right'
          ? camera.up.clone()
          : new Vector3().crossVectors(camera.up, offset).normalize()
        const quaternion = new Quaternion().setFromAxisAngle(axis, (command === 'left' || command === 'up' ? 1 : -1) * Math.PI/12)
        camera.position.copy(controls.target).add(offset.applyQuaternion(quaternion))
      }
      controls.update()
      queueRender()
    }
  }

  function showUnavailable() {
    lost = true
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    canvas.style.visibility = labelsLayer.style.visibility = 'hidden'
    onUnavailable(true)
  }
  function onLost(event: Event) {
    event.preventDefault()
    showUnavailable()
  }
  function onRestored() {
    lost = false
    canvas.style.visibility = labelsLayer.style.visibility = 'visible'
    onUnavailable(false)
    queueRender()
  }

  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize)
  if (observer) observer.observe(host)
  else window.addEventListener('resize', resize)
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  resize()
  frameView(false)

  return {
    setView, update, apply,
    dispose() {
      observer?.disconnect()
      if (!observer) window.removeEventListener('resize', resize)
      disconnect()
      if (frame) cancelAnimationFrame(frame)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      releaseGeometry(content)
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      labelsLayer.remove()
    },
  }
}

export function VectorCanvas({ unavailable, label, guideLabel, diagram, highlighted, guides, view, command }: CanvasProps) {
  const host = useRef<HTMLDivElement>(null)
  const engine = useRef<ReturnType<typeof createCanvas>>(undefined)
  const first = useRef({ diagram, highlighted, guides, view })
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!host.current) return
    const instance = createCanvas(host.current, first.current.view, first.current, setFailed)
    engine.current = instance
    setFailed(!instance)
    return () => {
      engine.current = undefined
      instance?.dispose()
    }
  }, [])

  useEffect(() => engine.current?.setView(view), [view])
  useEffect(() => engine.current?.update({ diagram, highlighted, guides }), [diagram, highlighted, guides])
  useEffect(() => {
    if (command.id > 0) engine.current?.apply(command.action)
  }, [command.id, command.action])

  return <div className="vector-canvas" ref={host} role={failed ? undefined : 'img'} aria-label={label} title={guideLabel}>
    {failed && <div className="vector-canvas-fallback" role="status">{unavailable}</div>}
  </div>
}
