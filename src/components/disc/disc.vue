<template>
  <transition name="slide">
    <music-list :songList="songs" :title="title" :bg="bgImage" />
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { formatSong } from '../../common/js/song'
  export default {
    name: 'disc',
    props: {
      id: {}
    },
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.disc.name
      },
      bgImage() {
        return this.disc.coverImgUrl
      },
      ...mapGetters(['disc'])
    },
    created() {
      this._fetchDisc()
    },
    methods: {
      async _fetchDisc() {
        if(!this.disc.id) {
          this.$router.push('/rank')
        }
        const { data } = await this.$http.get(`/playlist/detail?id=${this.id}`)
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"
  .singer-detail
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    z-index 100
    background $color-background
  .slide-enter-active, .slide-leave-active
    transition all .5s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>