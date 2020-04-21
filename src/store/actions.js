import * as types from './mutation-types'
import { playMode } from '../common/js/confg'
import { shuffle } from '../common/js/utils'

function findSongIndex(list, song) {
  return list.findIndex((item) => {
    return item.mid === song.mid
  })
}

export const handleSongClick = ({ commit, state }, { songlist, index }) => {
  if (state.mode === playMode.random) {
    let randomList = shuffle(songlist)
    commit(types.SET_PLAYLIST, randomList)
    let cIndex = findSongIndex(randomList, songlist[index])
    commit(types.SET_CURRENT_PLAY_INDEX, cIndex)
  } else {
    commit(types.SET_PLAYLIST, songlist)
    commit(types.SET_CURRENT_PLAY_INDEX, index)
  }
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_SEQUENCE_PLAYLIST, songlist)
}

export const handleRandomPlay = ({ commit, state }, { list, currentSong }) => {
  commit(types.SET_SEQUENCE_PLAYLIST, list)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  let index = 0
  if (currentSong && currentSong.mid) {
    index = findSongIndex(randomList, currentSong)
  }
  commit(types.SET_CURRENT_PLAY_INDEX, index)
}
export const handleSearchSong = ({ commit, state }, song) => {
  commit(types.SET_PLAYLIST, new Array(song))
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_CURRENT_PLAY_INDEX, 0)
  commit(types.SET_SEQUENCE_PLAYLIST, new Array(song))
  commit(types.SET_PLAY_MODE, playMode.loop)
}

export const deleteMusic = ({commit, state}, song) => {
  const playlist = state.playlist.slice()
  const index = playlist.findIndex(item => item.mid === song.mid)
  playlist.splice(index, 1)
  commit(types.SET_SEQUENCE_PLAYLIST, playlist)
  commit(types.SET_PLAYLIST, playlist)
  let cIndex
  if (index <= state.currentPlayIndex) {
    cIndex = index + 1
  }
  commit(types.SET_CURRENT_PLAY_INDEX, cIndex)
  if (!playlist.length) {
    commit(types.SET_PLAY_STATE, false)
  }
}

export const deletePlaylist = ({commit}) => {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_PLAYLIST, [])
  commit(types.SET_CURRENT_PLAY_INDEX, -1)
  commit(types.SET_PLAY_STATE, false)
}