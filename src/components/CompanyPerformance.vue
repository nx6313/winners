<template>
  <div id="page-company-performance" class="page-company-performance" @scroll="scrollPage">
    <div class="page-header-wrap">
      <span class="user-head" :style="{ 'background-image': `url(${defaultUserHead})` }"></span>
      <div class="user-name-wrap">
        <span class="user-name">{{userName}}</span>
        <div class="seeing-user-name">
          <span>正在查看</span>
          <span class="see-user-name" v-if="seeingUser.name">{{seeingUser.name}}</span>
          <span class="see-user-name" v-if="!seeingUser.name">~</span>
        </div>
      </div>
      <div class="user-tab-wrap">
        <div :class="['left-arrow iconfont icon-left', curSeeUserIndex === 0 ? 'arrow-bound' : '']" @click="arrowUsers(-1, curSeeUserIndex > 0)"></div>
        <div class="user-info-wrap">
          <div class="user-tab-rail" ref="user-tab-rail" :style="{ 'transform': `translateX(0px)` }">
            <span class="user-info-item" v-for="(userTab, userTabIndex) in userTabs" :key="userTabIndex" :ref="'date-tab-' + userTab.userId" :class="userTabIndex === 0 ? 'cur' : ''" :style="{ 'width': `calc(100% / 6)` }" @click="seeThisUser(userTab, userTabIndex)">
              <i class="user-head" :style="userTab.head ? { 'background-image': `url(${userTab.head})` } : { 'background-image': `url(${defaultUserHead})` }"></i>
              <span class="user-name">{{userTab.name}}</span>
            </span>
          </div>
        </div>
        <div :class="['right-arrow iconfont icon-right', curSeeUserIndex === userTabs.length - 1 ? 'arrow-bound' : '']" @click="arrowUsers(1, curSeeUserIndex < userTabs.length - 1)"></div>
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
          <div class="progress-wrap" v-for="(summarizing, summarizingIndex) in summarizings" :key="summarizingIndex" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})`, 'left': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} * ${summarizingIndex} + ${summarizingIndex} * 2 * 0.2rem)` }">
            <div class="wrapper right" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} / 2)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})` }">
              <div class="circle-progress rightcircle" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} - 6px)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} - 6px)`, 'transform': progressRotate('right', summarizing.progress) }"></div>
            </div>
            <div class="wrapper left" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} / 2)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})` }">
              <div class="circle-progress leftcircle" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} - 6px)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} - 6px)`, 'transform': progressRotate('left', summarizing.progress) }"></div>
            </div>
            <div class="progress-val" :style="{ 'line-height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})` }" v-html="circleProgressVal(summarizing.progress)"></div>
            <div class="water-wrap">
              <div class="water-wave" :style="{ 'bottom': getWaterHeight(summarizing.progress) }"></div>
            </div>
          </div>
          <div class="progress-des-wrap" v-for="(summarizingDes, summarizingDesIndex) in summarizings" :key="'des-' + summarizingDesIndex" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length})`, 'left': `calc((100vw - 1.6rem - ${summarizings.length - 1} * 0.4rem) / ${summarizings.length} * ${summarizingDesIndex} + ${summarizingDesIndex} * 2 * 0.2rem)` }">
            <span class="title">{{summarizingDes.title}}</span>
            <span class="num" :ref="'des-num-' + summarizingDesIndex">{{summarizingDes.num}}</span>
            <span class="des">{{summarizingDes.des}}</span>
          </div>
        </div>
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
    <div class="header-date-data-des" :style="headerIsLoading ? { 'max-height': '0' } : {}">
      <chart class="mlv-chart" :options="mlvChartOpt" :auto-resize="true"></chart>
    </div>
    <div class="sell-chart-wrap">
      <div class="sell-tab-wrap" ref="sell-tab-wrap" :style="isFixed ? { 'position': 'fixed', 'top': '0px', 'left': '0px', 'background': 'rgba(255, 255, 255, 1)' } : {}">
        <div class="date-tab-rail">
          <span v-for="(dateTab, dateTabIndex) in dateTabs" :key="dateTabIndex" v-if="dateTabIndex > 0" :class="dateTabIndex === 1 ? 'cur' : ''" :style="{ 'width': `calc(100% / ${dateTabs.length - 1})` }" @click="changeDate(dateTab, dateTabIndex)">{{dateTab.txt}}</span>
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
  name: 'CompanyPerformance',
  data () {
    return {
      defaultUserHead: '',
      headerIsLoading: true,
      curHeaderDateTabType: null,
      curSeeUserIndex: 0,
      seeingUser: {},
      headerDateTabTransXMax: 0,
      headerDateTabTransXCeilWidth: 0,
      headerTouchStartTransX: null,
      headerTouchStartX: -1,
      dateEveryRailTrans: null,
      headerDateMoveToTansX: -1,
      headerTabToggle: 0,
      moveDistance: 0,
      curHeaderSearchDate: null,
      userTabTransXCurPage: 0,
      userTabTransXPageWidth: 0,
      userTabTransXCeilWidth: 0,
      reg: /[-?\d.]+/g,
      isFixed: false,
      sellTabWrapScrollTop: 45.2 * 16,
      sellTabWrapHeight: 3.9 * 16 + 'px',
      userName: '集团各厂销售业绩',
      userTabs: [],
      curDateTab: null,
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
          progress: 0,
          title: '整车',
          num: 0,
          des: '销售（台）'
        },
        {
          progress: 0,
          title: '汽车用品',
          num: 0,
          des: '销售额（元）'
        },
        {
          progress: 0,
          title: '金融',
          num: 0,
          des: '信贷量（台）'
        },
        {
          progress: 0,
          title: '保险',
          num: 0,
          des: '投保量（单）'
        },
        {
          progress: 0,
          title: '二手车',
          num: 0,
          des: '销售（台）'
        }
      ],
      mlvChartOpt: {
        title: {
          text: '{money|0}\t\t{unit|元}\n综合毛利',
          left: 'center',
          top: '38%',
          textStyle: {
            color: '#4D4D4D',
            fontSize: 13,
            align: 'center',
            lineHeight: 20,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif',
            rich: {
              money: {
                color: '#ff721f',
                fontSize: 20,
                fontWeight: 'bold',
                verticalAlign: 'bottom',
                fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
              },
              unit: {
                color: '#ff721f',
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
          formatter: '{a} <br/>{b}: {c} 元 ({d}%)',
          backgroundColor: 'rgba(80, 30, 30, .8)'
        },
        series: [
          {
            name: '毛利占比率',
            type: 'pie',
            center: ['50%', '46%'],
            radius: ['44%', '30%'],
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: [
                  '{rate|{d}}\t\t{rateTip|%}',
                  '{c} 元',
                  '{b}'
                ].join('\n'),
                lineHeight: 10,
                fontSize: 8,
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
                value: 0,
                name: '裸车毛利'
              },
              {
                value: 0,
                name: '保险'
              },
              {
                value: 0,
                name: '二手车'
              },
              {
                value: 0,
                name: '金融'
              },
              {
                value: 0,
                name: '汽车用品'
              }
            ]
          }
        ],
        animationDuration: 2000
      },
      zcChartOpt: {
        title: {
          text: '整车 / 台',
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
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ED8D1B'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#E6B940'
                }, {
                  offset: 0.5, color: '#408AE6'
                }, {
                  offset: 1, color: '#2FE321'
                }]
              }
            }
          }
        ],
        animationDuration: 2000
      },
      qcypChartOpt: {
        title: {
          text: '汽车用品 / 元',
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
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: '60'
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ED8D1B'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#E6B940'
                }, {
                  offset: 0.5, color: '#408AE6'
                }, {
                  offset: 1, color: '#2FE321'
                }]
              }
            }
          }
        ],
        animationDuration: 2000
      },
      jrChartOpt: {
        title: {
          text: '金融 / 台',
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
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ED8D1B'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#E6B940'
                }, {
                  offset: 0.5, color: '#408AE6'
                }, {
                  offset: 1, color: '#2FE321'
                }]
              }
            }
          }
        ],
        animationDuration: 2000
      },
      bxChartOpt: {
        title: {
          text: '保险 / 单',
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
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ED8D1B'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#E6B940'
                }, {
                  offset: 0.5, color: '#408AE6'
                }, {
                  offset: 1, color: '#2FE321'
                }]
              }
            }
          }
        ],
        animationDuration: 2000
      },
      escChartOpt: {
        title: {
          text: '二手车 / 台',
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
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ED8D1B'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#E6B940'
                }, {
                  offset: 0.5, color: '#408AE6'
                }, {
                  offset: 1, color: '#2FE321'
                }]
              }
            }
          }
        ],
        animationDuration: 2000
      }
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.defaultUserHead = this.$moment.defaultDcHead
    this.userTabTransXPageWidth = document.body.clientWidth - 1.6 * 16 - 3.2 * 16
    this.userTabTransXCeilWidth = (document.body.clientWidth - 1.6 * 16 - 3.2 * 16) / 6
    this.curDateTab = this.dateTabs[1]

    this.$comfun.http_post(this, `data/public/query/company`).then((response) => {
      if (response.body.success === '1') {
        for (let u = 0; u < response.body.result.length; u++) {
          this.userTabs.push({
            userId: response.body.result[u].id,
            head: response.body.result[u].id ? this.$moment.HttpAddress_root + 'image/' + response.body.result[u].id + '.png' : '',
            name: response.body.result[u].name
          })
        }
        this.seeingUser = this.userTabs[0]

        this.resetDateEvery(this.dateTabs[0].id)

        setTimeout(() => {
          var startDate = this.$comfun.formatDate(this.$comfun.getTargetDate(-7), 'yyyy-MM-dd')
          var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
          this.getLineChartData(2, startDate, endDate)
        }, 400)
      }
    })
  },
  methods: {
    scrollPage () {
      var pageScrollTop = document.querySelector('#page-company-performance').scrollTop
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
          this.getDateSection(curDateType, 'M/d').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'week':
          this.getDateSection(curDateType, 'M/d').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'month':
          this.getDateSection(curDateType, 'M').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'year':
          this.getDateSection(curDateType, 'yyyy').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
      }
    },
    loadHeaderAfterDateSection () {
      this.dateEveryRailTrans = -document.body.clientWidth
      this.$nextTick().then(() => {
        setTimeout(() => {
          this.curHeaderSearchDate = this.dateEvery[this.dateEvery.length - 1]
          this.searchHeaderData()
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
    getDateSection (type, format) {
      var dateSectionPromise = new Promise((resolve, reject) => {
        let dateObj = {}
        if (type === 'day') {
          for (let d = 6; d >= 0; d--) {
            dateObj = {}
            let _date = this.$comfun.getTargetDate(-d)
            let _year = _date.getFullYear()
            let _month = _date.getMonth()
            let _day = _date.getDate()
            dateObj.val = this.$comfun.formatDate(_date, 'yyyy-MM-dd')
            if (d === 0) {
              dateObj.display = '今日'
            } else {
              dateObj.display = this.$comfun.formatDate(_date, format)
            }
            if (Number(_month) === 1 && Number(_day) === 1) {
              dateObj.year = _year
            }
            this.dateEvery.push(dateObj)
          }
        } else if (type === 'week') {
          for (let w = 2; w >= 0; w--) {
            dateObj = {}
            let _dateStart = this.$comfun.getWeekStartEnd(-w)[0]
            let _dateEnd = this.$comfun.getWeekStartEnd(-w)[1]
            let _yearStart = _dateStart.getFullYear()
            let _yearEnd = _dateEnd.getFullYear()
            dateObj.val = [this.$comfun.formatDate(_dateStart, 'yyyy-MM-dd'), this.$comfun.formatDate(_dateEnd, 'yyyy-MM-dd')]
            if (w === 0) {
              dateObj.display = '本周'
            } else {
              dateObj.display = this.$comfun.formatDate(_dateStart, format) + '-' + this.$comfun.formatDate(_dateEnd, format)
            }
            if (Number(_yearStart) !== Number(_yearEnd)) {
              dateObj.year = _yearEnd
            }
            this.dateEvery.push(dateObj)
          }
        } else if (type === 'month') {
          for (let m = 2; m >= 0; m--) {
            dateObj = {}
            let _dateStart = this.$comfun.getMonthStartEnd(-m)[0]
            let _dateEnd = this.$comfun.getMonthStartEnd(-m)[1]
            let _yearStart = _dateStart.getFullYear()
            let _yearEnd = _dateEnd.getFullYear()
            dateObj.val = [this.$comfun.formatDate(_dateStart, 'yyyy-MM-dd'), this.$comfun.formatDate(_dateEnd, 'yyyy-MM-dd')]
            if (m === 0) {
              dateObj.display = '本月'
            } else {
              dateObj.display = this.$comfun.formatDate(_dateStart, format)
            }
            if (Number(_yearStart) !== Number(_yearEnd)) {
              dateObj.year = _yearEnd
            }
            this.dateEvery.push(dateObj)
          }
        } else if (type === 'year') {
          for (let y = 2; y >= 0; y--) {
            dateObj = {}
            let _dateStart = this.$comfun.getYearStartEnd(-y)[0]
            let _dateEnd = this.$comfun.getYearStartEnd(-y)[1]
            let _yearStart = _dateStart.getFullYear()
            let _yearEnd = _dateEnd.getFullYear()
            dateObj.val = [this.$comfun.formatDate(_dateStart, 'yyyy-MM-dd'), this.$comfun.formatDate(_dateEnd, 'yyyy-MM-dd')]
            if (y === 0) {
              dateObj.display = '本年'
            } else {
              dateObj.display = this.$comfun.formatDate(_dateStart, format)
            }
            if (Number(_yearStart) !== Number(_yearEnd)) {
              dateObj.year = _yearEnd
            }
            this.dateEvery.push(dateObj)
          }
        }
        resolve('')
      })
      return dateSectionPromise
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
              this.searchHeaderData(true)
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
              this.searchHeaderData(true)
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
              this.searchHeaderData(true)
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
              this.searchHeaderData(true)
            }
          }
        }
      }
      this.moveDistance = 0
      this.headerDateMoveToTansX = -1
      this.headerTabToggle = 0
    },
    searchHeaderData (isChange) {
      if (isChange === true) {
        // this.dateChangeLoading = true
      }
      var type = 1
      var startDate = ''
      var endDate = ''
      if (this.curHeaderDateTabType === 'day') {
        type = 1
        startDate = this.curHeaderSearchDate.val
        endDate = this.curHeaderSearchDate.val
      } else if (this.curHeaderDateTabType === 'week') {
        type = 2
        startDate = this.curHeaderSearchDate.val[0]
        endDate = this.curHeaderSearchDate.val[1]
      } else if (this.curHeaderDateTabType === 'month') {
        type = 3
        startDate = this.curHeaderSearchDate.val[0]
        endDate = this.curHeaderSearchDate.val[1]
      } else if (this.curHeaderDateTabType === 'year') {
        type = 4
        startDate = this.curHeaderSearchDate.val[0]
        endDate = this.curHeaderSearchDate.val[1]
      }
      this.$comfun.http_post(this, `data/senior/contrast/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          this.summarizings[0].progress = !response.body.result.companyNewcarNum || !response.body.result.maxNewcarNum ? 0 : Math.floor(response.body.result.companyNewcarNum / response.body.result.maxNewcarNum * 100)
          this.summarizings[0].num = response.body.result.companyNewcarNum || 0
          this.summarizings[1].progress = !response.body.result.companyAccessorySum || !response.body.result.maxAccessorySum ? 0 : Math.floor(response.body.result.companyAccessorySum / response.body.result.maxAccessorySum * 100)
          this.summarizings[1].num = (response.body.result.companyAccessorySum || 0) >= 10000 ? Math.floor((response.body.result.companyAccessorySum || 0) / 10000) : (response.body.result.companyAccessorySum || 0)
          this.summarizings[1].des = (response.body.result.companyAccessorySum || 0) >= 10000 ? '销售额（万元）' : '销售额（元）'
          this.summarizings[2].progress = !response.body.result.companyFinanceNum || !response.body.result.maxFinanceNum ? 0 : Math.floor(response.body.result.companyFinanceNum / response.body.result.maxFinanceNum * 100)
          this.summarizings[2].num = response.body.result.companyFinanceNum || 0
          this.summarizings[3].progress = !response.body.result.companyInsuranceNum || !response.body.result.maxInsuranceNum ? 0 : Math.floor(response.body.result.companyInsuranceNum / response.body.result.maxInsuranceNum * 100)
          this.summarizings[3].num = response.body.result.companyInsuranceNum || 0
          this.summarizings[4].progress = !response.body.result.companyOldcarNum || !response.body.result.maxOldcarNum ? 0 : Math.floor(response.body.result.companyOldcarNum / response.body.result.maxOldcarNum * 100)
          this.summarizings[4].num = response.body.result.companyOldcarNum || 0
        }
        this.$comfun.http_post(this, `data/senior/profit/synthesis/${this.seeingUser.userId}`, {
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            this.mlvChartOpt.title.text = `{money|${response.body.result.sumProfit || 0}}\t\t{unit|元}\n综合毛利`
            this.mlvChartOpt.series[0].data[0].value = response.body.result.newcarProfit || 0
            // this.mlvChartOpt.series[0].data[1].value = response.body.result.insuranceProfit || 0
            // this.mlvChartOpt.series[0].data[2].value = response.body.result.oldcarProfit || 0
            this.mlvChartOpt.series[0].data[3].value = response.body.result.financeProfit || 0
            this.mlvChartOpt.series[0].data[4].value = response.body.result.accessoryProfit || 0
          }
        })
      })
    },
    arrowUsers (direction, flag) {
      if (flag) {
        this.curSeeUserIndex += direction
        // if (direction > 0) {
        //   if (this.userTabs.length) {
        //   }
        //   this.userTabTransXCurPage += 1
        // }
        if (direction > 0) {
          let usersCurTransX = Number(this.$refs['user-tab-rail'].style.transform.match(this.reg)[0])
          let usersToTransX = usersCurTransX - this.userTabTransXPageWidth
          if (this.userTabTransXCeilWidth * this.userTabs.length > this.userTabTransXPageWidth) {
            if (usersToTransX < -(this.userTabTransXCeilWidth * this.userTabs.length - this.userTabTransXPageWidth)) {
              usersToTransX = -(this.userTabTransXCeilWidth * this.userTabs.length - this.userTabTransXPageWidth)
            }
          } else {
            if (usersToTransX < 0) {
              usersToTransX = 0
            }
          }
          this.$refs['user-tab-rail'].style.transform = `translateX(${usersToTransX}px)`
        } else {
          let usersCurTransX = Number(this.$refs['user-tab-rail'].style.transform.match(this.reg)[0])
          let usersToTransX = usersCurTransX + this.userTabTransXPageWidth
          if (usersToTransX > 0) {
            usersToTransX = 0
          }
          this.$refs['user-tab-rail'].style.transform = `translateX(${usersToTransX}px)`
        }
      }
    },
    seeThisUser (userTab, index) {
      event.target.parentNode.getElementsByClassName('cur')[0].classList.remove('cur')
      event.target.classList.add('cur')
      this.seeingUser = userTab
      this.searchHeaderData()
      this.changeDate(this.curDateTab)
    },
    changeDate (dateTab, dateIndex) {
      event.target.parentNode.getElementsByClassName('cur')[0].classList.remove('cur')
      event.target.classList.add('cur')
      this.curDateTab = dateTab

      var type = 2
      var startDate = ''
      var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      if (dateTab.id === 'week') {
        startDate = this.$comfun.formatDate(this.$comfun.getTargetDate(-7), 'yyyy-MM-dd')
        type = 2
      } else if (dateTab.id === 'month') {
        startDate = this.$comfun.formatDate(this.$comfun.getTargetDate(-30), 'yyyy-MM-dd')
        type = 3
      } else if (dateTab.id === 'year') {
        startDate = this.$comfun.formatDate(this.$comfun.getYearStartEnd(0)[0], 'yyyy-MM-dd')
        type = 4
      }
      this.getLineChartData(type, startDate, endDate)
    },
    getLineChartData (type, startDate, endDate) {
      var chartLimitDate = ''
      // 整车
      this.$comfun.http_post(this, `data/senior/curve/newcar/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          var xAxisData = []
          var seriesData = []
          for (let i = 0; i < response.body.result.length; i++) {
            let startDate = new Date(response.body.result[i].date.replace(/-/g, '/'))
            let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
            if (type === 4) {
              xAxis = this.$comfun.formatDate(startDate, 'yy/M')
            }
            xAxisData.push(xAxis)
            seriesData.push({
              value: response.body.result[i].num ? response.body.result[i].num : 0,
              itemStyle: {
                color: '#ED8D1B',
                borderColor: '#ED8D1B'
              }
            })
          }
          if (xAxisData.length > 7) {
            chartLimitDate = xAxisData[xAxisData.length - 7]
          } else {
            chartLimitDate = xAxisData[0]
          }
          this.zcChartOpt.xAxis.data = xAxisData
          this.zcChartOpt.series[0].data = seriesData
          this.zcChartOpt.dataZoom = [
            {
              startValue: chartLimitDate
            },
            {
              type: 'inside'
            }
          ]
        }
      })
      // 二手车
      this.$comfun.http_post(this, `data/senior/curve/oldcar/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          var xAxisData = []
          var seriesData = []
          for (let i = 0; i < response.body.result.length; i++) {
            let startDate = new Date(response.body.result[i].date.replace(/-/g, '/'))
            let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
            if (type === 4) {
              xAxis = this.$comfun.formatDate(startDate, 'yy/M')
            }
            xAxisData.push(xAxis)
            seriesData.push({
              value: response.body.result[i].num ? response.body.result[i].num : 0,
              itemStyle: {
                color: '#ED8D1B',
                borderColor: '#ED8D1B'
              }
            })
          }
          if (xAxisData.length > 7) {
            chartLimitDate = xAxisData[xAxisData.length - 7]
          } else {
            chartLimitDate = xAxisData[0]
          }
          this.escChartOpt.xAxis.data = xAxisData
          this.escChartOpt.series[0].data = seriesData
          this.escChartOpt.dataZoom = [
            {
              startValue: chartLimitDate
            },
            {
              type: 'inside'
            }
          ]
        }
      })
      // 保险
      this.$comfun.http_post(this, `data/senior/curve/insurance/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          var xAxisData = []
          var seriesData = []
          for (let i = 0; i < response.body.result.length; i++) {
            let startDate = new Date(response.body.result[i].date.replace(/-/g, '/'))
            let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
            if (type === 4) {
              xAxis = this.$comfun.formatDate(startDate, 'yy/M')
            }
            xAxisData.push(xAxis)
            seriesData.push({
              value: response.body.result[i].num ? response.body.result[i].num : 0,
              itemStyle: {
                color: '#ED8D1B',
                borderColor: '#ED8D1B'
              }
            })
          }
          if (xAxisData.length > 7) {
            chartLimitDate = xAxisData[xAxisData.length - 7]
          } else {
            chartLimitDate = xAxisData[0]
          }
          this.bxChartOpt.xAxis.data = xAxisData
          this.bxChartOpt.series[0].data = seriesData
          this.bxChartOpt.dataZoom = [
            {
              startValue: chartLimitDate
            },
            {
              type: 'inside'
            }
          ]
        }
      })
      // 汽车用品
      this.$comfun.http_post(this, `data/senior/curve/accessory/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          var xAxisData = []
          var seriesData = []
          for (let i = 0; i < response.body.result.length; i++) {
            let startDate = new Date(response.body.result[i].date.replace(/-/g, '/'))
            let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
            if (type === 4) {
              xAxis = this.$comfun.formatDate(startDate, 'yy/M')
            }
            xAxisData.push(xAxis)
            seriesData.push({
              value: response.body.result[i].num ? response.body.result[i].num : 0,
              itemStyle: {
                color: '#ED8D1B',
                borderColor: '#ED8D1B'
              }
            })
          }
          if (xAxisData.length > 7) {
            chartLimitDate = xAxisData[xAxisData.length - 7]
          } else {
            chartLimitDate = xAxisData[0]
          }
          this.qcypChartOpt.xAxis.data = xAxisData
          this.qcypChartOpt.series[0].data = seriesData
          this.qcypChartOpt.dataZoom = [
            {
              startValue: chartLimitDate
            },
            {
              type: 'inside'
            }
          ]
        }
      })
      // 金融
      this.$comfun.http_post(this, `data/senior/curve/finance/${this.seeingUser.userId}`, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          var xAxisData = []
          var seriesData = []
          for (let i = 0; i < response.body.result.length; i++) {
            let startDate = new Date(response.body.result[i].date.replace(/-/g, '/'))
            let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
            if (type === 4) {
              xAxis = this.$comfun.formatDate(startDate, 'yy/M')
            }
            xAxisData.push(xAxis)
            seriesData.push({
              value: response.body.result[i].num ? response.body.result[i].num : 0,
              itemStyle: {
                color: '#ED8D1B',
                borderColor: '#ED8D1B'
              }
            })
          }
          if (xAxisData.length > 7) {
            chartLimitDate = xAxisData[xAxisData.length - 7]
          } else {
            chartLimitDate = xAxisData[0]
          }
          this.jrChartOpt.xAxis.data = xAxisData
          this.jrChartOpt.series[0].data = seriesData
          this.jrChartOpt.dataZoom = [
            {
              startValue: chartLimitDate
            },
            {
              type: 'inside'
            }
          ]
        }
      })
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
    background-color: #ffffff;
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
    .seeing-user-name {
      position: relative;
      margin-top: 0.3rem;
      font-size: 0.7rem;
      span.see-user-name {
        margin-left: 0.4rem;
        color: #1FFF98;
      }
    }
  }
  .user-tab-wrap {
    position: relative;
    .left-arrow {
      position: absolute;
      font-size: 1.4rem;
      width: 2rem;
      height: 8rem;
      line-height: 8rem;
      top: -2rem;
      left: 0;
      z-index: 9;
      color: #73a7e3;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .right-arrow {
      position: absolute;
      font-size: 1.4rem;
      width: 2rem;
      height: 8rem;
      line-height: 8rem;
      top: -2rem;
      right: 0;
      z-index: 9;
      color: #73a7e3;
      text-align: right;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .arrow-bound {
      color: rgba(115, 167, 227, .3);
    }
    .user-info-wrap {
      position: relative;
      height: 4.8rem;
      margin-top: 1.8rem;
      left: 1.6rem;
      right: 1.6rem;
      width: calc(100% - 3.2rem);
      overflow: hidden;
      .user-tab-rail {
        position: relative;
        height: 4.2rem;
        white-space: nowrap;
        overflow-x: visible;
        transition: all 0.2s ease 0s;
        span.user-info-item {
          position: relative;
          display: inline-block;
          text-align: center;
          i.user-head {
            position: relative;
            top: 0;
            left: 0;
            margin: 0 auto;
            display: block;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 2px solid #ffffff;
            background-color: #ffffff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% auto;
            pointer-events: none;
          }
          i.user-head::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            bottom: -2px;
            right: -2px;
            border-radius: 50%;
            background-color: rgba(30, 30, 30, 0.3);
            pointer-events: none;
            transition: all 0.4s ease 0s;
          }
          span.user-name {
            position: relative;
            display: inline-block;
            width: 100%;
            font-size: 0.6rem;
            color: #438cdf;
            margin-top: 0.6rem;
            pointer-events: none;
            transition: all 0.4s ease 0s;
          }
        }
        span.cur {
          i.user-head {
            width: 2.5rem;
            height: 2.5rem;
          }
          i.user-head::after {
            background-color: rgba(0, 0, 0, 0);
          }
          span.user-name {
            color: #ffffff;
          }
        }
      }
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
    pointer-events: none;
    div.progress-wrap {
      position: absolute;
      top: 0.6rem;
      border-radius: 50%;
      border: 1px solid rgb(78, 146, 223);
      color: #ffffff;
      font-size: 0px;
      overflow: hidden;
      z-index: 1;
      .wrapper {
        position: absolute;
        top: 0;
        overflow: hidden;
        z-index: 1;
        .circle-progress {
          position: absolute;
          border-radius: 50%;
          top: -1px;
          overflow: hidden;
          border: 4px solid transparent;
        }
        .rightcircle {
          border-top: 4px solid #1FFF98;
          border-right: 4px solid #1FFF98;
          right: -1px;
        }
        .leftcircle {
          border-bottom: 4px solid #1FFF98;
          border-left: 4px solid #1FFF98;
          left: -1px;
        }
      }
      .right {
        right: 0;
      }
      .left {
        left: 0;
      }
      .progress-val {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 9;
        font-weight: bold;
        color: #3AB9FF;
        z-index: 99;
      }
      .water-wrap {
        position: absolute;
        top: 4px;
        left: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        border-radius: 50%;
        overflow: hidden;
        z-index: 5;
        .water-wave {
          position: absolute;
          bottom: -120%;
          left: 0px;
          width: 100%;
          height: 100%;
          border-radius: 38% 42%;
          z-index: 5;
          background: rgba(6, 139, 213, 0.781);
          box-shadow: 0 0 10px rgba(93, 62, 129, 0.4);
          transition: bottom 0.4s ease 0s;
          transform-origin: 50% 50%;
          animation: spin 16s infinite linear;
        }
        .water-wave::before {
          content: '';
          position: absolute;
          bottom: 20%;
          left: 0px;
          width: 100%;
          height: 100%;
          border-radius: 60% 38%;
          z-index: 5;
          background: rgba(6, 139, 213, 0.568);
          box-shadow: 0 0 10px rgba(122, 132, 219, 0.3);
          transform-origin: 49% 51%;
          animation: spin 13s infinite linear;
        }
        .water-wave::after {
          content: '';
          position: absolute;
          bottom: 10%;
          left: 0px;
          width: 110%;
          height: 110%;
          border-radius: 40% 49%;
          z-index: 5;
          background: rgba(6, 139, 213, 0.568);
          box-shadow: 0 0 10px rgba(55, 111, 231, 0.4);
          transform-origin: 51% 49%;
          animation: spin 10s infinite linear;
        }
      }
    }
    div.progress-des-wrap {
      position: absolute;
      top: 5.4rem;
      color: #ffffff;
      font-size: 0.8rem;
      overflow: hidden;
      z-index: 1;
      text-align: center;
      span {
        position: relative;
        display: block;
        white-space: nowrap;
      }
      span.num {
        font-weight: bold;
        font-size: 1.4rem;
        margin: 0.8rem 0 0.4rem;
      }
      span.des {
        color: #73a7e3;
        font-size: 0.6rem;
        transform: scale(0.8);
      }
    }
  }
  .summarizing-wrap::after {
    content: '';
    position: absolute;
    bottom: -2.4rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 2rem;
    height: 2rem;
    transform: rotate(45deg);
    background-color: #F5F5F5;
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
      top: 18.6rem;
    }
  }
}
.header-date-data-des {
  position: relative;
  transition: all 0.6s ease 0s;
  max-height: 32rem;
  overflow: hidden;
}
.mlv-chart {
  background-color: #F5F5F5;
  height: 16rem;
}
.gejx-chart {
  background-color: #F5F5F5;
  height: 16rem;
  margin-top: -3rem;
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
