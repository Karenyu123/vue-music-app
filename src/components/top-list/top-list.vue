<template>
  <transition name="slide">
    <music-list :rank="true" :songList="songs" :title="title" :bg="bg" ></music-list>
  </transition>
</template>
<script>
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { formatSong } from '../../common/js/song'
  export default {
    props: {
      id: {}
    },
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.toplist.name
      },
      bg() {
        return this.toplist.coverImgUrl
      },
      ...mapGetters(['toplist'])
    },
    created() {
      this._fetchRankSongList()
    },
    methods: {
      async _fetchRankSongList() {
        if(!this.toplist.id) {
          this.$router.push('/')
          return
        }
        const { data } = await this.$http.get(`/top/list?idx=${this.toplist.idx}`)
        this.songs = this._normalizeSong(data.playlist.tracks)
      },
      _normalizeSong(list) {
        let song = []
        list.map((item) => {
          this.$http.get(`/song/url?id=${item.id}`).then((res) => {
            item.url = res.data.data[0].url
            song.push(formatSong(item))
          })
        })
        return song
      }
    },
    components: {
      MusicList
    },
    watch: {
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>