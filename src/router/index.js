import Vue from 'vue'
import VueRouter from 'vue-router'

const Singer = () => import('../components/singer/singer.vue')
const Search = () => import('../components/search/search.vue')
const Rank = () => import('../components/rank/rank.vue')
const Recommend = () => import('../components/recommend/recommend.vue')
const SingerDetail = () => import('../components/singer-detail/singer-detail.vue')
const Disc = () => import('../components/disc/disc.vue')
const TopList = () => import('../components/top-list/top-list.vue')
const UserCenter = () => import('../components/user-center/user-center.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    children: [
      {
        path: '/recommend/:id',
        component: Disc,
        props: true
      }
    ]
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank,
    children: [{
      path: ':id',
      component: TopList,
      props: true
    }]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
    children: [
      {
        path: '/singer/:id',
        name: 'singer-detail',
        component: SingerDetail,
        props: true
      }
    ]
  },
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    component: UserCenter
  }
]

const router = new VueRouter({
  routes
})

export default router