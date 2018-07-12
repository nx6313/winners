<template>
  <div id="page-home-boss" class="page-home-boss" @scroll="scrollPage">
    <div class="page-header-wrap">
      <span class="user-head" :style="{ 'background-image': `url(${defaultUserHead})` }"></span>
      <div class="user-name-wrap">
        <span class="user-name">{{userName}}</span>
      </div>
      <div class="head-tab-wrap">
        <div class="date-tab-rail" ref="date-tab-rail">
          <span v-for="(dateTab, dateTabIndex) in dateTabs" :key="dateTabIndex" :ref="'date-tab-' + dateTab.id" :class="dateTabIndex === 0 ? 'cur' : ''" :style="{ 'width': `calc(100% / ${dateTabs.length})` }" @click="toThisDateType(dateTab.id)">{{dateTab.txt}}</span>
        </div>
      </div>
      <div @touchstart.prevent="headerTouchStart" @touchmove.prevent="headerTouchMove" @touchend.prevent="headerTouchEnd" :style="headerIsLoading ? { 'height': '0', 'overflow': 'hidden' } : {}">
        <div class="date-every-wrap" ref="date-every-wrap">
          <div class="date-every-rail" ref="date-every-rail" :style="[{ 'width': `calc((100vw) / 5 * ${dateEvery.length})` }, dateEveryRailTrans !== null ? { 'transform': `translateX(${dateEveryRailTrans}px)` } : { 'transform': `translateX(calc((100vw / 5) * 3 - 100%))` }]">
            <div v-for="(dateEv, dateEvIndex) in dateEvery" :key="dateEvIndex" :class="[curHeaderDateTabType + '-' + dateEvIndex, dateEvIndex === 0 ? 'first-date' : '', dateEvIndex === dateEvery.length - 1 ? ['last-date', 'cur'] : '']" :style="{ 'width': `calc(100vw / 5)` }">
              <span class="display-show">{{dateEv.display}}</span>
              <span class="year" v-if="dateEv.year">{{dateEv.year}}</span>
            </div>
          </div>
        </div>
        <div class="summarizing-wrap">
          <div class="statistics-content">
            <chart class="policy-chart" :options="policyChartOpt" :auto-resize="true"></chart>
          </div>
        </div>
      </div>
      <div :class="['header-arrow left-arrow iconfont icon-left', curHeaderTypeIndex === 0 ? 'arrow-bound' : '']" @click.stop="arrowHeader(-1, curHeaderTypeIndex > 0)"></div>
      <div :class="['header-arrow right-arrow iconfont icon-right', curHeaderTypeIndex === summarizings.length - 1 ? 'arrow-bound' : '']" @click.stop="arrowHeader(1, curHeaderTypeIndex < summarizings.length - 1)"></div>
      <div class="header-indicator">
        <span class="header-item" v-for="(summarizing, summarizingIndex) in summarizings" :key="summarizingIndex" :style="[{ 'width': `calc(100% / ${summarizings.length})` }]">{{summarizing.title}}</span>
        <i class="indicator" :style="[{ 'left': `calc(${curHeaderTypeIndex} * 100% / ${summarizings.length} + (100% / ${summarizings.length} - 1rem) / 2)` }]"></i>
      </div>
      <div class="header-data-is-loading" v-show="headerIsLoading">
        <div class="loadster" :style="{ 'transform': 'scale(0.2, 0.2)' }">
          <div class="loadster__body">
            <div class="body__gum"></div>
          </div>
          <div class="loadster__mask"></div>
          <div class="loadster__head">
            <div class="head__face"></div>
            <div class="head__ear"></div>
            <div class="head__eye"></div>
            <div class="head__horn">
              <div class="horn__circle"></div>
            </div>
            <div class="head__smile"></div>
            <div class="head__hand"></div>
          </div>
          <div class="loadster__bottom">
            <div class="bottom__foot"></div>
          </div>
        </div>
        <span class="loading-tip">正在加载中...</span>
      </div>
    </div>
    <div class="online-count-wrap">
        <span>在线销售人员</span>
        <span class="online-count">~</span>
        <span>人</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;销售代表</span>
        <span class="online-count">~</span>
        <span>人</span>
    </div>
    <div class="sell-chart-wrap">
      <div class="sell-tab-wrap" ref="sell-tab-wrap" :style="isFixed ? { 'position': 'fixed', 'top': '0px', 'left': '0px', 'background': 'rgba(255, 255, 255, 1)' } : {}">
        <div class="date-tab-rail">
          <span v-for="(dateTab, dateTabIndex) in dateTabs" :key="dateTabIndex" v-if="dateTabIndex > 0" :class="dateTabIndex === 1 ? 'cur' : ''" :style="{ 'width': `calc(100% / ${dateTabs.length - 1})` }">{{dateTab.txt}}</span>
        </div>
      </div>
      <div class="sell-tab-wrap-replace" ref="sell-tab-wrap-replace" :style="{ 'height': sellTabWrapHeight }" v-show="isFixed"></div>
      <chart class="zc-chart" :options="zcChartOpt" :auto-resize="true"></chart>
      <chart class="qcyp-chart" :options="qcypChartOpt" :auto-resize="true"></chart>
      <chart class="jr-chart" :options="jrChartOpt" :auto-resize="true"></chart>
      <chart class="bx-chart" :options="bxChartOpt" :auto-resize="true"></chart>
      <chart class="esc-chart" :options="escChartOpt" :auto-resize="true"></chart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeBoss',
  data () {
    return {
      defaultUserHead: '',
      headerIsLoading: true,
      curHeaderDateTabType: null,
      headerDateTabTransXMax: 0,
      headerDateTabTransXCeilWidth: 0,
      headerTouchStartTransX: null,
      headerTouchStartX: -1,
      dateEveryRailTrans: null,
      headerDateMoveToTansX: -1,
      headerTabToggle: 0,
      moveDistance: 0,
      curHeaderSearchDate: null,
      curHeaderTypeIndex: 0,
      reg: /[-?\d.]+/g,
      isFixed: false,
      sellTabWrapScrollTop: 23 * 16,
      sellTabWrapHeight: 3.9 * 16 + 'px',
      userName: '大昌集团',
      userLevel: '金牌销售',
      dateTabs: [
        {
          id: 'day',
          txt: '日'
        },
        {
          id: 'week',
          txt: '周'
        },
        {
          id: 'month',
          txt: '月'
        },
        {
          id: 'year',
          txt: '年'
        }
      ],
      dateEvery: [],
      summarizings: [
        {
          title: '整车销售',
          unit: '台'
        },
        {
          title: '汽车用品',
          des: '万元'
        },
        {
          title: '金融',
          des: '单'
        },
        {
          title: '保险',
          des: '单'
        },
        {
          title: '二手车',
          des: '台'
        }
      ],
      policyChartOpt: {
        title: {
          text: '{money|1230}\t\t{unit|台}\n整车销售',
          left: 'center',
          top: '34%',
          textStyle: {
            color: '#73a7e3',
            fontSize: 13,
            align: 'center',
            lineHeight: 20,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif',
            rich: {
              money: {
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 'bold',
                verticalAlign: 'bottom',
                fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
              },
              unit: {
                color: '#ffffff',
                fontSize: 8,
                fontWeight: 'bold',
                verticalAlign: 'bottom',
                fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} 万元 ({d}%)',
          backgroundColor: 'rgba(80, 30, 30, .8)'
        },
        series: [
          {
            name: '整车销售',
            type: 'pie',
            radius: ['100%', '72%'],
            label: {
              normal: {
                show: false,
                position: 'outside',
                formatter: [
                  '{rate|{d}}\t\t{rateTip|%}',
                  '{c} 万元',
                  '{b}'
                ].join('\n'),
                lineHeight: 10,
                fontSize: 10,
                color: '#4D4D4D',
                fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif',
                rich: {
                  rate: {
                    fontSize: 16,
                    color: '#003B8D',
                    fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif',
                    verticalAlign: 'bottom',
                    fontWeight: 'bold'
                  },
                  rateTip: {
                    fontSize: 12,
                    color: '#003B8D',
                    fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif',
                    verticalAlign: 'bottom'
                  }
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 40,
                length2: 20,
                smooth: true
              }
            },
            data: [
              {
                value: 335,
                name: '整车销售'
              },
              {
                value: 20,
                name: '整车'
              },
              {
                value: 60,
                name: '保险'
              },
              {
                value: 335,
                name: '二手车'
              },
              {
                value: 335,
                name: '金融'
              },
              {
                value: 335,
                name: '汽车用品'
              }
            ]
          }
        ],
        animationDuration: 2000
      },
      zcChartOpt: {
        title: {
          text: '整车销售',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      },
      qcypChartOpt: {
        title: {
          text: '汽车用品',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      },
      jrChartOpt: {
        title: {
          text: '金融',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      },
      bxChartOpt: {
        title: {
          text: '保险',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      },
      escChartOpt: {
        title: {
          text: '二手车',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      }
    }
  },
  beforeCreate () {
    this.$comfun.http_post(this, 'data/senior/contrast/8')
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.defaultUserHead = this.$moment.defaultHead
    this.resetDateEvery(this.dateTabs[0].id)
  },
  methods: {
    scrollPage () {
      var pageScrollTop = document.querySelector('#page-home-boss').scrollTop
      if (pageScrollTop > this.sellTabWrapScrollTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    toThisDateType (dateType) {
      this.headerIsLoading = true
      var target = this.$refs['date-tab-' + dateType][0]
      for (let d = 0; d < target.parentNode.childNodes.length; d++) {
        target.parentNode.childNodes[d].classList.remove('cur')
      }
      target.classList.add('cur')
      this.resetDateEvery(dateType)
    },
    resetDateEvery (curDateType) {
      this.curHeaderDateTabType = curDateType
      this.dateEvery.splice(0, this.dateEvery.length)
      switch (curDateType) {
        case 'day':
          this.getDateSection('2017/01/01', curDateType, 'M/d')
          break
        case 'week':
          this.getDateSection('2017/01/01', curDateType, 'M/d')
          break
        case 'month':
          this.getDateSection('2017/01/01', curDateType, 'M')
          break
        case 'year':
          this.getDateSection('2017/01/01', curDateType, 'yyyy')
          break
      }
      this.curHeaderSearchDate = this.dateEvery[this.dateEvery.length - 1]
      this.searchHeaderData()
      this.dateEveryRailTrans = -document.body.clientWidth
      this.$nextTick().then(() => {
        setTimeout(() => {
          var dateEveryRail = this.$refs['date-every-rail']
          if (dateEveryRail) {
            this.dateEveryRailTrans = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth
            this.headerDateTabTransXMax = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth

            this.headerDateTabTransXCeilWidth = dateEveryRail.getElementsByClassName('cur')[0].clientWidth
          }
          this.headerIsLoading = false
        }, 1000)
      })
    },
    getDateSection (min, type, format) {
      var startTime = new Date(min)
      var endTime = new Date()
      var hasWeek = {}
      var hasMonth = {}
      var hasYear = {}
      var dateIndex = 0
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear()
        var month_ = startTime.getMonth() + 1
        var month = (startTime.getMonth() + 1).toString().length === 1 ? '0' + (startTime.getMonth() + 1) : (startTime.getMonth() + 1)
        var day_ = startTime.getDate()
        var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        var week = startTime.getDay()
        var thisDate = new Date(year + '/' + month + '/' + day)
        startTime.setDate(startTime.getDate() + 1)
        var curValData = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
        var curDisplayData = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), format)
        let dateObj = {}
        if (type === 'day') {
          if (thisDate.getTime() === new Date(this.$comfun.formatDate(new Date(), 'yyyy/MM/dd')).getTime()) {
            dateObj.display = '今日'
            dateObj.val = curValData
          } else {
            dateObj.display = curDisplayData
            dateObj.val = curValData
            if (Number(month) === 1 && Number(day) === 1) {
              dateObj.year = year
            }
          }
          this.dateEvery.push(dateObj)
        } else if (type === 'week') {
          if (week === 0) {
            if (hasWeek['week-' + dateIndex]) {
              dateObj = hasWeek['week-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            dateObj.val[0] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
            if (endTime.getTime() - startTime.getTime() < 0) {
              dateObj.display = '本周'
            } else {
              dateObj.display = curDisplayData
            }
            if (year !== this.$comfun.getTargetDate(7, new Date(year + '/' + month + '/' + day)).getFullYear()) {
              dateObj.year = year
            }
            if (hasWeek['week-' + dateIndex] === undefined) {
              hasWeek['week-' + dateIndex] = dateObj
            }
          } else {
            if (hasWeek['week-' + dateIndex]) {
              dateObj = hasWeek['week-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            if (week === 6 || endTime.getTime() - startTime.getTime() < 0) {
              dateObj.val[1] = curValData
              if (endTime.getTime() - startTime.getTime() < 0) {
                dateObj.display = '本周'
              } else {
                dateObj.display += '-' + curDisplayData
              }
            }
            if (hasWeek['week-' + dateIndex] === undefined) {
              hasWeek['week-' + dateIndex] = dateObj
            }
            if (week === 6 || endTime.getTime() - startTime.getTime() < 0) {
              dateIndex += 1
            }
          }
        } else if (type === 'month') {
          if (day_ === 1) {
            if (hasMonth['month-' + dateIndex]) {
              dateObj = hasMonth['month-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            dateObj.val[0] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
            if (endTime.getTime() - startTime.getTime() < 0) {
              dateObj.display = '本月'
            } else {
              dateObj.display = curDisplayData
            }
            if (month_ === 12) {
              dateObj.year = year
            }
            if (hasMonth['month-' + dateIndex] === undefined) {
              hasMonth['month-' + dateIndex] = dateObj
            }
          } else {
            if (hasMonth['month-' + dateIndex]) {
              dateObj = hasMonth['month-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            if (this.$comfun.getLastDay(year, month_).getDate() === day_ || endTime.getTime() - startTime.getTime() < 0) {
              dateObj.val[1] = curValData
              if (endTime.getTime() - startTime.getTime() < 0) {
                dateObj.display = '本月'
              }
            }
            if (hasMonth['month-' + dateIndex] === undefined) {
              hasMonth['month-' + dateIndex] = dateObj
            }
            if (this.$comfun.getLastDay(year, month_).getDate() === day_ || endTime.getTime() - startTime.getTime() < 0) {
              dateIndex += 1
            }
          }
        } else if (type === 'year') {
          if (month_ === 1 && day_ === 1) {
            if (hasYear['year-' + dateIndex]) {
              dateObj = hasYear['year-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            dateObj.val[0] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
            if (endTime.getTime() - startTime.getTime() < 0) {
              dateObj.display = '本年'
            } else {
              dateObj.display = curDisplayData
            }
            if (hasYear['year-' + dateIndex] === undefined) {
              hasYear['year-' + dateIndex] = dateObj
            }
          } else {
            if (hasYear['year-' + dateIndex]) {
              dateObj = hasYear['year-' + dateIndex]
            } else {
              if (dateObj.val === undefined) {
                dateObj.val = []
              }
            }
            if ((month_ === 12 && this.$comfun.getLastDay(year, month_).getDate() === day_) || endTime.getTime() - startTime.getTime() < 0) {
              dateObj.val[1] = curValData
              if (endTime.getTime() - startTime.getTime() < 0) {
                dateObj.display = '本年'
              }
            }
            if (hasYear['year-' + dateIndex] === undefined) {
              hasYear['year-' + dateIndex] = dateObj
            }
            if ((month_ === 12 && this.$comfun.getLastDay(year, month_).getDate() === day_) || endTime.getTime() - startTime.getTime() < 0) {
              dateIndex += 1
            }
          }
        }
      }
      if (type === 'week') {
        for (let key in hasWeek) {
          this.dateEvery.push(hasWeek[key])
        }
      } else if (type === 'month') {
        for (let key in hasMonth) {
          this.dateEvery.push(hasMonth[key])
        }
      } else if (type === 'year') {
        for (let key in hasYear) {
          this.dateEvery.push(hasYear[key])
        }
      }
    },
    circleProgressVal (progress) {
      return `<span style="font-size: 1.2rem;">${progress}</span><span style="font-size: 0.8rem; margin-left: 0.2rem;">%</span>`
    },
    progressRotate (ori, progress) {
      // -135 >>> 45
      if (ori === 'left') {
        if (progress > 50) {
          return `rotate(${(progress - 50) * 3.6 - 135}deg)`
        }
      } else if (ori === 'right') {
        if (progress > 50) {
          return 'rotate(45deg)'
        } else {
          return `rotate(${progress * 3.6 - 135}deg)`
        }
      }
      return 'rotate(-135deg)'
    },
    getWaterHeight (progress) {
      // -120 >>> -10 %
      return progress * 1.1 - 120 + '%'
    },
    headerTouchStart () {
      this.headerTouchStartX = event.touches[0].pageX
      this.headerTouchStartTransX = Number(this.$refs['date-every-rail'].style.transform.match(this.reg)[0])
      this.$refs['date-every-rail'].style['transition-duration'] = '0s'
    },
    headerTouchMove () {
      if (this.headerTouchStartX < 0) {
        this.headerTouchStartX = event.touches[0].pageX
        this.headerTouchStartTransX = Number(this.$refs['date-every-rail'].style.transform.match(this.reg)[0])
        this.$refs['date-every-rail'].style['transition-duration'] = '0s'
      }
      this.moveDistance = (event.touches[0].pageX - this.headerTouchStartX) * 0.8
      this.headerDateMoveToTansX = this.headerTouchStartTransX + this.moveDistance
      if (this.headerDateTabTransXMax < 0) {
        if (this.headerDateMoveToTansX > (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2) {
          this.headerDateMoveToTansX = (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2
          if (this.curHeaderDateTabType !== 'day') {
            this.headerTabToggle = -1
          } else {
            this.headerTabToggle = 0
          }
        } else if (this.headerDateMoveToTansX < this.headerDateTabTransXMax) {
          this.headerDateMoveToTansX = this.headerDateTabTransXMax
          if (this.curHeaderDateTabType !== 'year') {
            this.headerTabToggle = 1
          } else {
            this.headerTabToggle = 0
          }
        } else {
          this.headerTabToggle = 0
        }
      } else {
        if (this.headerDateMoveToTansX > (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2) {
          this.headerDateMoveToTansX = (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2
          if (this.curHeaderDateTabType !== 'day') {
            this.headerTabToggle = -1
          } else {
            this.headerTabToggle = 0
          }
        } else if (this.headerDateMoveToTansX < this.headerDateTabTransXMax) {
          this.headerDateMoveToTansX = this.headerDateTabTransXMax
          if (this.curHeaderDateTabType !== 'year') {
            this.headerTabToggle = 1
          } else {
            this.headerTabToggle = 0
          }
        } else {
          this.headerTabToggle = 0
        }
      }
      this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
    },
    headerTouchEnd () {
      this.$refs['date-every-rail'].style['transition-duration'] = '0.2s'
      var curDateEvery = this.$refs['date-every-rail'].getElementsByClassName('cur')[0]
      if (this.headerTabToggle < 0) {
        let toTabType = ''
        if (this.curHeaderDateTabType === 'week') {
          toTabType = 'day'
        } else if (this.curHeaderDateTabType === 'month') {
          toTabType = 'week'
        } else if (this.curHeaderDateTabType === 'year') {
          toTabType = 'month'
        }
        if (toTabType !== '') {
          this.toThisDateType(toTabType)
        }
      } else if (this.headerTabToggle > 0) {
        let toTabType = ''
        if (this.curHeaderDateTabType === 'day') {
          toTabType = 'week'
        } else if (this.curHeaderDateTabType === 'week') {
          toTabType = 'month'
        } else if (this.curHeaderDateTabType === 'month') {
          toTabType = 'year'
        }
        if (toTabType !== '') {
          this.toThisDateType(toTabType)
        }
      } else {
        this.headerTouchStartTransX = Number(this.$refs['date-every-rail'].style.transform.match(this.reg)[0])
        var moveOverItemNum = Math.floor(this.moveDistance / this.headerDateTabTransXCeilWidth)
        var moveOverItemBalanceNum = this.moveDistance % this.headerDateTabTransXCeilWidth
        if (this.moveDistance > 0) {
          if (!curDateEvery.classList.contains('first-date')) {
            if (moveOverItemBalanceNum > this.headerDateTabTransXCeilWidth / 2) {
              this.headerDateMoveToTansX = this.headerTouchStartTransX + (this.headerDateTabTransXCeilWidth - moveOverItemBalanceNum)
              this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
              curDateEvery.classList.remove('cur')
              let moveToIndex = Number(curDateEvery.classList[0].split('-')[1]) - (moveOverItemNum + 1)
              if (moveToIndex < 0) {
                moveToIndex = 0
              }
              document.querySelector('.' + this.curHeaderDateTabType + '-' + moveToIndex).classList.add('cur')
              this.curHeaderSearchDate = this.dateEvery[moveToIndex]
              this.searchHeaderData()
            } else {
              let moveToIndex = Number(curDateEvery.classList[0].split('-')[1])
              if (moveOverItemNum >= 1) {
                this.headerDateMoveToTansX -= moveOverItemBalanceNum
                moveToIndex -= moveOverItemNum
                curDateEvery.classList.remove('cur')
                if (moveToIndex < 0) {
                  moveToIndex = 0
                }
                document.querySelector('.' + this.curHeaderDateTabType + '-' + moveToIndex).classList.add('cur')
              } else {
                this.headerDateMoveToTansX -= this.moveDistance
              }
              this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
              this.curHeaderSearchDate = this.dateEvery[moveToIndex]
              this.searchHeaderData()
            }
          }
        } else {
          if (!curDateEvery.classList.contains('last-date')) {
            if (Math.abs(moveOverItemBalanceNum) > this.headerDateTabTransXCeilWidth / 2) {
              this.headerDateMoveToTansX = this.headerTouchStartTransX - (this.headerDateTabTransXCeilWidth - Math.abs(moveOverItemBalanceNum))
              this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
              curDateEvery.classList.remove('cur')
              let moveToIndex = Number(curDateEvery.classList[0].split('-')[1]) + Math.abs(moveOverItemNum)
              if (moveToIndex > this.dateEvery.length - 1) {
                moveToIndex = this.dateEvery.length - 1
              }
              document.querySelector('.' + this.curHeaderDateTabType + '-' + moveToIndex).classList.add('cur')
              this.curHeaderSearchDate = this.dateEvery[moveToIndex]
              this.searchHeaderData()
            } else {
              let moveToIndex = Number(curDateEvery.classList[0].split('-')[1])
              if (Math.abs(moveOverItemNum) >= 1) {
                this.headerDateMoveToTansX -= moveOverItemBalanceNum
                moveToIndex += (Math.abs(moveOverItemNum) - 1)
                curDateEvery.classList.remove('cur')
                if (moveToIndex > this.dateEvery.length - 1) {
                  moveToIndex = this.dateEvery.length - 1
                }
                document.querySelector('.' + this.curHeaderDateTabType + '-' + moveToIndex).classList.add('cur')
              } else {
                this.headerDateMoveToTansX += this.moveDistance
              }
              this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
              this.curHeaderSearchDate = this.dateEvery[moveToIndex]
              this.searchHeaderData()
            }
          }
        }
      }
      this.moveDistance = 0
      this.headerDateMoveToTansX = -1
      this.headerTabToggle = 0
    },
    searchHeaderData () {
      // this.curHeaderSearchDate
    },
    arrowHeader (direction, flag) {
      if (flag) {
        this.curHeaderTypeIndex += direction
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header-wrap {
  position: relative;
  background-color: #0F4E97;
  color: #ffffff;
  font-size: 0.8rem;
  padding: 0.6rem 0.8rem;
  .user-head {
    position: absolute;
    top: 1.2rem;
    left: 0.6rem;
    display: block;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background-color: #383838;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
  }
  .user-name-wrap {
    position: relative;
    margin-left: 3.8rem;
    margin-top: 1.2rem;
    .user-name {
      position: relative;
      display: inline-block;
      font-size: 1rem;
      vertical-align: bottom;
    }
  }
  .head-tab-wrap {
    position: relative;
    margin-top: 1.4rem;
    padding: 0 1.6rem;
    .date-tab-rail {
      position: relative;
      font-size: 0px;
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        text-align: center;
        padding: 0.4rem 0;
        color: rgb(67, 140, 223);
        transition: all 0.3s ease 0s;
      }
      span.cur {
        color: rgb(255, 255, 255);
      }
    }
  }
  .head-tab-wrap::after {
    content: '';
    position: absolute;
    left: -5.4rem;
    right: -0.8rem;
    bottom: -0.4rem;
    border-bottom: 0.1rem solid #2168BB;
  }
  .date-every-wrap {
    padding: 1rem 0.6rem 1rem;
    overflow: hidden;
    .date-every-rail {
      position: relative;
      white-space: nowrap;
      overflow-x: visible;
      transition: all 0.2s ease 0s;
      div {
        position: relative;
        display: inline-block;
        font-size: 0.7rem;
        text-align: center;
        color: rgb(67, 140, 223);
        transition: all 0.3s ease 0s;
        .display-show {
          position: relative;
          display: inline-block;
        }
        .year {
          position: absolute;
          display: inline-block;
          text-align: center;
          width: 100%;
          left: 0;
          right: 0;
          margin: 0 auto;
          top: 1rem;
        }
      }
      div.cur {
        color: rgb(255, 255, 255);
      }
    }
  }
  .summarizing-wrap {
    position: relative;
    padding: 0rem 0 2.4rem;
    height: 8.4rem;
    .statistics-content {
      position: absolute;
      height: 100%;
      width: calc(100% - 8rem);
      right: 4rem;
      top: 0rem;
      pointer-events: none;
      overflow: hidden;
    }
  }
  .header-arrow {
    position: absolute;
    font-size: 2.4rem;
    width: 3.6rem;
    height: 8rem;
    line-height: 8rem;
    top: 8.6rem;
    color: #73a7e3;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .left-arrow {
    left: 1.2rem;
    text-align: left;
  }
  .right-arrow {
    right: 1.2rem;
    text-align: right;
  }
  .arrow-bound {
    color: rgba(115, 167, 227, .3);
  }
  .header-indicator {
    position: absolute;
    left: 0.8rem;
    right: 0.8rem;
    bottom: 1.4rem;
    .header-item {
      position: relative;
      display: inline-block;
      text-align: center;
      color: #73a7e3;
    }
    .indicator {
      position: absolute;
      width: 1rem;
      height: 4px;
      border-radius: 4px;
      background-color: rgba(115, 167, 227, 0.6);
      bottom: -0.6rem;
      left: 0;
      transition: all 0.4s ease 0s;
    }
  }
  .header-data-is-loading {
    height: 11.64rem;
    padding: 1rem 0;
    text-align: center;
    .loadster {
      margin: 4rem;
    }
    .loadster__body::before {
      background-color: #0F4E97;
    }
    .loadster__mask {
      background-color: #0F4E97;
    }
    .loadster__mask::before {
      background-color: #0F4E97;
    }
    .loadster__mask::after {
      background-color: #0F4E97;
    }
    .loadster__head {
      background-color: #0F4E97;
    }
    .loadster__bottom {
      background-color: #0F4E97;
    }
    span.loading-tip {
      position: absolute;
      color: #ffffff;
      font-size: 0.8rem;
      height: 4rem;
      line-height: 4rem;
      top: 11rem;
    }
  }
}
.policy-chart {
  background-color: transparent;
  width: 100% !important;
  height: 8rem;
  padding: 0;
}
.online-count-wrap {
  position: relative;
  font-size: 0.84rem;
  padding: 1rem 0.8rem;
  background-color: #F5F5F5;
  .online-count {
    margin: 0 0.2rem;
    color: #ff721f;
  }
}
.sell-chart-wrap {
  background-color: rgb(255, 255, 255);
  .sell-tab-wrap {
    position: relative;
    width: calc(100% - 3.2rem);
    padding: 1rem 1.6rem 0.4rem;
    margin-bottom: 1rem;
    background-color: rgb(255, 255, 255);
    z-index: 9999999;
    .date-tab-rail {
      position: relative;
      font-size: 0px;
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        text-align: center;
        padding: 0.4rem 0;
        color: #a5a5a5;
        transition: all 0.3s ease 0s;
      }
      span.cur {
        color: #246dc1;
      }
      span.cur::after {
        content: '';
        position: absolute;
        left: 20%;
        right: 20%;
        bottom: -0.4rem;
        border-bottom: 4px solid #246dc1;
        z-index: 9;
      }
    }
  }
  .sell-tab-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0rem;
    border-bottom: 1px solid #eeeeee;
  }
  .sell-tab-wrap-replace {
    position: relative;
  }
  .echarts {
    height: 16rem;
  }
}
</style>
