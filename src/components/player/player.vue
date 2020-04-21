<template>
  <div class="player" v-show="playlist&&playlist.length > 0">
    <transition 
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
      >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.img" alt="">
        </div>
        <div class="top">
          <div class="back" @click="switchScreen">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div 
          class="middle" 
          ref="middle"
          @touchstart.prevent="touchMiddle"
          @touchmove.prevent="moveMiddle"
          @touchend="touchMiddleEnd"
          >
          <div class="middle-l" ref="middleL" v-show="true">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.img" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{currentLyric}}
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScroll" :data="lyric&&lyric.lines">
            <div class="lyric-wrapper" ref="lyricWrapper">
              <div v-if="lyric" >
                <p 
                  ref="lyric"
                  class="text" 
                  :class="{current: currentLyricLineIndex === index}" 
                  v-for="(line, index) in lyric.lines"
                  :key="index"
                  >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow==='cd'}"></span>
            <span class="dot" :class="{active: currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{timeFormat(currentPlayTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @movePercent="movePercent"></progress-bar>
            </div>
            <span class="time time-r">{{timeFormat(currentSong.duration / 1000)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon" :class="modeIcon" @click="switchMode"></i>
            </div>
            <div class="icon i-left" :class="disable">
              <i class="icon icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disable"  @click="togglePlaying"> 
              <i class="icon" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disable">
              <i class="icon icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <img :class="cdRotate" :src="currentSong.img" alt="">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayIcon"  class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>

    <audio 
      ref="audio" 
      :src="currentSong.url" 
      @timeupdate="getCurrentTime"
      @canplay="audioReady" 
      @error="audioError"
      @ended="musicEnd"
      >
    </audio>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation'
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import Scroll from '../../base/scroll'
import Playlist from '../playlist/playlist'
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from '../../common/js/confg'
import { shuffle } from '../../common/js/utils'
import Lyric from 'lyric-parser'
  export default {
    name: 'player',
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    },
    data() {
      return {
        readyFlag: false,
        currentPlayTime: '0:00',
        duration: '0:00',
        lyric: null,
        currentLyricLineIndex: 0,
        currentShow: 'cd',
        currentLyric: ''
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdRotate() {
        return this.playing ? 'play' : 'pause'
      },
      disable() {
        return this.readyFlag ? 'disable' : ''
      },
      percent() {
        return this.currentPlayTime / this.duration
      },
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop':'icon-random'
      },
      ...mapGetters([
        'playlist', 
        'fullScreen',
        'currentSong',
        'playing', 
        'currentPlayIndex', 
        'mode',
        'sequencePlaylist'
        ]) 
    },
    created() {
      this.touches = {}
    },
    methods: {
      showPlaylist() {
        this.$refs.playlist.show()
      },
      touchMiddle(e) {
        this.touches.initialState = true
        this.touches.startX = e.touches[0].pageX
        this.touches.startY = e.touches[0].pageY
      },
      moveMiddle(e) {
        if(!this.touches.initialState) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touches.startX
        const deltaY = e.touches[0].pageY - this.touches.startY
        if(Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        // 如果当前显示的是cd，向左移动歌词，否则向右移动
        let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth, left + deltaX))
        this.touches.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricScroll.$el.style.transitionDuration =  `0ms`
        this.$refs.middleL.style.opacity = 1 - this.touches.percent
        this.$refs.middleL.style.transitionDuration = `0ms`
      },
      touchMiddleEnd() {
        let offsetWidth
        let opacity
        if(this.currentShow === 'cd') {
          if(this.touches.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else {
            offsetWidth = 0
            opacity = 1
          }
        }else{
          if(this.touches.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          }else{
            opacity = 0
            offsetWidth = -window.innerWidth
          }
        }
        const time = 300
        this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricScroll.$el.style.transitionDuration =  `${time}ms`
        this.$refs.middleL.style.transitionDuration = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
      },
      musicEnd() {
        if(this.mode === playMode.loop) {
          this.loop()
          return
        }
        this.nextSong()
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.lyric) {
          this.lyric.seek()
        }
      },
      switchMode() {
        let mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random) {
          list = shuffle(this.sequencePlaylist)
        }else {
          list = this.sequencePlaylist
        }
        this._resetIndex(list)
        this.setPlaylist(list)
      },
      _resetIndex(list) {
        let index = list.findIndex((item) => {
          return item.mid === this.currentSong.mid
        })
        this.setCurrentIndex(index)
      },
      movePercent(percent) {
        this.$refs.audio.currentTime = this.duration * percent
        if(!this.playing) {
          this.togglePlaying()
        }
        if(this.lyric) {
          this.lyric.seek(this.duration * percent * 1000)
        }
      },
      getCurrentTime(e) {
        let time = e.target.currentTime
        let duration = e.target.duration
        this.duration = duration
        this.currentPlayTime = time
      },
      timeFormat(value) {
        let val = value | 0
        let minute = val / 60 | 0
        let second = val % 60
        second = this.padZero(second)
        return `${minute}:${second}`
      },
      padZero(num, n=2) {
        let len = num.toString().length
        while(len < n) {
          num = '0' + num
          len ++
        }
        return num
      },
      prevSong() {
        if(!this.readyFlag) {
          return
        }
        let index = this.currentPlayIndex - 1
        if(index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if(!this.playing) {
          this.togglePlaying()
        }
        this.readyFlag = false
      },
      nextSong() {
        if(!this.readyFlag) {
          return
        }
        let index = this.currentPlayIndex + 1
        if(index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if(!this.playing) {
          this.togglePlaying()
        }
        this.readyFlag = false
      },
      audioReady() {
        this.readyFlag = true
      },
      audioError(){
        this.readyFlag = true
      },
      enter(el, done) {
        const { x, y, scale } = this._getPosAndScale()
        const animation = {
          0 : {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          '60%': {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          '100%': {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        const { x, y, scale } = this._getPosAndScale()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform = ''
      },
      switchScreen() {
        this.setFullScreen(false)
      },
      openFullScreen() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        if(!this.readyFlag) {
          return
        }
        this.setTogglePlaying(!this.playing)
        if(this.lyric) {
          this.lyric.togglePlay()
        }
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 30
        const paddingBottom = 20
        const width = window.innerWidth * 0.8
        const bigTop = 80
        const scale = targetWidth / width
        const x = - (window.innerWidth / 2 - paddingLeft)
        const y = window.innerWidth - bigTop - width / 2 - paddingBottom
        return { scale, x, y }
      },
      async _fetchLyric(id) {
        if(!id) return
        const { data } = await this.$http.get(`/lyric?id=${id}`)
        if(data.lrc) {
          let rLyric = data.lrc.lyric
          this.lyric = new Lyric(rLyric, this.handleLyric)
          if(this.playing) {
            this.lyric.play()
          }
        }
      },
      handleLyric({ lineNum, txt }) {
        this.currentLyricLineIndex = lineNum
        if(lineNum > 5) {
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyric[lineNum - 5], 1000)
        }else{
          this.$refs.lyricScroll.scrollTo(0, 0, 1000)
        }
        this.currentLyric = txt
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setTogglePlaying: 'SET_PLAY_STATE',
        setCurrentIndex: 'SET_CURRENT_PLAY_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST',
      })
    },
    watch: {
      currentSong(newVal, oldVal) {
        if(newVal.mid === oldVal.mid) {
          return
        }
        if(this.lyric) {
          this.lyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this._fetchLyric(newVal.mid)
        })
        
      },
      playing(newVal) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newVal ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      img 
        width 100%
        height 100%
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        width 40px
        height 40px
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>