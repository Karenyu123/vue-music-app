<template>
  <div class="recommend">
    <scroll :data="musicList" ref="recommendScroll">
      <div class="recommend-content" ref="recommendList">
        <m-swiper :banners="banners"/>
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li 
              class="item needsclick" 
              v-for="m in musicList" 
              :key="m.id"
              @click="handleDiscClick(m)"
              >
              <div class="icon">
                <img width="60" height="60" v-lazy="m.coverImgUrl" alt="a">
              </div>
              <div class="text">
                <div class="music-name">{{m.name}}</div>
                <div class="desc">{{m.description}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="!musicList.length">
          <loading/>
        </div>
    </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import MSwiper from '../../base/swiper'
  import Scroll from '../../base/scroll'
  import Loading from '../../base/loading/loading'
  import { mapMutations } from 'vuex'
  import { setBottom } from '../../common/js/mixin'
  export default {
    name: 'recommend',
    components: {
      MSwiper,
      Scroll,
      Loading
    },
    mixins: [setBottom],
    data() {
      return {
        banners: [],
        musicList: []
      }
    },
    created() {
      this._fetchBanners()
      this._fetchMusicList()
    },
    methods: {
      handleDiscClick(m) {
        this.setDisc(m)
        this.$router.push(`/recommend/${m.id}`)
      },
      handleBottom(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.recommendList.style.paddingBottom = bottom
        this.$refs.recommendScroll.refresh()
      },
      async _fetchBanners() {
        const { data } = await this.$http.get('/banner')
        this.banners = data.banners
      },
      async _fetchMusicList() {
        const { data } = await this.$http.get('/top/playlist?limit=30&order=hot')
        this.musicList = data.playlists
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      background #222222
      .swiper-container
        position: relative
        width: 100%
        overflow hidden
        .swiper-wrapper
          display flex
          .swiper-slide
            flex 1
            img 
              width 100vw
              height auto
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .music-name
              margin-bottom: 10px
              color: $color-text
            .desc
              font-size 13px
              color: $color-text-d
              text-overflow ellipsis 
              white-space nowrap
              overflow hidden

      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>