<template>
  <Scroll 
    class="listview" 
    ref="listScroll"
    :data="data" 
    :listenScroll="listenScroll"
    :probeType="2" 
    @onScroll="onScroll">
    <ul ref="list">
      <li 
        class="list-group" 
        v-for="(list) in data" 
        :key="list.title" 
        ref="listGroup">
        <h2 class="list-group-title">{{list.title}}</h2>
        <ul>
          <li 
            class="list-group-item" 
            v-for="item in list.items" 
            :key="item.id"
            @click="handleClick(item)"
            >
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div 
      class="list-shortcut" 
      @touchstart="onShortCutTouchStart" 
      @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li 
          class="item" 
          :class="{current: currentIndex === i}" 
          v-for="(item,i) in shortcuts" 
          :key="item"
          :data-index="i"
          ref="shortcut"
          >
          {{item}}
        </li> 
      </ul>
    </div>
    <div class="list-fixed" v-show="title" ref="title">
      <h2 class="fixed-title">{{title}}</h2>
    </div>
  </Scroll>
</template>

<script>
import Scroll from '../scroll'
import { setBottom } from '../../common/js/mixin'

const LINE_HEIGHT = 18
const TITLE_HEIGHT = 30
  export default {
    name: 'listview',
    props: {
      data: {
        type: Array,
        default() {return []}
       }
      },
    mixins: [setBottom],
    components: {
      Scroll
    },
    data() {
      return {
        positionY: 0,
        currentIndex: 0,
        listenScroll: true,
        diff: 0
      }
    },
    computed: {
      shortcuts() {
        return this.data.map((item) => {
          return item.title.substr(0,1)
        })
      },
      title() {
        if(this.positionY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created() {
      this.touches = {}
    },
    methods: {
      handleBottom(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.list.style.paddingBottom = bottom
        this.$refs.listScroll.refresh()
      },
      handleClick(item){
        this.$emit('singerClick', item)
      },
      onScroll(pos) {
        this.positionY = pos.y
      },
      onShortCutTouchStart(e) {
        const index = parseInt(e.target.dataset.index)
        this.touches.index = index
        this.touches.y1 = e.touches[0].pageY
        this._scrollTo(index)
      },
      onShortCutTouchMove(e) {
        this.touches.y2 = e.touches[0].pageY
        const cIndex = (this.touches.y2 - this.touches.y1) / LINE_HEIGHT | 0
        const index = parseInt(this.touches.index) + cIndex
        this._scrollTo(index)
      },
      _scrollTo(index) {
        if(!index && index !== 0) {
          return
        }
        if(index < 0) {
          index = 0
        }else if ( index > this.$refs.listGroup.length) {
          index =  this.$refs.listGroup.length - 1
        }
        this.currentIndex = index
        this.$refs.listScroll.scrollToElement(this.$refs.listGroup[index],0)
      }
    },
    watch: {
      positionY(newVal) {
        if (newVal > 0) {
          this.currentIndex = 0
          return
        }
        for(let i = 0; i < this.$refs.listGroup.length-1; i++) {
          let height1 = this.$refs.listGroup[i].offsetTop
          let height2 = this.$refs.listGroup[i+1].offsetTop
          if(-newVal >= height1 && -newVal < height2) {
            this.currentIndex = i
            this.diff = height2 + newVal
            return
          }
        } 
        this.currentIndex =  this.$refs.listGroup.length - 1
      },
      diff(newVal) {
        let distance = (newVal > 0 && newVal <TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
         // 减少计算频率
        if(this.distance === distance) {
          return
        }
        this.distance = distance
        this.$refs.title.style.transform = `translate3d(0, ${distance}px, 0)`
      }
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    height calc(100vh - 88px)
    width: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top 100px
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
