/**
 * @param {Function} callback
 * @param {number} wait
 * @return {Function}
 */
export default function debounceFn(callback, wait) {
  let timer

  function f(...args) {
    const context = this
    clearTimeout(timer)

    timer = setTimeout(() => {
      callback.apply(context, args)
    }, wait)
  }

  return f
}
