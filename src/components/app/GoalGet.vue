<template>
  <div class="page-goal-get">
    <div class="page-header-wrap">
      <!-- <span :class="['user-head', userHead !== '' ? 'has-head' : '']">
        <i :style="userHead !== '' ? { 'background-image': `url(${userHead})` } : { 'background-image': `url(${defaultUserHead})` }">
          <span class="user-name-for-head" v-if="!userHead">{{userName.substr(userName.trim().length - 2)}}</span>
        </i>
      </span>
      <div class="user-name-wrap">
        <span class="user-name">{{userName}}</span>
        <div class="level-wrap">
          <span>等级</span>
          <div class="star-wrap">
            <i :class="['star', starIndex < userLevel ? 'has-star' : '']" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
          </div>
        </div>
      </div> -->
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
        <div class="summarizing-wrap" v-show="!dateChangeLoading">
          <div class="all-data-wrap">
            <div class="goal-data-item" v-for="(goal, goalIndex) in headerDataDetail" :key="goalIndex">
              <span class="title">{{goal.title}}</span>
              <div class="goal-rail">
                <div class="goal-cur" :style="{ 'width': `calc(100% * (${goal.cur / goal.target}))` }">
                  <span>{{Math.ceil(goal.cur / goal.target * 100)}}%</span>
                </div>
              </div>
              <div class="val-wrap">
                <span>目标</span>
                <span>{{goal.target}}</span>
                <span>{{goal.unit}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-data-is-loading" v-show="(headerIsLoading || dateChangeLoading)" :style="(!headerIsLoading && dateChangeLoading) ? { 'height': '12rem' } : {}">
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
    <chart class="cobweb-chart" :options="cobwebOpt" :auto-resize="true"></chart>
  </div>
</template>

<script>
export default {
  name: 'AppGoalGet',
  data () {
    return {
      defaultUserHead: '',
      userHead: '',
      userScrope: 'A',
      starCount: 5,
      userLevel: 3,
      progressBallSpace: 0.4,
      headerIsLoading: true,
      dateChangeLoading: false,
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
      reg: /[-?\d.]+/g,
      isFixed: false,
      sellTabWrapScrollTop: 52.2 * 16,
      sellTabWrapHeight: 3.9 * 16 + 'px',
      userName: '~',
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
      headerDataDetail: [
        {
          title: '整车销售',
          target: 70,
          cur: 10,
          unit: '万'
        },
        {
          title: '汽车用品',
          target: 80,
          cur: 64,
          unit: '万'
        },
        {
          title: '金融',
          target: 100,
          cur: 44,
          unit: '台'
        },
        {
          title: '保险',
          target: 210,
          cur: 144,
          unit: '单'
        },
        {
          title: '二手车销售',
          target: 70,
          cur: 36,
          unit: '万'
        }
      ],
      dateEvery: [],
      cobwebOpt: {
        tooltip: {
          trigger: 'axis'
        },
        radar: [
          {
            indicator: [
              { text: '整车销售', max: 100 },
              { text: '汽车用品', max: 100 },
              { text: '金融', max: 100 },
              { text: '二手车', max: 100 },
              { text: '保险', max: 100 }
            ],
            center: [ '50%', '50%' ],
            radius: 80,
            splitNumber: 4,
            name: {
              textStyle: {
                color: '#3A3A3A'
              }
            },
            splitLine: {
              lineStyle: {
                color: [
                  '#9AC2F0', '#ABCDF3', '#BDD7F5', '#D2E4F8'
                ].reverse()
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(193, 217, 245, 0.4)'
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: [
                  '#9AC2F0', '#ABCDF3', '#BDD7F5', '#D2E4F8'
                ]
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            symbolSize: 0,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#55DC9E'
                },
                areaStyle: {
                  type: 'default',
                  color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [
                      {
                        offset: 0, color: '#93E9C2'
                      },
                      {
                        offset: 1, color: '#55DC9E'
                      }
                    ],
                    globalCoord: false
                  }
                }
              }
            },
            data: [
              {
                value: [60, 73, 85, 40, 20],
                name: '即时绩效'
              }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      this.initPageData()
    })
    this.$root.eventHub.$on('loadHeaderAfterDateSection', () => {
      this.curHeaderSearchDate = this.dateEvery[this.dateEvery.length - 1]
      this.searchHeaderData(false)
      var dateEveryRail = this.$refs['date-every-rail']
      if (dateEveryRail) {
        this.dateEveryRailTrans = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth
        this.headerDateTabTransXMax = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth

        this.headerDateTabTransXCeilWidth = dateEveryRail.getElementsByClassName('cur')[0].clientWidth
      }
      this.headerIsLoading = false
    })
    this.$root.eventHub.$on('initGetCobwebData', () => {
      var startDate = this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy-MM-dd')
      var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.getCobwebData(2, startDate, endDate)
    })
    document.querySelector('#app-footer').style.display = 'none'
    this.defaultUserHead = this.$moment.defaultHead
    this.initPageData()
  },
  methods: {
    initPageData () {
      if (this.$moment.userInfo.user && this.$moment.userInfo.user.photo !== null) {
        this.userHead = this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`
        this.userScrope = this.$moment.userInfo.user.scope
      }
      this.initPageByScope()
      this.resetDateEvery(this.dateTabs[0].id)

      this.userName = this.$moment.userInfo.user.name
      this.$setTimeOut('initGetCobwebData', 400)
    },
    initPageByScope () {
      if (this.$moment.userInfo.user) {
        if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        }
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
          this.getDateSection(this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy/MM/dd'), curDateType, 'M/d').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'week':
          this.getDateSection(this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy/MM/dd'), curDateType, 'M/d').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'month':
          this.getDateSection(this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy/MM/dd'), curDateType, 'M').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
        case 'year':
          this.getDateSection(this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy/MM/dd'), curDateType, 'yyyy').then(() => {
            this.loadHeaderAfterDateSection()
          })
          break
      }
    },
    loadHeaderAfterDateSection () {
      this.dateEveryRailTrans = -document.body.clientWidth
      this.$nextTick().then(() => {
        this.$refs['date-every-rail'].style.transform = `translateX(-100%)`
        this.$setTimeOut('loadHeaderAfterDateSection', 1000)
      })
    },
    getDateSection (min, type, format) {
      var dateSectionPromise = new Promise((resolve, reject) => {
        var startTime = new Date(min)
        var endTime = new Date()
        var hasWeek = {}
        var hasMonth = {}
        var hasYear = {}
        var dateIndex = 0
        while ((endTime.getTime() / (24 * 60 * 60 * 1000) - startTime.getTime() / (24 * 60 * 60 * 1000)) >= 0) {
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
              if (this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd') === this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')) {
                dateObj.val[1] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
              }
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
                if (!dateObj.val[0]) {
                  dateObj.val[0] = this.$comfun.formatDate(new Date(min), 'yyyy-MM-dd')
                }
                dateObj.val[1] = curValData
                if (endTime.getTime() - startTime.getTime() < 0) {
                  dateObj.display = '本周'
                } else {
                  dateObj.display = (dateObj.display || this.$comfun.formatDate(new Date(min), format)) + '-' + curDisplayData
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
              if (this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd') === this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')) {
                dateObj.val[1] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
              }
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
                if (!dateObj.val[0]) {
                  dateObj.val[0] = year + '-' + month + '-01'
                }
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
              if (this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd') === this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')) {
                dateObj.val[1] = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
              }
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
                if (!dateObj.val[0]) {
                  dateObj.val[0] = year + '-01-01'
                }
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
        resolve('')
      })
      return dateSectionPromise
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
        if (this.headerDateMoveToTansX > (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2 - 1.4 * 16) {
          this.headerDateMoveToTansX = (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2 - 1.4 * 16
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
        if (this.headerDateMoveToTansX > (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2 - 1.4 * 16) {
          this.headerDateMoveToTansX = (document.body.clientWidth - this.headerDateTabTransXCeilWidth) / 2 - 1.4 * 16
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
      var headerUri = `data/public/contrast/${this.$moment.userInfo.user.id}`
      if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        headerUri = `after/public/contrast/serve/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        headerUri = `after/public/contrast/group/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        headerUri = `after/public/contrast/accident/${this.$moment.userInfo.user.id}`
      }
      this.$comfun.http_post(this, headerUri, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sale) { // A 为售前 B:机电服务顾问 C:机电班组 D:事故服务顾问
          } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) {
          } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) {
          } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) {
          }
        }
      })
    },
    changeDate (dateTab, dateIndex) {
      event.target.parentNode.getElementsByClassName('cur')[0].classList.remove('cur')
      event.target.classList.add('cur')

      var type = 2
      var startDate = this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy-MM-dd')
      var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      if (dateTab.id === 'week') {
        type = 2
      } else if (dateTab.id === 'month') {
        type = 3
      } else if (dateTab.id === 'year') {
        type = 4
      }
      this.getCobwebData(type, startDate, endDate)
    },
    getCobwebData (type, startDate, endDate) {
    }
  }
}
</script>

<style lang="scss" scoped>
.page-goal-get {
  background: #ffffff;
  height: 100vh;
}
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
    border: 2px solid #dbdbdb;
    background-color: #7daffa;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    overflow: hidden;
    z-index: 2;
    i {
      position: relative;
      top: -5%;
      left: -5%;
      display: inline-block;
      width: 110%;
      height: 110%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 1;
      span.user-name-for-head {
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 100%;
        height: 1rem;
        line-height: normal;
        text-align: center;
        font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
        font-size: 0.7rem;
        font-weight: bold;
        color: #ffffff;
        white-space: nowrap;
        font-style: normal;
      }
    }
  }
  .has-head {
    background-color: #ffffff;
    i {
      position: relative;
      top: -1px;
      left: 0;
      display: inline-block;
      width: 200%;
      height: 200%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
    }
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
    .level-wrap {
      position: absolute;
      display: inline-block;
      left: 4.2rem;
      bottom: 0;
      span {
        display: inline-block;
        font-size: 0.8rem;
        color: #ffffff;
        vertical-align: bottom;
      }
      .star-wrap {
        position: relative;
        display: inline-block;
        margin-left: 0.6rem;
        vertical-align: bottom;
        i.star {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 0.9rem;
          height: 0.9rem;
          background-image: url('./../../assets/star-2.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
        }
        i.star:nth-of-type(n + 2) {
          margin-left: 0.3rem;
        }
        i.has-star {
          width: 0.93rem;
          background-image: url('./../../assets/star-1.png');
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
    border-bottom: 0.06rem solid #2168BB;
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
    height: 16.2rem;
    font-size: 0;
    pointer-events: none;
    .all-data-wrap {
      position: relative;
      padding: 0.8rem 0.6rem;
      .goal-data-item {
        position: relative;
        font-size: 0.8rem;
        margin-bottom: 1.2rem;
        .title {
          position: relative;
          font-size: 0.9rem;
          color: #ffffff;
        }
        .goal-rail {
          position: relative;
          width: calc(100% - 6rem);
          height: 4px;
          background-color: #4474AE;
          margin-top: 0.9rem;
          .goal-cur {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            background-color: #1FFF98;
            span {
              position: absolute;
              top: -1.5rem;
              right: -1.2rem;
              border: 1px solid #159DF3;
              padding: 0.1rem 0.4rem 0.1rem;
              font-size: 0.6rem;
              border-radius: 4rem;
              background-color: rgb(39, 107, 184);
            }
          }
        }
        .val-wrap {
          position: absolute;
          right: -0.4rem;
          top: 1.4rem;
          width: 6rem;
          text-align: left;
          span {
            position: relative;
            display: inline-block;
            font-size: 0.6rem;
          }
          span:nth-of-type(2) {
            font-size: 1.2rem;
            margin: 0 0.2rem 0 0.4rem;
          }
        }
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
    background-color: rgb(255, 255, 255);
  }
  .header-data-is-loading {
    height: 19.54rem;
    padding: 1rem 0;
    text-align: center;
    .loadster {
      margin: 8.4rem 4rem;
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
      top: 13rem;
    }
  }
}
.header-date-data-des {
  position: relative;
  transition: all 0.6s ease 0s;
  max-height: 32rem;
  overflow: hidden;
}
.cobweb-chart {
  background-color: rgb(255, 255, 255);
  height: 16rem;
}

@keyframes moveflash {
  0% {
    transform: translateX(-68%);
  }
  100% {
    transform: translateX(68%);
  }
}
</style>
