<template>
  <swiper class="swiper" :options="swiperOption" v-if="isShow">
    <swiper-slide class="m-slide" v-for="pic in banners" :key="pic.targetId">
      <img @load="imgLoad" :src="pic.imageUrl" alt="">
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    name: 'swiper-example-pagination',
    title: 'Pagination',
    props: {
      banners: {
        type: Array,
        default() { return []}
      }
    },
    components: {
      Swiper,
      SwiperSlide
    },
    data() {
      return {
        swiperOption: {
          loop: true,
          autoplay: true,
          pagination: {
            el: '.swiper-pagination'
          }
        },
        isShow: false
      }
    },
    activated() {
      this.isShow = true
    },
    methods: {
      imgLoad() {
        if (!this.load) {
          this.$bus.$emit('handleImgLoad')
          this.load = true
        }
      }
    },
    deactivated() {
      this.isShow = false 
    }
  }
</script>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  // height: 100%;
  .m-slide {
    img {
      width: 100vw;
      height: auto;
    }
  }
  .swiper-pagination {
    .swiper-pagination-bullet {
      background-color: #fff!important;
    }
  }
}

</style>