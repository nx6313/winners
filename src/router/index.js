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
import android from '@/utils/app.js'
import '@/plugins/comm.css'
import '@/plugins/animate.css'
import '@/assets/fonts/iconfont.css'
import Home from '@/components/Home'
import HomeManager from '@/components/HomeManager'
import HomeManagerList from '@/components/HomeManagerList'
import HomeBoss from '@/components/HomeBoss'
import HomeBossList from '@/components/HomeBossList'
import SalePerformance from '@/components/SalePerformance'
import SalePerformanceList from '@/components/SalePerformanceList'
import SaleList from '@/components/SaleList'
import SaleListItems from '@/components/SaleListItems'
import Me from '@/components/Me'
import CompanyPerformance from '@/components/CompanyPerformance'
import CompanyPerformanceList from '@/components/CompanyPerformanceList'
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
      path: '/home-manager/:pagetype',
      name: 'HomeManager',
      component: HomeManager
    },
    {
      path: '/home-manager-list',
      name: 'HomeManagerList',
      component: HomeManagerList,
      meta: {
        title: '智能决策相关列表'
      }
    },
    {
      path: '/home-boss/:pagetype',
      name: 'HomeBoss',
      component: HomeBoss
    },
    {
      path: '/home-boss-list',
      name: 'HomeBossList',
      component: HomeBossList,
      meta: {
        title: '智能决策相关列表'
      }
    },
    {
      path: '/sale-performance/:pagetype',
      name: 'SalePerformance',
      component: SalePerformance
    },
    {
      path: '/sale-performance-list',
      name: 'SalePerformanceList',
      component: SalePerformanceList,
      meta: {
        title: '销售业绩相关列表'
      }
    },
    {
      path: '/sale-list/:pagetype',
      name: 'SaleList',
      component: SaleList,
      meta: {
        title: '龙虎榜'
      }
    },
    {
      path: '/sale-list-items',
      name: 'SaleListItems',
      component: SaleListItems,
      meta: {
        title: '龙虎榜相关列表'
      }
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
    {
      path: '/company-performance/:pagetype',
      name: 'CompanyPerformance',
      component: CompanyPerformance
    },
    {
      path: '/company-performance-list',
      name: 'CompanyPerformanceList',
      component: CompanyPerformanceList,
      meta: {
        title: '销售业绩相关列表'
      }
    },
    {
      path: '/user-list',
      name: 'UserList',
      component: UserList,
      meta: {
        title: '通讯录'
      }
    },
    {
      path: '/sell-data/:userid',
      name: 'SellData',
      component: resolve => require(['@/components/SellData'], resolve)
    },
    {
      path: '/user-data/:userid',
      name: 'UserData',
      component: resolve => require(['@/components/UserData'], resolve)
    },
    {
      path: '/app-me',
      name: 'AppMe',
      component: resolve => require(['@/components/app/Me'], resolve)
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  if (router.app.$comfun.getRequest('deviceType') === 'android' || router.app.$comfun.getRequest('deviceType') === 'ios') {
    window['app'] = router.app
    android.callAndroid('saveUserInfoForAndroid')
    next()
  } else {
    router.app.$moment.localforage.getItem('userLoginInfo').then((loginInfo) => {
      if (loginInfo) {
        router.app.$moment.userInfo = loginInfo
        if (to.path !== '/') {
          router.app.$root.eventHub.$emit('init-menu')
        } else {
          router.app.$root.eventHub.$emit('clear-menu')
        }
        if (to.path === '/home-manager') {
          if (loginInfo.user.grade === '2' && (loginInfo.user.scope === router.app.$moment.dutyOpt.sale_after || loginInfo.user.scope === router.app.$moment.dutyOpt.sale_all)) {
            if (to.params['parapagetype']) {
              next()
            } else {
              next('/home-manager-list')
            }
          } else {
            next('/home-manager/unknown')
          }
        } else if (to.path === '/sale-performance') {
          if (loginInfo.user.grade === '2' && (loginInfo.user.scope === router.app.$moment.dutyOpt.sale_after || loginInfo.user.scope === router.app.$moment.dutyOpt.sale_all)) {
            if (to.params['parapagetype']) {
              next()
            } else {
              next('/sale-performance-list')
            }
          } else {
            next('/sale-performance/unknown')
          }
        } else if (to.path === '/home-boss' && loginInfo.user.grade === '3') {
          if (to.params['parapagetype']) {
            next()
          } else {
            next('/home-boss-list')
          }
        } else if (to.path === '/sale-list') { // 龙虎榜页面
          if (loginInfo.user.grade === '2' && (loginInfo.user.scope === router.app.$moment.dutyOpt.sale_after || loginInfo.user.scope === router.app.$moment.dutyOpt.sale_all)) {
            if (to.params['parapagetype']) {
              next()
            } else {
              next('/sale-list-items')
            }
          } else {
            next('/sale-list/unknown')
          }
        } else {
          next()
        }
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
  }
})

export default router
