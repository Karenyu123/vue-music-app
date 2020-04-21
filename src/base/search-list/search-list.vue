<template>
  <div class="search-list">
    <ul>
      <li 
        class="search-item" 
        v-for="(name, i) in searchHistory" 
        :key="i"
        >
        <span class="text" @click="search(name)">{{name}}</span>
        <span class="icon" @click="deleteHistory(i)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations  } from 'vuex'
import { deleteSearchHistory } from '../../common/js/cache'
import { reloadHistory } from '../../common/js/mixin'
  export default {
    name: 'search-list',
    mixins: [reloadHistory],
    computed: {
      ...mapGetters(['searchHistory']) 
    },
    methods: {
      deleteHistory(i) {
        deleteSearchHistory(i)
        this._getHistoryList()
      },
      search(name) {
        this.$emit('search', name)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>