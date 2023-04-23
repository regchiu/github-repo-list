import { onMounted, onUnmounted, unref } from 'vue'

export default function useEventListener(target, type, listener, options = {}) {
  onMounted(() => unref(target).addEventListener(type, listener, options))
  onUnmounted(() => unref(target).removeEventListener(type, listener))
}
