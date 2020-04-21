<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div 
          class="progress-btn" 
          ref="progressBtn"
          @touchstart.stop.prevent="btnStartSlide"
          @touchmove.stop.prevent="btnMove"
          @touchend.stop="btnSlideEnd"
          ></div>
      </div>
    </div>
  </div>
</template>

<script>
const PROGRESS_BTN_WIDTH = 16
  export default {
    name: 'progress-bar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touches = {}
    },
    methods: {
      progressClick(e) {
        const left = e.offsetX
        const percent = left / this.barWidth
        this.$emit('movePercent', percent)
      },
      btnStartSlide(e) {
        this.touches.initialState = true
        this.touches.startX = e.touches[0].pageX
        this.touches.left = this.$refs.progress.offsetWidth
      },
      btnMove(e) {
        if(!this.touches.initialState) {
          return
        }
        let moveWidth = e.touches[0].pageX - this.touches.startX
        let totalWidth = Math.max(moveWidth + this.touches.left,0)
        totalWidth = Math.min(this.barWidth, totalWidth)
        this._offsetX(totalWidth)
      },
      btnSlideEnd() {
        this.touches.initialState = false
        this._triggerPercent()
      },
      _triggerPercent() {
        const percent = this.$refs.progress.offsetWidth / this.barWidth
        this.$emit('movePercent', percent)
      },
      _offsetX(x) {
        this.$refs.progress.style.width = `${x}px`
        this.$refs.progressBtn.style.transform = `translate3d(${x}px, 0, 0)`
      }
    },
    watch: {
      percent(newVal) {
          if(!this.barWidth) {
            this.barWidth = this.$refs.progressBar.offsetWidth - PROGRESS_BTN_WIDTH
          }
          let offsetX = this.barWidth * newVal
        if(newVal >= 0 && !this.touches.initialState) {
          this._offsetX(offsetX)
        }
      } 
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>