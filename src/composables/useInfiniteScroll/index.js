import { reactive, ref, computed, unref, nextTick, watch } from 'vue'
import useScroll from '../useScroll'

export default function useInfiniteScroll(element, onLoadMore, options = {}) {
  const { direction = 'bottom', interval = 100 } = options

  const state = reactive(
    useScroll(element, {
      ...options,
      offset: {
        [direction]: options.distance ?? 0,
        ...options.offset
      }
    })
  )

  const promise = ref()
  const isLoading = computed(() => !!promise.value)

  function checkAndLoad() {
    const el = unref(element)

    if (!el) {
      return
    }

    const isNarrower =
      direction === 'bottom' || direction === 'top'
        ? el.scrollHeight <= el.clientHeight
        : el.scrollWidth <= el.clientWidth

    if (state.arrivedState[direction] || isNarrower) {
      if (!promise.value) {
        promise.value = Promise.all([
          onLoadMore(state),
          // eslint-disable-next-line no-promise-executor-return
          new Promise((resolve) => setTimeout(resolve, interval))
        ]).finally(() => {
          promise.value = null
          nextTick(() => checkAndLoad())
        })
      }
    }
  }

  watch(() => [state.arrivedState[direction], unref(element)], checkAndLoad, { immediate: true })

  return {
    isLoading
  }
}
