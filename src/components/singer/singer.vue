<template>
  <div>
    <list-view v-if="singerList.length > 0" :data="singerList" @singerClick="singerClick" />
    <div class="loading-container" v-else>
      <loading/>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import pinyin from 'pinyin'
import ListView from '../../base/listview/listview'
import Loading from '../../base/loading/loading'
import { mapMutations } from 'vuex'
  export default {
    name: 'singer',
    components: {
      ListView,
      Loading
    },
    data() {
      return {
        singerList: []
      }
    },
    created() {
      this._fetchSingerList() 
      
    },
    methods: {
      singerClick(singer) {
        this.$router.push(`/singer/${singer.id}`)
        this.setSinger(singer)
      },
      async _fetchSingerList() {
        const { data } = await this.$http.get('artist/list?limit=100')
        const dataFormat = this._transferData(data.artists)
        this.singerList = this._normalizeData(dataFormat)
      },
      _transferData(data) {
        return data.map(item => {
         const firstLetter = pinyin(item.name, {
           style: pinyin.STYLE_FIRST_LETTER
          })[0][0].split('')[0]
          item.firstLetter = firstLetter
          return item
        })
      },
      _normalizeData(list) {
        const map = {
          hot: {
            title: '热门',
            items: []
          }
        }
        list.forEach((item, i) => {
          if ( i < 10 ) {
            map.hot.items.push({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url
            })
          }
          const key = item.firstLetter.toUpperCase()
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push({
            id: item.id,
            name: item.name,
            avatar: item.picUrl
          })
        })
        let hot = []
        let ret = []
        for (let k in map) {
          let val = map[k]
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if(val.title === '热门') {
            hot.push(val)
          }
        }
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus">
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>