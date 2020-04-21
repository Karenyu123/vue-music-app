function randomNum(min, max) {
  return Math.floor(Math.random()*(max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = randomNum(0, i)
    let a = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = a
  }
  return _arr
}

export function debounce(fun, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay);
  }
}