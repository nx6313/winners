<template>
  <div id="page-home" class="page-home" @scroll="scrollPage">
    <div class="page-header-wrap">
      <span class="user-head" :style="{ 'background-image': `url(${userHead})` }"></span>
      <div class="user-name-wrap">
        <span class="user-name">{{userName}}</span>
        <i class="user-level-icon"></i>
        <span class="user-level">{{userLevel}}</span>
      </div>
      <div class="head-tab-wrap">
        <div class="date-tab-rail" ref="date-tab-rail">
          <span v-for="(dateTab, dateTabIndex) in dateTabs" :key="dateTabIndex" :ref="'date-tab-' + dateTab.id" :class="dateTabIndex === 0 ? 'cur' : ''" :style="{ 'width': `calc(100% / ${dateTabs.length})` }" @click="toThisDateType(dateTab.id)">{{dateTab.txt}}</span>
        </div>
      </div>
      <div @touchstart.prevent="headerTouchStart" @touchmove.prevent="headerTouchMove" @touchend.prevent="headerTouchEnd">
        <div class="date-every-wrap" ref="date-every-wrap">
          <div class="date-every-rail" ref="date-every-rail" :style="[{ 'width': `calc((100vw - 1.6rem - 1.2rem) / 5 * ${dateEvery.length})` }, dateEveryRailTrans !== null ? { 'transform': `translateX(${dateEveryRailTrans}px)` } : { 'transform': `translateX(calc(((100vw - 1.6rem - 1.2rem) / 5) * 3 - 100%))` }]">
            <span v-for="(dateEv, dateEvIndex) in dateEvery" :key="dateEvIndex" :class="dateEvIndex === dateEvery.length - 1 ? ['last-date', 'cur'] : ''" :style="{ 'width': `calc((100vw - 1.6rem - 1.2rem) / 5)` }">{{dateEv.display}}</span>
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
            <span class="num" :ref="'des-num-' + summarizingDesIndex" v-num-scroll:opt="{ number: summarizingDes.num, precision: 0 }">0</span>
            <span class="des">{{summarizingDes.des}}</span>
          </div>
        </div>
      </div>
    </div>
    <chart class="mlv-chart" :options="mlvChartOpt" :auto-resize="true"></chart>
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
  name: 'Home',
  data () {
    return {
      curHeaderDateTabType: null,
      headerDateTabTransXMax: 0,
      headerDateTabTransXCeilWidth: 0,
      headerTouchStartTransX: null,
      headerTouchStartX: -1,
      dateEveryRailTrans: null,
      headerDateMoveToTansX: -1,
      reg: /[-?\d.]+/g,
      isFixed: false,
      sellTabWrapScrollTop: 0,
      sellTabWrapHeight: '0px',
      userHead: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1060129963,1724829206&fm=27&gp=0.jpg',
      userName: '刘德华',
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
          progress: 10,
          title: '整车',
          num: 15,
          des: '销售（台）'
        },
        {
          progress: 23,
          title: '汽车用品',
          num: 37,
          des: '销售额（万元）'
        },
        {
          progress: 46,
          title: '金融',
          num: 8,
          des: '信贷量（单）'
        },
        {
          progress: 80,
          title: '保险',
          num: 10,
          des: '投保量（单）'
        },
        {
          progress: 100,
          title: '二手车',
          num: 7,
          des: '销售（台）'
        }
      ],
      mlvChartOpt: {
        title: {
          text: '{money|1230}\t\t{unit|万}\n综合毛利',
          left: 'center',
          top: '42%',
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
          formatter: '{a} <br/>{b}: {c} 万元 ({d}%)',
          backgroundColor: 'rgba(80, 30, 30, .8)'
        },
        series: [
          {
            name: '毛利占比率',
            type: 'pie',
            radius: ['44%', '30%'],
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: [
                  '{rate|{d}}\t\t{rateTip|%}',
                  '{c} 万元',
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
    this.$comfun.http_post(this, 'contrast/8')
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    // window.addEventListener('scroll', this.scrollPage)
    this.resetDateEvery(this.dateTabs[0].id)

    this.$nextTick().then(() => {
      var sellTabWrap = this.$refs['sell-tab-wrap']
      this.sellTabWrapScrollTop = sellTabWrap.offsetTop
      this.sellTabWrapHeight = (sellTabWrap.offsetHeight + 9) + 'px'
    })
  },
  methods: {
    scrollPage () {
      var pageScrollTop = document.querySelector('#page-home').scrollTop
      if (pageScrollTop > this.sellTabWrapScrollTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    toThisDateType (dateType) {
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
          this.getDateSection('2017/01/01', curDateType, 'MM/dd')
          this.dateEvery = [
            {
              val: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
              display: '今日'
            }
          ]
          break
        case 'week':
          this.getDateSection('2017/01/01', curDateType, 'MM/dd')
          this.dateEvery = [
            {
              val: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
              display: '本周'
            }
          ]
          break
        case 'month':
          this.getDateSection('2017/01/01', curDateType, 'MM')
          this.dateEvery = [
            {
              val: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
              display: '本月'
            }
          ]
          break
        case 'year':
          this.getDateSection('2017/01/01', curDateType, 'yyyy')
          this.dateEvery = [
            {
              val: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
              display: '本年'
            }
          ]
          break
      }
      this.dateEveryRailTrans = -document.body.clientWidth
      this.$nextTick().then(() => {
        setTimeout(() => {
          var dateEveryRail = this.$refs['date-every-rail']
          this.dateEveryRailTrans = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth
          this.headerDateTabTransXMax = ((document.body.clientWidth - 1.6 * 16 - 1.2 * 16) / 5) * 3 - dateEveryRail.clientWidth

          this.headerDateTabTransXCeilWidth = dateEveryRail.getElementsByClassName('cur')[0].clientWidth
        }, 300)
      })
    },
    getDateSection (min, type, format) {
      let dateObj = {
        val: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
        display: '今日'
      }
      if (type === 'week') {
      }
      var startTime = new Date(min)
      var endTime = new Date()
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear()
        var month = (startTime.getMonth() + 1).toString().length === 1 ? '0' + (startTime.getMonth() + 1) : (startTime.getMonth() + 1)
        var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        startTime.setDate(startTime.getDate() + 1)
        dateObj.val = this.$comfun.formatDate(new Date(year + '/' + month + '/' + day), 'yyyy-MM-dd')
      }
      this.dateEvery.push(dateObj)
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
      var moveDistance = (event.touches[0].pageX - this.headerTouchStartX) * 0.8
      this.headerDateMoveToTansX = this.headerTouchStartTransX + moveDistance
      if (this.headerDateMoveToTansX > 24) {
        this.headerDateMoveToTansX = 24
      } else if (this.headerDateMoveToTansX < this.headerDateTabTransXMax - 24) {
        this.headerDateMoveToTansX = this.headerDateTabTransXMax - 24
      }
      this.$refs['date-every-rail'].style.transform = `translateX(${this.headerDateMoveToTansX}px)`
    },
    headerTouchEnd () {
      this.$refs['date-every-rail'].style['transition-duration'] = '0.2s'
      var curDateEvery = this.$refs['date-every-rail'].getElementsByClassName('cur')[0]
      if (this.headerDateMoveToTansX > 20) {
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
      } else if (this.headerDateMoveToTansX < this.headerDateTabTransXMax - 20) {
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
      }
      if (curDateEvery.classList.contains('last-date')) {
      }
      this.headerDateMoveToTansX = -1
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
    top: 0.7rem;
    left: 0.6rem;
    display: block;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    border: 2px solid #ffffff;
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
    .user-level-icon {
      position: relative;
      display: inline-block;
      width: 0.9rem;
      height: 0.9rem;
      margin-left: 1.6rem;
      background-image: url('./../assets/level-j.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      vertical-align: bottom;
    }
    .user-level {
      position: relative;
      display: inline-block;
      font-size: 0.8rem;
      color: #f5f8ff;
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
    padding: 1rem 0.6rem 0.4rem;
    overflow: hidden;
    .date-every-rail {
      position: relative;
      white-space: nowrap;
      overflow-x: visible;
      transition: all 0.2s ease 0s;
      span {
        position: relative;
        display: inline-block;
        font-size: 0.7rem;
        text-align: center;
        color: rgb(67, 140, 223);
        transition: all 0.3s ease 0s;
      }
      span.cur {
        color: rgb(255, 255, 255);
      }
    }
  }
  .summarizing-wrap {
    position: relative;
    padding: 1.2rem 0;
    height: 8.8rem;
    pointer-events: none;
    div.progress-wrap {
      position: absolute;
      top: 1.2rem;
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
      top: 6rem;
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
}
.mlv-chart {
  background-color: #F5F5F5;
  height: 16rem;
}
.sell-chart-wrap {
  background-color: rgb(255, 255, 255);
  .sell-tab-wrap {
    position: relative;
    width: calc(100% - 3.2rem);
    padding: 1rem 1.6rem 0.4rem;
    margin-bottom: 1rem;
    background-color: rgb(255, 255, 255);
    z-index: 99999;
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
