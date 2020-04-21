<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box 
        @refreshScroll="refreshScroll" 
        ref="searchBox" 
        @fetchQuery="fetchQuery" 
        :parentQuery='parentQuery'></search-box>
    </div>
    <scroll :data="searchHistory" class="shortcut-wrapper"  v-show="!query">
      <div class="shortcut" ref="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="h in hotKeys" :key="h.first" @click="addQuery(h.first)">
              {{h.first}}
            </li>
          </ul>
        </div>
         <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @search="historySearch"/>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <search-suggest :query="query"/>
    </div>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import SearchSuggest from '../search-suggest/search-suggest'
import SearchList from '../../base/search-list/search-list'
import Scroll from '../../base/scroll'
import { removeAllHistory } from '../../common/js/cache'
import { reloadHistory } from '../../common/js/mixin'
import { mapGetters } from 'vuex'
  export default {
    name: 'search',
    mixins: [reloadHistory],
    components: {
      SearchBox,
      SearchSuggest,
      SearchList,
      Scroll
    },
    data() {
      return {
        hotKeys: [],
        query: '',
        height: {
          height: ''
        },
        parentQuery: ''
      }
    },
    computed: {
      ...mapGetters(['searchHistory'])
    },
    created() {
      this._fetchHotKeys()
    },
    mounted() {
      this.$set(this.height, 'height', `calc(100vh - ${this.$refs.shortcut.offseTop}px)`)
    },
    methods: {
      refreshScroll() {
        this.$refs.shortcut.style.paddingBottom = '60px'
        this.$refs.scroll.refresh()
      },
      historySearch(name) {
        this.query = name
        this.parentQuery = name
      },
      clearHistory() {
        removeAllHistory()
        this. _getHistoryList()
      },
      async fetchQuery(item) {
        this.query = item
      },
      addQuery(item) {
        this.$refs.searchBox.handleHotSearch(item)
      },
      async _fetchHotKeys() {
        const { data } = await this.$http.get('/search/hot')
        this.hotKeys = data.result.hots
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        // height 600px
        // overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>