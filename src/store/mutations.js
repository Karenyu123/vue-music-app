import * as types from './mutation-types'

export default {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAY_STATE](state, playing) {
    state.playing = playing
  },
  [types.SET_FULLSCREEN](state, fullScreen) {
    state.fullScreen = fullScreen
  },
  [types.SET_PLAYLIST](state, playlist) {
    state.playlist = playlist
  },
  [types.SET_SEQUENCE_PLAYLIST](state, sequencePlaylist) {
    state.sequencePlaylist = sequencePlaylist
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_PLAY_INDEX](state, index) {
    state.currentPlayIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST](state, list) {
    state.toplist = list
  },
  [types.SET_SEARCH_HISTORY](state, historys) {
    state.searchHistory = historys
  }
}