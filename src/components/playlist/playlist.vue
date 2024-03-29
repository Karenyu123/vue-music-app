<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="close">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear" @click.stop="deleteAll"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="playlistScroll" :data='sequencePlaylist' class="list-content">
          <transition-group name="list" tag="ul">
            <li 
              class="item" 
              ref="listItem"
              v-for="(p,i) in sequencePlaylist" 
              :key="p.mid"
              @click.stop="musicPlay(p,i)"
              >
              <i class="current" :class="isCurrentSong(p)"></i>
              <span class="text">{{p.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteSong(p, i)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到序列</span>
          </div>
        </div>
        <div class="list-close" @click="close">
          <span>关闭</span>
        </div>
      </div>
      <confirm 
        ref="confirm" 
        text="确认删除播放列表所有歌曲吗？" 
        @confirm="deleteConfirm" 
        @cancel="deleteCancel"/>
    </div>
  </transition>
</template>

<script>
import Scroll from '../../base/scroll'
import Confirm from '../../base/confirm/confirm'
import { mapGetters, mapMutations, mapActions } from 'vuex'
  export default {
    name: 'playlist',
    components: {
      Scroll,
      Confirm
    },
    data() {
      return {
        showFlag: false
      }
    },
    computed: {
      ...mapGetters(['sequencePlaylist', 'currentSong', 'playlist'])
    },
    methods: {
      deleteAll() {
        this.$refs.confirm.show()
      },
      deleteConfirm() {
        this.deletePlaylist()
        this.$refs.confirm.hide()
      },
      deleteCancel() {
        this.$refs.confirm.hide()
      },
      deleteSong(song) {
        this.deleteMusic(song)
        if(!this.sequencePlaylist.length) {
          thiss.close()
        }
      },
      musicPlay(song, i) {
        if(song.mid === this.currentSong.mid) {
          return
        }
        this.setCurrentIndex(i)
        setTimeout(() => {
          this.$refs.playlistScroll.scrollToElement(this.$refs.listItem[i],300)
        }, 20);
      },
      isCurrentSong(song) {
        if(song.mid === this.currentSong.mid) {
          return 'icon-play'
        }
        return ''
      },
      show() {
        this.showFlag = true
      },
      close() {
        this.showFlag = false
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_PLAY_INDEX'
      }),
      ...mapActions(['deleteMusic', 'deletePlaylist'])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>