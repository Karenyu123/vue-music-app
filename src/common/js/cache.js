import storage from 'good-storage'

const HISTORY_KEY = '__history__'
const MAX_LEN = 15
const checkHistory = (arr, newHistory, compareFun, maxLen) => {
  const num = arr.findIndex(compareFun)
  // 如果搜索结果再第一位，就什么不做，不用再存储
  if (num === 0) {
    return arr
  }
  if (num < 0) {
    arr.unshift(newHistory)
  }
  // 如果存在，则删除之前的记录，把新记录加在数组最前面
  if (num > 0) {
    arr.splice(num, 1)
    arr.unshift(newHistory)
  }
  if (maxLen && arr.length >= maxLen) {
    // 如果数组长度超出限制，则删除最后一项
    arr.pop()
  }
  return arr
}
export const setSearchHistory = (history) => {
  const historys = storage.get(HISTORY_KEY, [])
  const historyList = checkHistory(historys, history, (item) => {
    return item === history
  },MAX_LEN)
  storage.set(HISTORY_KEY, historyList)
}

export const getSearchHistory = () => {
  return storage.get(HISTORY_KEY)
}

export const deleteSearchHistory = (i) => {
  const arr = storage.get(HISTORY_KEY)
  arr.splice(i, 1)
  storage.set(HISTORY_KEY, arr)
}
export const removeAllHistory = () => {
  storage.remove(HISTORY_KEY)
}