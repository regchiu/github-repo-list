import { ref, reactive, computed, unref } from 'vue'
import debounceFn from '@/utils/debounce-fn'
import throttleFn from '@/utils/throttle-fn'
import useEventListener from '../useEventListener'

const none = () => {}

const ARRIVED_STATE_THRESHOLD_PIXELS = 1

export default function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = none,
    onScroll = none,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions = {
      capture: false,
      passive: true
    },
    behavior = 'auto'
  } = options

  const internalX = ref(0)
  const internalY = ref(0)

  const x = computed({
    get() {
      return internalX.value
    },
    set(value) {
      // eslint-disable-next-line no-use-before-define
      scrollTo(value, undefined)
    }
  })

  const y = computed({
    get() {
      return internalY.value
    },
    set(value) {
      // eslint-disable-next-line no-use-before-define
      scrollTo(undefined, value)
    }
  })

  function scrollTo(xValue, yValue) {
    const el = unref(element)

    if (!el) {
      return
    }

    ;(el instanceof Document ? document.body : el)?.scrollTo({
      top: unref(yValue) ?? y.value,
      left: unref(xValue) ?? x.value,
      behavior: unref(behavior)
    })
  }

  const isScrolling = ref(false)
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false
  })
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false
  })

  const onScrollEnd = (event) => {
    if (!isScrolling.value) {
      return
    }

    isScrolling.value = false
    directions.left = false
    directions.right = false
    directions.top = false
    directions.bottom = false
    onStop(event)
  }

  const onScrollEndDebounced = debounceFn(onScrollEnd, throttle + idle)

  const onScrollHandler = (event) => {
    const eventTarget = event.target === document ? event.target.documentElement : event.target

    const { display, flexDirection } = window.getComputedStyle(eventTarget)

    const { scrollLeft } = eventTarget
    directions.left = scrollLeft < internalX.value
    directions.right = scrollLeft > internalX.value

    const left = Math.abs(scrollLeft) <= 0 + (offset.left || 0)
    const right =
      Math.abs(scrollLeft) + eventTarget.clientWidth >=
      eventTarget.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.left = right
      arrivedState.right = left
    } else {
      arrivedState.left = left
      arrivedState.right = right
    }

    internalX.value = scrollLeft

    let { scrollTop } = eventTarget

    if (event.target === document && !scrollTop) {
      scrollTop = document.body.scrollTop
    }

    directions.top = scrollTop < internalY.value
    directions.bottom = scrollTop > internalY.value
    const top = Math.abs(scrollTop) <= 0 + (offset.top || 0)
    const bottom =
      Math.abs(scrollTop) + eventTarget.clientHeight >=
      eventTarget.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.top = bottom
      arrivedState.bottom = top
    } else {
      arrivedState.top = top
      arrivedState.bottom = bottom
    }

    internalY.value = scrollTop

    isScrolling.value = true
    onScrollEndDebounced(event)
    onScroll(event)
  }

  useEventListener(
    element,
    'scroll',
    throttle ? throttleFn(onScrollHandler, throttle) : onScrollHandler,
    eventListenerOptions
  )

  useEventListener(element, 'scrollend', onScrollEnd, eventListenerOptions)

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions
  }
}
