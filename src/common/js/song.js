class Song {
  constructor({id, mid, singer, name, album, duration, img, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.img = img
    this.url = url
  }
}
export function formatSong(data) {
  return new Song({
    id: id(data.ar || data.artists),
    mid: data.id,
    singer: singer(data.ar || data.artists),
    name: data.name,
    album: (data.al || data.album).name,
    duration: data.dt || data.duration,
    img: data.al ? data.al.picUrl : data.artists[0].img1v1Url,
    url: data.url
  })
}
function singer(item) {
  if (item.length > 1) {
    let str = item.reduce((pre, s, index) => {
      pre += ' / ' + s.name
      return pre
    }, '')
    return str.substr(2)
  }
  return item[0].name
}
function id(item) {
  if (item.length > 1) {
    return item[1].id
  }
  return item[0].id
}