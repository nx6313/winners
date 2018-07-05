import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import Moment from '@/utils/moment.js'
import ComFun from '@/utils/comfun.js'
import Directives from '@/plugins/directives.js'
import Dialogbox from '@/plugins/dialogbox/dialogbox.js'
import FireParticle from '@/plugins/canvas/fire-particle.js'
import Cvsbg from '@/plugins/canvas/cvsbg.js'
import '@/plugins/comm.css'
import '@/plugins/animate.css'
import '@/assets/fonts/iconfont.css'
import Login from '@/components/Login'
import Home from '@/components/Home'
import SaleList from '@/components/SaleList'
import Me from '@/components/Me'

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
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/sale-list',
      name: 'SaleList',
      component: SaleList
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    }
  ]
})
router.beforeEach(function (to, from, next) {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  next()
})

export default router
