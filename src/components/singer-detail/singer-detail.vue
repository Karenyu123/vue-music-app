<template>
  <transition name="slide">
    <music-list :songList="songList" :title="title" :bg="bg"/>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'

import { mapGetters } from 'vuex'
import { formatSong } from '../../common/js/song'
  export default {
    name: 'singer-detail',
    props: {
      id: {}
    },
    components: {
      MusicList
    },
    data() {
      return {
        singerDetail: {},
        songList: [],
        songUrl: ''
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bg() {
        return this.singer.avatar
      },
      ...mapGetters(['singer']) 
    },
    created() {
      this._fetchSingerDetail()
    },
    methods: {
      async _fetchSingerDetail() {
        if(!this.singer.id) {
          this.$router.push('/')
        }
        const { data } = await this.$http.get(`/artists?id=${this.id}`)
        this.singerDetail = data.artist
        this.songList = this._normalizeSong(data.hotSongs)
      },
      _normalizeSong(list) {
        let songs = []
        list.forEach(item => {
          this.$http.get(`/song/url?id=${item.id}`).then(res => {
            item.url = res.data.data[0].url
            songs.push(formatSong(item))
          })

        })
        return songs
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