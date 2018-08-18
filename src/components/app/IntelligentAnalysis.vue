<template>
  <div class="inteligent-analysis" ref="scroll-page" @scroll="scrollPage" @touchstart="scrollstart" @touchmove="scrollmove" @touchend="scrollend">
    <div class="top-apps-wrap-min" ref="top-apps-wrap-min" v-if="showMin">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :class="page === appIndex ? ['cur-app', `cur-app-${page}`] : ''" :style="{ 'width': `calc((100% - 5 * 2 * 0.2rem) / 5)` }" @click="toTopApp(app, appIndex)">
        <span>{{app.text}}</span>
      </div>
    </div>
    <div class="top-apps-wrap" ref="top-apps-wrap">
      <div class="top-app-item" v-for="(app, appIndex) in topApps" :key="appIndex" :class="page === appIndex ? ['cur-app', `cur-app-${page}`] : ''" :style="{ 'width': `calc((100% - 5 * 2 * 0.2rem) / 5)` }" @click="toTopApp(app, appIndex)">
        <i :style="{ 'background-image': `url(${app.icon})` }"></i>
        <span>{{app.text}}</span>
      </div>
    </div>
    <div class="app-pages-wrap" ref="app-pages-wrap">
      <template v-if="page === 0">
        <img class="data-loading" :src="require('@/assets/user-loading.gif')" v-if="dataIsLoading">
        <comm-table v-if="!dataIsLoading" :title="tableTitles" :data="tableData" :show-index="true" :rank-badge="false"></comm-table>
      </template>
      <template v-if="page === 1">
        <img class="data-loading" :src="require('@/assets/user-loading.gif')" v-if="dataIsLoading">
        <comm-table v-if="!dataIsLoading" :title="tableTitlesKpi" :data="tableDataKpi" :show-index="true" :rank-badge="false"></comm-table>
      </template>
      <template v-if="page === 2">
        <iframe frameborder="0" :style="{ 'width': '100%', 'height': '100%' }" src="http://m.dachangjr.com/h5/yongjinjiangli/yongjinjiangli.html"></iframe>
      </template>
    </div>
  </div>
</template>

<script>
import Table from '@/components/CommTable'

export default {
  name: 'AppIntelligentAnalysis',
  components: {
    'comm-table': Table
  },
  data () {
    return {
      page: 0,
      dateType: 'day',
      dataIsLoading: true,
      showMin: false,
      minStartY: -1,
      minDistanceY: -1,
      minTopDistance: 4 * 16,
      topApps: [
        {
          icon: require('@/assets/do_ssjx.png'),
          text: '即时绩效',
          minStyle: 'txt'
        },
        {
          icon: require('@/assets/do_kpi.png'),
          text: 'KPI考核',
          minStyle: 'txt'
        },
        {
          icon: require('@/assets/do_yjjl.png'),
          text: '佣金奖励',
          minStyle: 'full'
        }
      ],
      tableTitles: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '提成统计',
          prop: 'sumPref'
        },
        {
          label: '整车销售',
          prop: 'newcarPref'
        },
        {
          label: '汽车用品',
          prop: 'accessoryPerf'
        },
        {
          label: '金融',
          prop: 'financePerf'
        },
        {
          label: '二手车',
          prop: 'oldcarPerf'
        },
        {
          label: '新保',
          prop: 'insuranceNewPerf'
        },
        {
          label: '延保',
          prop: 'insuranceOldPerf'
        },
        {
          label: '工龄工资',
          prop: 'glgz'
        },
        {
          label: '其他绩效',
          prop: 'qtjx'
        },
        {
          label: '其他政策提成',
          prop: 'qtzctc'
        },
        {
          label: '贡献度',
          prop: 'gxd'
        }
      ],
      tableData: [],
      tableTitlesKpi: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '接待量',
          prop: 'receptionNum'
        },
        {
          label: '留档量',
          prop: 'fileNum'
        },
        {
          label: '留档率（%）',
          prop: 'filePer'
        },
        {
          label: '二次到店量',
          prop: 'arrival2Num'
        },
        {
          label: '二次到店率（%）',
          prop: 'arrival2Per'
        },
        {
          label: '试驾量',
          prop: 'driveNum'
        },
        {
          label: '试驾率（%）',
          prop: 'drivePer'
        },
        {
          label: '成交量',
          prop: 'closeNum'
        },
        {
          label: '成交率（%）',
          prop: 'closePer'
        },
        {
          label: '战败量',
          prop: 'failureNum'
        }
      ],
      tableDataKpi: []
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
      if (appIndex === 0 || appIndex === 1) {
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
      if (this.page === 0) {
        this.tableData = []
        this.$comfun.http_post(this, `data/person/perf/${this.$moment.userInfo.user.id}`, {
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            for (let s = 0; s < response.body.newcar.length; s++) {
              let winnerData = {}
              for (let t = 0; t < this.tableTitles.length; t++) {
                winnerData[this.tableTitles[t].prop] = response.body.newcar[s][this.tableTitles[t].prop] ? response.body.newcar[s][this.tableTitles[t].prop] : 0
              }
              this.tableData.push(winnerData)
            }
            this.$nextTick().then(() => {
              setTimeout(() => {
                this.dataIsLoading = false
              }, 100)
            })
          } else {
            this.$dialog_msg({
              msg: '获取即时绩效数据失败'
            })
          }
        })
      } else if (this.page === 1) {
        this.tableDataKpi = []
        this.$comfun.http_post(this, `data/kpi/all/${this.$moment.userInfo.user.companyId}/order`, {
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            for (let s = 0; s < response.body.result.length; s++) {
              let resultData = {}
              for (let t = 0; t < this.tableTitlesKpi.length; t++) {
                resultData[this.tableTitlesKpi[t].prop] = response.body.result[s][this.tableTitlesKpi[t].prop] ? response.body.result[s][this.tableTitlesKpi[t].prop] : 0
              }
              this.tableDataKpi.push(resultData)
            }
            this.$nextTick().then(() => {
              setTimeout(() => {
                this.dataIsLoading = false
              }, 100)
            })
          } else {
            this.$dialog_msg({
              msg: '获取kpi数据失败'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inteligent-analysis {
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
      margin: 0 0.8rem;
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
        background-color: #2291E2;
      }
    }
    .cur-app-2 {
      i::before {
        background-color: #1CDAE1;
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
