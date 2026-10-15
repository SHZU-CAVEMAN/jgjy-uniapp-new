const MIN_SWIPE_DISTANCE = 56
const HORIZONTAL_DOMINANCE = 1.25

export function createHorizontalSwipeHandlers(onSwipeLeft, onSwipeRight) {
  let startPoint = null

  function pointFromTouch(touch) {
    return {
      x: touch.clientX ?? touch.pageX,
      y: touch.clientY ?? touch.pageY,
    }
  }

  function onTouchStart(event) {
    const touch = event.touches?.[0]
    startPoint = touch ? pointFromTouch(touch) : null
  }

  function onTouchEnd(event) {
    const touch = event.changedTouches?.[0]
    if (!startPoint || !touch) return

    const endPoint = pointFromTouch(touch)
    const deltaX = endPoint.x - startPoint.x
    const deltaY = endPoint.y - startPoint.y
    startPoint = null

    if (
      Math.abs(deltaX) < MIN_SWIPE_DISTANCE ||
      Math.abs(deltaX) < Math.abs(deltaY) * HORIZONTAL_DOMINANCE
    ) return

    if (deltaX < 0) onSwipeLeft()
    else onSwipeRight()
  }

  function onTouchCancel() {
    startPoint = null
  }

  return { onTouchStart, onTouchEnd, onTouchCancel }
}