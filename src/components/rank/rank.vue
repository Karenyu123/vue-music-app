<template>
  <div class="rank">
    <scroll :data="toplist" class="toplist" ref="toplistScroll">
      <ul v-show="toplist.length > 0" ref="toplist">
        <li class="item" v-for="t in toplist" :key="t.id" @click="toTopList(t)" >
          <div class="icon">
            <img v-lazy="t.coverImgUrl" alt="">
          </div>
          <ul class="songlist" >
            <li class="desc">
              <span>{{t.description}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="toplist.length === 0">
        <loading/>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '../../base/scroll'
import Loading from '../../base/loading/loading'
import { mapMutations } from 'vuex'
import { setBottom } from '../../common/js/mixin'
import { rankList } from './rankList'
  export default {
    name: 'rank',
    mixins: [setBottom],
    components: {
      Scroll,
      Loading
    },
    data() {
      return {
        toplist: []
      }
    },
    created() {
      this._fetchToplist()
    },
    methods: {
      toTopList(item) {
        this.setToplist(item)
        this.$router.push(`/rank/${item.id}`)
      },
      handleBottom(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.toplist.style.paddingBottom = bottom
        this.$refs.toplistScroll.refresh()
      },
      async _fetchToplist() {
        const { data } = await this.$http.get('/toplist/detail')
        this.toplist = this._normalizeData(data.list)
      },
      _normalizeData(list) {
        return list.map((item) => {
         let key = rankList.filter((r) => {
            return item.name === r.name
          })[0]
          if(key) {
            item.idx = key.idx
          }
          return item
        })
      },
      ...mapMutations({
        setToplist: 'SET_TOPLIST'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    z-index 100
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          // border 1px solid #999
          img 
            width 100px
            height 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          box-sizing border-box
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
          .desc
            height 100px
            padding-top 20px
            padding-bottom 20px
            box-sizing border-box
            overflow hidden
            text-overflow ellipsis
            line-height 26px
            span 
              // display block
              // height 60px
              // padding-top 10px
              // padding-bottom 20px
              // box-sizing border-box
              // overflow hidden
              overflow hidden
              text-overflow ellipsis
              display -webkit-box
              -webkit-line-clamp 2
              -webkit-box-orient vertical
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>