<template>
  <div class="song-list">
    <ul>
      <li 
        class="item" 
        v-for="(song, i) in songs" 
        :key="song.mid"
        @click="songClick(song, i)"
        >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(i)">{{getRankText(i)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.album}} -- {{song.singer}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'song-list',
    props: {
      songs: {
        type: Array,
        default() {return []}
      },
      rank:{
        type: Boolean,
        default: false
      }
    },
    methods: {
      songClick(song, index) {
        this.$emit('handleClick', song, index)
      },
      getRankCls(index) {
        if(index <=2) {
          return `icon icon${index}`
        }else{
          return 'text'
        }
      },
      getRankText(index) {
        if(index > 2) {
          return index + 1
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list 
  .item 
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank 
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon 
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text 
        color: $color-theme;
        font-size: $font-size-large;
    .content 
      flex: 1;
      line-height: 20px;
      width 100%
      box-sizing border-box
      overflow hidden
      .name 
        no-wrap();
        color: $color-text;
      .desc
        no-wrap();
        margin-top: 4px;
        color: $color-text-d
</style>