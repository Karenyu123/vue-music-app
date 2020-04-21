<template>
  <scroll 
    class="suggest" 
    :pullUp="pullUp" 
    ref="suggestScroll"
    @pullUpLoad="pullUpLoad"
    >
    <ul class="suggest-list" ref="list" v-show="suggests.length > 0">
      <li class="suggest-item" v-for="(s, i) in suggests" :key="i" @click="toMusicPlay(s)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{s.name}}<span v-show="s.name"></span> - {{s.singer}}</p>
        </div>
      </li>
      <loading v-show="loadingFlag"/>
    </ul>
    <div class="no-result-wrapper" v-show="suggests.length === 0">
      <no-result title="抱歉，暂无搜索结果"/>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../../base/scroll'
import Loading from '../../base/loading/loading'
import NoResult from '../../base/no-result/no-result'
import { setBottom } from '../../common/js/mixin'
import { formatSong } from '../../common/js/song'
import { mapActions, mapGetters } from 'vuex'
import { setSearchHistory } from '../../common/js/cache'
import { reloadHistory } from '../../common/js/mixin'
  export default {
    name: 'search-suggest',
    mixins: [setBottom, reloadHistory],
    components: {
      Scroll,
      Loading,
      NoResult
    },
    props: {
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        suggests: [],
        pullUp: true,
        page: 1,
        totalSuggest: 0,
        loadingFlag: true
      }
    },
    computed: {
      ...mapGetters(['searchHistory'])
    },
    methods: {
      toMusicPlay(s) {
        this.handleSearchSong(s)
        setSearchHistory(this.query)
        this._getHistoryList()
        this.$emit('refreshScroll')
      },
      async pullUpLoad() {
        this.$refs.suggestScroll.finishPullUp()
        if((this.suggests.length >= this.totalSuggest) || !this.query) {
          return
        }
        this.loadingFlag = true
        if(this.suggests.length < this.totalSuggest) {
          const pageNum = this.page + 1
          const { data } = await this.$http(`/search?keywords=${this.query}&limit=20&offset=${pageNum}`)
          const arr = this._normalizeSong(data.result.songs)
          const _this = this
          // 因为_normalizeSong有异步请求数据，需要等数据请求完再追加
          setTimeout(() => {
            _this.suggests.push(...arr)
            _this.$refs.suggestScroll.refresh()
            _this.$refs.suggestScroll.finishPullUp()
            _this.page = pageNum
            _this.loadingFlag = false
          }, 500)
        }
      },
      _normalizeSong(list) {
        let songs = []
        list.forEach(item => {
          this.$http.get(`/song/url?id=${item.id}`).then(res => {
            if(res.data.data) {
              item.url = res.data.data[0].url
            }
            songs.push(formatSong(item))
          })

        })
        return songs
      },
      handleBottom(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.list.style.paddingBottom = bottom
        this.$refs.suggestScroll.refresh()
      },
      async _fetchSearchSuggests(query) {
        this.loadingFlag = true
        const { data } = await this.$http.get(`/search?keywords=${query}&limit=20&offset=${this.page}`)
        this.suggests = this._normalizeSong(data.result.songs)
        this.totalSuggest = data.result.songCount
        this.loadingFlag = false
      },
      ...mapActions(['handleSearchSong'])
    },
    watch: {
      query(newVal) {
        this.suggests = []
        this.page = 1
        if(!newVal) {
          return
        }
        this._fetchSearchSuggests(newVal)
      } 
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>