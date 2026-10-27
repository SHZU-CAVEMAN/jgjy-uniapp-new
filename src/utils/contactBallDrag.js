import { computed, ref } from 'vue'

const STORAGE_KEY = 'contact-ball-position'
const BALL_SIZE_RPX = 120
const EDGE_RPX = 24
const DEFAULT_BOTTOM_RPX = 220
const DRAG_THRESHOLD = 5

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getBounds() {
  const system = uni.getSystemInfoSync()
  const width = system.windowWidth || system.screenWidth || 375
  const height = system.windowHeight || system.screenHeight || 667
  const scale = width / 750
  const ballSize = BALL_SIZE_RPX * scale
  const edge = EDGE_RPX * scale
  return {
    edge,
    maxLeft: Math.max(edge, width - ballSize - edge),
    maxTop: Math.max(edge, height - ballSize - edge),
    defaultTop: Math.max(edge, height - ballSize - DEFAULT_BOTTOM_RPX * scale),
  }
}

// 模块级单例：所有页面共享同一份位置状态，拖拽后切页保持一致
const position = ref({ left: 0, top: 0 })
const dragged = ref(false)
const style = computed(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
}))
let bounds = null
let initialized = false
let touchStart = null
let dragStart = null
let hasMoved = false
let suppressClickTimer

function ensureInitialized() {
  bounds = getBounds()
  const saved = uni.getStorageSync(STORAGE_KEY) || {}
  const savedLeft = Number(saved.left)
  const savedTop = Number(saved.top)
  if (!initialized) {
    position.value = {
      left: Number.isFinite(savedLeft) ? clamp(savedLeft, bounds.edge, bounds.maxLeft) : bounds.maxLeft,
      top: Number.isFinite(savedTop) ? clamp(savedTop, bounds.edge, bounds.maxTop) : bounds.defaultTop,
    }
    initialized = true
    return
  }
  position.value = {
    left: clamp(position.value.left, bounds.edge, bounds.maxLeft),
    top: clamp(position.value.top, bounds.edge, bounds.maxTop),
  }
}

function onContactBallTouchStart(event) {
  ensureInitialized()
  const touch = event.touches?.[0]
  if (!touch) return
  touchStart = {
    x: touch.clientX ?? touch.pageX,
    y: touch.clientY ?? touch.pageY,
  }
  dragStart = { ...position.value }
  hasMoved = false
}

function onContactBallTouchMove(event) {
  const touch = event.touches?.[0]
  if (!touch || !touchStart || !dragStart || !bounds) return
  const x = touch.clientX ?? touch.pageX
  const y = touch.clientY ?? touch.pageY
  const deltaX = x - touchStart.x
  const deltaY = y - touchStart.y
  if (!hasMoved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return
  hasMoved = true
  position.value = {
    left: clamp(dragStart.left + deltaX, bounds.edge, bounds.maxLeft),
    top: clamp(dragStart.top + deltaY, bounds.edge, bounds.maxTop),
  }
}

function onContactBallTouchEnd() {
  if (hasMoved) {
    uni.setStorageSync(STORAGE_KEY, position.value)
    dragged.value = true
    clearTimeout(suppressClickTimer)
    suppressClickTimer = setTimeout(() => { dragged.value = false }, 300)
  }
  touchStart = null
  dragStart = null
  hasMoved = false
}

export function useContactBallDrag() {
  ensureInitialized()
  return {
    contactBallStyle: style,
    contactBallDragged: dragged,
    onContactBallTouchStart,
    onContactBallTouchMove,
    onContactBallTouchEnd,
  }
}
