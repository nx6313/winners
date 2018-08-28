<template>
  <div class="winner-list" :style="canOverFlow ? {} : { 'overflow': 'hidden' }" ref="scroll-page" @scroll="scrollPage" @touchstart="scrollstart" @touchmove="scrollmove" @touchend="scrollend">
    <div class="top-apps-wrap-min" ref="top-apps-wrap-min" v-if="showMin">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :class="page === appIndex ? ['cur-app', `cur-app-${page}`] : ''" :style="{ 'width': `calc((100% - ${topApps.length} * 2 * 0.2rem) / ${topApps.length})` }" @click="toTopApp(app, appIndex)">
        <span>{{app.text}}</span>
      </div>
    </div>
    <div class="top-apps-wrap" ref="top-apps-wrap">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :class="page === appIndex ? ['cur-app', `cur-app-${page}`] : ''" :style="{ 'width': `calc((100% - ${topApps.length} * 2 * 0.2rem) / ${topApps.length})` }" @click="toTopApp(app, appIndex)">
        <i :style="{ 'background-image': `url(${app.icon})` }"></i>
        <span>{{app.text}}</span>
      </div>
    </div>
    <div class="app-pages-wrap" ref="app-pages-wrap">
      <template v-if="page === 0">
        <img class="data-loading" :src="require('@/assets/user-loading.gif')" v-if="dataIsLoading">
        <comm-table v-if="!dataIsLoading" :title="tableTitles" :second-title="tableSecondTitles" :data="tableData" :show-index="true" :line-num="3" :rank-badge="false"></comm-table>
      </template>
      <template v-if="page === 1">
        积分排行
      </template>
      <template v-if="page === 2">
        <app-advance></app-advance>
      </template>
      <template v-if="page === 3">
        <app-badge></app-badge>
      </template>
      <template v-if="page === 4">
        阿米巴竞赛
      </template>
    </div>
  </div>
</template>

<script>
import Table from '@/components/CommTable'
import Advance from '@/components/app/Advance'
import Badge from '@/components/app/Badge'
import NoPage from '@/components/app/NoPage'

export default {
  name: 'AppWinnerList',
  components: {
    'comm-table': Table,
    'app-advance': Advance,
    'app-badge': Badge,
    'app-no-page': NoPage
  },
  data () {
    return {
      page: 0,
      dateType: 'day',
      canOverFlow: true,
      dataIsLoading: true,
      showMin: false,
      minStartY: -1,
      minDistanceY: -1,
      minTopDistance: 4 * 16,
      topApps: [
        {
          icon: require('@/assets/do_yjpm.png'),
          text: '业绩排名',
          titleBg: '',
          dos: true,
          minStyle: 'txt'
        },
        {
          icon: require('@/assets/do_jfph.png'),
          text: '积分排行',
          titleBg: '',
          dos: true,
          minStyle: 'txt'
        },
        {
          icon: require('@/assets/do_cgjj.png'),
          text: '闯关晋级',
          titleBg: '#00488F',
          dos: false,
          minStyle: 'full'
        },
        {
          icon: require('@/assets/do_pyxb.png'),
          text: '评优选拔',
          titleBg: '#144E97',
          dos: false,
          minStyle: 'full'
        },
        {
          icon: require('@/assets/do_ambjs.png'),
          text: '阿米巴竞赛',
          titleBg: '',
          dos: false,
          minStyle: 'full'
        }
      ],
      tableTitles: [
        {
          label: '贡献度',
          prop: 'contribution'
        },
        {
          label: '整车销售',
          prop: 'newcar'
        },
        {
          label: '汽车用品',
          prop: 'accessory'
        },
        {
          label: '金融',
          prop: 'finance'
        },
        {
          label: '保险',
          prop: 'insurance'
        },
        {
          label: '二手车',
          prop: 'oldcar'
        }
      ],
      tableSecondTitles: {
        'contribution': [
          '姓名', '金额（元）'
        ],
        'newcar': [
          '姓名', '台数'
        ],
        'accessory': [
          '姓名', '销售额'
        ],
        'finance': [
          '姓名', '信贷量'
        ],
        'insurance': [
          '姓名', '投保量（单）'
        ],
        'oldcar': [
          '姓名', '销售（台）'
        ]
      },
      tableData: []
    }
  },
  mounted () {
    if (this.topApps[0].minStyle === 'txt') {
      this.showMin = true
    }
    this.$call('addTitleBtn', JSON.stringify([
      {
        event: 'title-btn-day',
        txt: '日'
      },
      {
        event: 'title-btn-month',
        txt: '月'
      },
      {
        event: 'title-btn-year',
        txt: '年'
      }
    ]))
    this.$root.eventHub.$on('title-btn-day', () => {
      this.dateType = 'day'
      this.dataIsLoading = true
      let startDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      let endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.getOrderList(startDate, endDate)
    })
    this.$root.eventHub.$on('title-btn-month', () => {
      this.dateType = 'month'
      this.dataIsLoading = true
      let startDate = this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[0], 'yyyy-MM-dd')
      let endDate = this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[1], 'yyyy-MM-dd')
      this.getOrderList(startDate, endDate)
    })
    this.$root.eventHub.$on('title-btn-year', () => {
      this.dateType = 'year'
      this.dataIsLoading = true
      let startDate = this.$comfun.formatDate(this.$comfun.getYearStartEnd()[0], 'yyyy-MM-dd')
      let endDate = this.$comfun.formatDate(this.$comfun.getYearStartEnd()[1], 'yyyy-MM-dd')
      this.getOrderList(startDate, endDate)
    })
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      let startDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      let endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.getOrderList(startDate, endDate)
    })
    this.$root.eventHub.$on('getTableDataAfter', () => {
      this.dataIsLoading = false
    })
    let startDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
    let endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
    this.getOrderList(startDate, endDate)
  },
  methods: {
    scrollPage () {
      var pageScrollTop = this.$refs['scroll-page'].scrollTop
      var toOpacity = pageScrollTop / this.minTopDistance
      if (toOpacity > 1) {
        toOpacity = 1
      }
      if (this.topApps[this.page].minStyle === 'txt') {
        this.$refs['top-apps-wrap-min'].style.opacity = toOpacity
        this.$refs['top-apps-wrap'].style.opacity = 1 - toOpacity
      }
    },
    scrollstart () {
      if (this.minStartY < 0) {
        this.minStartY = event.touches[0].pageY
      }
    },
    scrollmove () {
      if (this.minStartY < 0) {
        this.minStartY = event.touches[0].pageY
      }
      this.minDistanceY = event.touches[0].pageY - this.minStartY
    },
    scrollend () {
      if (Math.abs(this.minDistanceY) > 20) {
        if (this.minDistanceY < 0) {
          if (this.topApps[this.page].minStyle === 'full') {
            this.$refs['app-pages-wrap'].style.transform = `translateY(-${this.$refs['top-apps-wrap'].clientHeight}px)`
          }
        } else {
          if (this.topApps[this.page].minStyle === 'full') {
            this.$refs['app-pages-wrap'].style.transform = `translateY(0)`
          }
        }
      }
      this.minStartY = -1
      this.minDistanceY = -1
    },
    toTopApp (app, appIndex) {
      this.$refs['scroll-page'].scrollTop = 0
      this.$refs['top-apps-wrap'].style.opacity = 1
      if (app.minStyle === 'full') {
        this.showMin = false
      } else {
        this.showMin = true
      }
      this.page = appIndex
      this.$call('updateTitleBar', JSON.stringify({
        bg: app.titleBg,
        dos: app.dos
      }))
      if (appIndex === 2 || appIndex === 3) {
        this.canOverFlow = false
      } else {
        this.canOverFlow = true
      }
      if (appIndex === 0) {
        this.dataIsLoading = true
        let startDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
        let endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
        if (this.dateType === 'month') {
          startDate = this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[0], 'yyyy-MM-dd')
          endDate = this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[1], 'yyyy-MM-dd')
        } else if (this.dateType === 'year') {
          startDate = this.$comfun.formatDate(this.$comfun.getYearStartEnd()[0], 'yyyy-MM-dd')
          endDate = this.$comfun.formatDate(this.$comfun.getYearStartEnd()[1], 'yyyy-MM-dd')
        }
        this.getOrderList(startDate, endDate)
      }
    },
    getOrderList (startDate, endDate) {
      this.tableData = []
      this.$comfun.http_post(this, `data/person/order/${this.$moment.userInfo.user.id}`, {
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          for (let t = 0; t < this.tableTitles.length; t++) {
            for (let s = 0; s < response.body[this.tableTitles[t].prop].length; s++) {
              let winnerData = {}
              winnerData[this.tableTitles[t].prop] = [response.body[this.tableTitles[t].prop][s].name, (response.body[this.tableTitles[t].prop][s].num ? response.body[this.tableTitles[t].prop][s].num : 0)]
              if (t === 0) {
                this.tableData.push(winnerData)
              } else {
                this.$set(this.tableData[s], this.tableTitles[t].prop, [response.body[this.tableTitles[t].prop][s].name, (response.body[this.tableTitles[t].prop][s].num ? response.body[this.tableTitles[t].prop][s].num : 0)])
              }
              if (t === this.tableTitles.length - 1 && s === response.body[this.tableTitles[t].prop].length - 1) {
                this.$nextTick().then(() => {
                  this.$setTimeOut('getTableDataAfter', 400)
                })
              }
            }
          }
        } else {
          this.$dialog_msg({
            msg: '获取排名数据失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.winner-list {
  position: relative;
  height: 100vh;
  .top-apps-wrap {
    position: relative;
    font-size: 0;
    padding: 0.2rem 0.6rem 0.8rem;
    text-align: center;
    transition: all 0.2s ease 0s;
    opacity: 1;
    .top-app-item {
      position: relative;
      display: inline-block;
      padding: 0.2rem;
      text-align: center;
      i {
        position: relative;
        display: inline-block;
        height: 0;
        width: 100%;
        padding-bottom: 100%;
        background-size: 80%;
        background-repeat: no-repeat;
        background-position: center;
      }
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        margin-top: 0.4rem;
        white-space: nowrap;
      }
    }
    .cur-app {
      i::before {
        content: '';
        position: absolute;
        background-color: rgb(214, 91, 10);
        width: 1rem;
        height: 1rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        bottom: -2.8rem;
        transform: rotate(45deg);
      }
      i::after {
        content: '';
        position: absolute;
        background-color: rgb(255, 255, 255);
        width: 1.4rem;
        height: 1.4rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        bottom: -3.4rem;
      }
    }
    .cur-app-0 {
      i::before {
        background-color: #0099E9;
      }
    }
    .cur-app-1 {
      i::before {
        background-color: #F39927;
      }
    }
    .cur-app-2 {
      i::before {
        background-color: #1DDAE1;
      }
    }
    .cur-app-3 {
      i::before {
        background-color: #1D8FE1;
      }
    }
    .cur-app-4 {
      i::before {
        background-color: #29AB91;
      }
    }
  }
  .top-apps-wrap-min {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #007EC8;
    font-size: 0;
    padding: 0.2rem 0.6rem 0.8rem;
    text-align: center;
    z-index: 9;
    opacity: 0;
    transition: all 0.2s ease 0s;
    .top-app-item {
      position: relative;
      display: inline-block;
      padding: 0.2rem;
      text-align: center;
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        margin-top: 0.4rem;
        white-space: nowrap;
        color: #ffffff;
      }
    }
    .cur-app {
      span::after {
        content: '';
        position: absolute;
        left: 0.2rem;
        right: 0.2rem;
        bottom: -0.5rem;
        height: 0.14rem;
        border-radius: 2rem;
        background-color: #ffffff;
      }
    }
  }
  .data-loading {
    position: absolute;
    width: 3.4rem;
    top: 34vh;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .app-pages-wrap {
    position: relative;
    transition: all 0.4s ease 0s;
  }
}
</style>
