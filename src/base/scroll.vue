<template>
  <div class="scroll-wrapper" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
  export default {
    name: 'scroll',
    props: {
      data: {
        type: Array,
        default() {return []}
      },
      clickable: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 1
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll()
      })
      this.$bus.$on('handleImgLoad', () => {
        this.refresh()
      })
    },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.scroll,{
          probeType: this.probeType,
          scrollY: true,
          click: this.clickable,
          pullUpLoad:this.pullUp
        })
        if(this.listenScroll) {
          let _this = this
          this.scroll.on('scroll', p => {
            _this.$emit('onScroll', p)
          })
        }
        if(this.pullUp) {
          this.scroll.on('pullingUp', () => {
            this.$emit('pullUpLoad')
          })
        }
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo(y) {
        this.scroll && this.scroll.scrollTo(0,y,300)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      }
    },
    watch: {
      data() {
        this.refresh()
      }
    },
  }
</script>

<style scoped lang="stylus">
.scroll-wrapper
  // position fixed
  // top: 0
  // bottom: 0
  width: 100%
  background: $color-background
  height calc(100vh - 88px)
  // overflow hidden
</style>