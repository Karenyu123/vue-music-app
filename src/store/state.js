import { playMode } from '../common/js/confg'
import { getSearchHistory } from '../common/js/cache'
export default {
  singer: {},
  playing: false,
  fullScreen: true,
  playlist: [],
  sequencePlaylist: [],
  currentPlayIndex: 0,
  mode: playMode.sequence,
  disc: {},
  toplist: {},
  searchHistory: getSearchHistory()
}