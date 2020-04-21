<template>
  <div id="app">
    <y-header/>
    <tab/>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player/>
  </div>
</template>

<script>
  import YHeader from './components/y-header/y-header'
  import Tab from './components/tab/tab'
  import Player from './components/player/player'
  export default {
    name: 'App',
    components: {
      YHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>