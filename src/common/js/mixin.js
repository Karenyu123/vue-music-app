import { mapGetters, mapMutations } from 'vuex'
import { getSearchHistory } from './cache'
export const setBottom = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() { 
    this.handleBottom(this.playlist)
  },
  activated() {
    this.handleBottom(this.playlist)
  },
  methods: {
    handleBottom() {
      throw new Error('function handleBottom must be define in methods')
    }
  },
  watch: {
    playlist(newVal) {
      this.handleBottom(newVal)
    } 
  }
}

export const reloadHistory = {
  methods: {
    _getHistoryList() {
      const arr = getSearchHistory()
      this.setHistory(arr)
    },
    ...mapMutations({
      setHistory: 'SET_SEARCH_HISTORY'
    })
  }
}