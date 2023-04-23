/**
 * @param {Function} callback
 * @param {number} wait
 * @return {Function}
 */
export default function throttleFn(callback, wait) {
  let timer
  let last

  function f(...args) {
    const context = this
    const now = Date.now()

    if (last && now < last + wait) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        callback.apply(context, args)
      }, wait)
    } else {
      last = now
      callback.apply(context, args)
    }
  }

  return f
}
