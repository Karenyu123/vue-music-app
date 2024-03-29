<template>
  <div class="music-list">
    <div class="back" @click="back" >
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgi" ref="back">
      <div class="play-wrapper">
        <div class="play" @click="randomPlay" ref="randomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll 
      class="list" 
      :data="songList" 
      ref="scroll" 
      :style="height"
      :listenScroll="true"
      :probeType="3"
      @onScroll="onScroll"
      >
      <div ref="songList" class="song-list-wrapper" v-show="songList.length > 0">
        <song-list  :rank="rank" :songs="songList" @handleClick="handleClick"/>
      </div>
      <div class="loading-container" v-show="songList.length === 0">
        <loading/>
    </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading'
import { mapActions, mapGetters } from 'vuex'
import { setBottom } from '../../common/js/mixin'
const TAB_HEIGHT = 40
  export default {
    name: 'music-list',
    props: {
      songList: {
        type: Array,
        default() {return []}
      },
      title: {
        type: String,
        default: ''
      },
      bg: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        height: {
          height: ''
        },
        positionY: 0
      }
    },
    mixins: [setBottom],
    components: { 
      Scroll,
      SongList,
      Loading
    },
    computed: {
      bgi() {
        return `background: url(${this.bg}); background-size: cover`
      },
      ...mapGetters(['currentSong'])
    },
    mounted() {
      this.bgHeight = this.$refs.back.offsetHeight
      this.translateY = -this.bgHeight + TAB_HEIGHT
      this.$nextTick(() => {
        this.$set(this.height, 'height',`calc(100vh - ${ this.bgHeight }px)`)
      })
      this.$refs.scroll.$el.style.top = `${ this.bgHeight }px`
    },
    methods: {
      handleBottom(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.songList.style.paddingBottom = bottom
        this.$refs.scroll.refresh()
      },
      randomPlay() {
        this.handleRandomPlay({
          list: this.songList,
          currentSong: this.currentSong
        })
      },
      back() {
        this.$router.history.go(-1)
      },
      onScroll(pos) {
        this.positionY = pos.y
      },
      handleClick(song, index) {
        this.handleSongClick({
          songlist: this.songList,
          index: index
          })
      },
      ...mapActions(['handleSongClick', 'handleRandomPlay'])
    },
    watch: {
      positionY(newVal) {
        const translatey = Math.max(this.translateY, newVal)
        this.$refs.bgLayer.style['transform'] = `translate3d(0, ${translatey}px, 0)`
        let zIndex = 0
        let percent = Math.abs(newVal / this.bgHeight)
        let scale = percent + 1
        if(newVal > 0) {
          this.$refs.back.style.transform = `scale(${scale})`
        }
        if(newVal < this.translateY) {
          zIndex = 10
          this.$refs.back.style.paddingTop = 0
          this.$refs.back.style.height = TAB_HEIGHT + 'px'
          this.$refs.randomPlay.style.display = 'none'
        }else {
          this.$refs.back.style.paddingTop = '70%'
          this.$refs.back.style.height = 0
          this.$refs.randomPlay.style.display = 'block'
        }
        this.$refs.back.style.zIndex = zIndex
      } 
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 9990
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        width 100%
        padding: 20px 30px
        box-sizing border-box
        // overflow hidden
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>