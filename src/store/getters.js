export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequencePlaylist = state => state.sequencePlaylist
export const mode = state => state.mode
export const currentPlayIndex = state => state.currentPlayIndex
export const currentSong = state => {
  return state.playlist[state.currentPlayIndex] || {}
}
export const disc = state => state.disc
export const toplist = state => state.toplist
export const searchHistory = state => state.searchHistory