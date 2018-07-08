import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/dataZoomInside'
import Moment from '@/utils/moment.js'
import ComFun from '@/utils/comfun.js'
import Directives from '@/plugins/directives.js'
import Dialogbox from '@/plugins/dialogbox/dialogbox.js'
import FireParticle from '@/plugins/canvas/fire-particle.js'
import Cvsbg from '@/plugins/canvas/cvsbg.js'
import '@/plugins/comm.css'
import '@/plugins/animate.css'
import '@/assets/fonts/iconfont.css'
import Home from '@/components/Home'
import HomeManager from '@/components/HomeManager'
import HomeBoss from '@/components/HomeBoss'
import SalePerformance from '@/components/SalePerformance'
import SaleList from '@/components/SaleList'
import Me from '@/components/Me'
import CompanyPerformance from '@/components/CompanyPerformance'
import UserList from '@/components/UserList'

Vue.use(Router)
Vue.use(VueResource)
Vue.component('chart', ECharts)
Vue.use(Moment)
Vue.use(ComFun)
Vue.use(Directives)
Vue.use(Dialogbox)
Vue.use(FireParticle)
Vue.use(Cvsbg)

Vue.http.options.headers = {
  'Content-Type': 'application/json;charset=utf-8'
}

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/home-manager',
      name: 'HomeManager',
      component: HomeManager
    },
    {
      path: '/home-boss',
      name: 'HomeBoss',
      component: HomeBoss
    },
    {
      path: '/sale-performance',
      name: 'SalePerformance',
      component: SalePerformance
    },
    {
      path: '/sale-list',
      name: 'SaleList',
      component: SaleList,
      meta: {
        title: '龙虎榜'
      }
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
    {
      path: '/company-performance',
      name: 'CompanyPerformance',
      component: CompanyPerformance
    },
    {
      path: '/user-list',
      name: 'UserList',
      component: UserList,
      meta: {
        title: '通讯录'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  router.app.$moment.localforage.getItem('userLoginInfo').then((loginInfo) => {
    if (loginInfo) {
      router.app.$moment.userInfo = loginInfo
      if (to.path !== '/') {
        router.app.$root.eventHub.$emit('init-menu')
      } else {
        router.app.$root.eventHub.$emit('clear-menu')
      }
      next()
      if (to.path !== '/') {
        router.app.$root.eventHub.$emit('ref-menu')
      } else {
        router.app.$root.eventHub.$emit('clear-menu')
      }
    } else {
      router.app.$root.eventHub.$emit('clear-menu')
      if (to.path !== '/') {
        router.app.$dialog_msg({
          msg: '登陆信息失效'
        })
        next('/')
      } else {
        next()
      }
    }
  })
})

export default router
