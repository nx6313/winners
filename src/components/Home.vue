<template>
  <div id="page-home" class="page-home" @scroll="scrollPage">
    <div class="page-header-wrap">
      <span :class="['user-head', userHead !== '' ? 'has-head' : '']">
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
        <div class="summarizing-wrap" v-show="!dateChangeLoading" :style="summarizings.length > 5 ? { 'height': `${Math.ceil(summarizings.length / 2) * 2.3}rem` } : {}">
          <template v-if="summarizings.length <= 5">
            <div class="progress-wrap" v-for="(summarizing, summarizingIndex) in summarizings" :key="summarizingIndex" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})`, 'left': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} * ${summarizingIndex} + ${summarizingIndex} * ${progressBallSpace}rem)` }">
              <div class="wrapper right" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} / 2)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})` }">
                <div class="circle-progress rightcircle" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} - 6px)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} - 6px)`, 'transform': progressRotate('right', summarizing.progress) }"></div>
              </div>
              <div class="wrapper left" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} / 2)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})` }">
                <div class="circle-progress leftcircle" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} - 6px)`, 'height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} - 6px)`, 'transform': progressRotate('left', summarizing.progress) }"></div>
              </div>
              <div class="progress-val" :style="{ 'line-height': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})` }" v-html="circleProgressVal(summarizing.progress)"></div>
              <div class="water-wrap">
                <div class="water-wave" :style="{ 'bottom': getWaterHeight(summarizing.progress) }"></div>
              </div>
            </div>
            <div class="progress-des-wrap" v-for="(summarizingDes, summarizingDesIndex) in summarizings" :key="'des-' + summarizingDesIndex" :style="{ 'width': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length})`, 'left': `calc((100vw - 1.6rem - ${summarizings.length - 1} * ${progressBallSpace}rem) / ${summarizings.length} * ${summarizingDesIndex} + ${summarizingDesIndex} * ${progressBallSpace}rem)` }">
              <span class="title">{{summarizingDes.title}}</span>
              <span class="num" :ref="'des-num-' + summarizingDesIndex">{{summarizingDes.num}}</span>
              <span class="des">{{summarizingDes.des}}</span>
            </div>
          </template>
          <template v-if="summarizings.length > 5">
            <div :class="['progress-strip-wrap', summarizingIndex % 2 == 1 ? 'line-last' : '']" v-for="(summarizing, summarizingIndex) in summarizings" :key="summarizingIndex">
              <div class="des-wrap">
                <span class="title">{{summarizing.title}}</span>
                <div class="num-wrap">
                  <span class="num">{{summarizing.num}}</span>
                  <span class="des">{{summarizing.des}}</span>
                </div>
              </div>
              <div class="progress-rail">
                <div class="progress-cur" :style="{ 'width': `${summarizing.progress}%` }"></div>
                <div class="progress-animate"></div>
              </div>
              <span class="progress-percent-val" :style="summarizing.progress < 80 ? { 'margin-left': `calc(0.2rem + ${summarizing.progress}%)` } : { 'margin-left': `64%` }">{{summarizing.progress}}%</span>
            </div>
          </template>
        </div>
      </div>
      <div class="header-data-is-loading" v-show="(headerIsLoading || dateChangeLoading)" :style="(!headerIsLoading && dateChangeLoading) ? (summarizings.length > 5 ? { 'height': `${Math.ceil(summarizings.length / 2) * 2.3}rem` } : { 'height': '8.8rem' }) : {}">
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
    <div class="header-date-data-des" :style="(headerIsLoading || dateChangeLoading) ? { 'max-height': '0' } : {}">
      <chart class="mlv-chart" :options="mlvChartOpt" :auto-resize="true" v-if="userScrope === 'A'"></chart>
      <chart class="gejx-chart" :options="grjxChartOpt" :auto-resize="true"></chart>
    </div>
    <div class="sell-chart-wrap">
      <div class="sell-tab-wrap" ref="sell-tab-wrap" :style="isFixed ? { 'position': 'fixed', 'top': '0px', 'left': '0px', 'background': 'rgba(255, 255, 255, 1)' } : {}">
        <div class="date-tab-rail">
          <span v-for="(dateTab, dateTabIndex) in dateTabs" :key="dateTabIndex" v-if="dateTabIndex > 0" :class="dateTabIndex === 1 ? 'cur' : ''" :style="{ 'width': `calc(100% / ${dateTabs.length - 1})` }" @click="changeDate(dateTab, dateTabIndex)">{{dateTab.txt}}</span>
        </div>
      </div>
      <div class="sell-tab-wrap-replace" ref="sell-tab-wrap-replace" :style="{ 'height': sellTabWrapHeight }" v-show="isFixed"></div>
      <template v-if="userScrope === 'A'">
        <chart class="zc-chart" :options="zcChartOpt" :auto-resize="true"></chart>
        <chart class="qcyp-chart" :options="qcypChartOpt" :auto-resize="true"></chart>
        <chart class="jr-chart" :options="jrChartOpt" :auto-resize="true"></chart>
        <chart class="bx-chart" :options="bxChartOpt" :auto-resize="true"></chart>
        <chart class="esc-chart" :options="escChartOpt" :auto-resize="true"></chart>
      </template>
      <template v-if="userScrope !== 'A'">
        <chart class="curve-chart" :options="curveChart" :auto-resize="true" v-for="(curveChart, curveChartIndex) in curveChartOpts" :key="curveChartIndex"></chart>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
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
      grjxChartOpt: {
        title: {
          text: '{money|0}\t\t{unit|元}\n个人绩效',
          left: 'center',
          top: '48%',
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
            name: '个人绩效',
            type: 'pie',
            center: ['50%', '56%'],
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
                name: '整车'
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
      curveChartOpts: [],
      zcChartOpt: {
        title: {
          text: '整车 / 台',
          textStyle: {
            color: '#3A3A3A',
            fontSize: 14,
            fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
          }
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
    this.defaultUserHead = this.$moment.defaultHead
    if (this.$moment.userInfo.user.photo !== null) {
      this.userHead = this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`
    }
    this.userScrope = this.$moment.userInfo.user.scope
    this.initPageByScope()
    if (this.userScrope !== 'A') {
      if (this.summarizings.length > 5) {
        this.sellTabWrapScrollTop = 26.6 * 16 + Math.ceil(this.summarizings.length / 2) * 2.3 * 16
      } else {
        this.sellTabWrapScrollTop = 34.8 * 16
      }
    }
    this.resetDateEvery(this.dateTabs[0].id)

    this.userName = this.$moment.userInfo.user.name
    setTimeout(() => {
      var startDate = this.$comfun.formatDate(this.$moment.userInfo.basedate, 'yyyy-MM-dd')
      var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.getLineChartData(2, startDate, endDate)
    }, 400)
  },
  methods: {
    initPageByScope () {
      if (this.$moment.userInfo.user.scope === 'B') { // B:机电服务顾问
        this.summarizings = [
          {
            progress: 0,
            title: '接车台次',
            num: 0,
            des: '台次'
          },
          {
            progress: 0,
            title: '单车产值',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '总产值',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '毛利',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '衍生产值',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '保养套餐',
            num: 0,
            des: '套'
          },
          {
            progress: 0,
            title: '新入会员',
            num: 0,
            des: '个'
          },
          {
            progress: 0,
            title: '续保',
            num: 0,
            des: '元'
          }
        ]
        this.grjxChartOpt.series[0].data = [
          {
            value: 0,
            name: '工龄工资'
          },
          {
            value: 0,
            name: '岗位津贴'
          },
          {
            value: 0,
            name: '接车台次'
          },
          {
            value: 0,
            name: '产值'
          },
          {
            value: 0,
            name: '衍生产品'
          },
          {
            value: 0,
            name: '续保'
          },
          {
            value: 0,
            name: '其他政策提成'
          }
        ]
        this.initCurveChartOpts([
          {
            title: '接车台次 / 台',
            needInteger: true,
            needRetract: false
          },
          {
            title: '单车产值 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '总产值 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '毛利 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '衍生产值 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '保养套餐 / 套',
            needInteger: true,
            needRetract: false
          },
          {
            title: '新入会员 / 个',
            needInteger: true,
            needRetract: false
          },
          {
            title: '续保 / 元',
            needInteger: false,
            needRetract: true
          }
        ])
      } else if (this.$moment.userInfo.user.scope === 'C') { // C:机电班组
        this.summarizings = [
          {
            progress: 0,
            title: '维修台次',
            num: 0,
            des: '台次'
          },
          {
            progress: 0,
            title: '产值',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '工时费',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '毛利',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '毛利率',
            num: 0,
            des: '%'
          },
          {
            progress: 0,
            title: '保养套餐',
            num: 0,
            des: '套'
          }
        ]
        this.grjxChartOpt.series[0].data = [
          {
            value: 0,
            name: '维修台次'
          },
          {
            value: 0,
            name: '产值'
          },
          {
            value: 0,
            name: '工时'
          },
          {
            value: 0,
            name: '追加产值'
          },
          {
            value: 0,
            name: '衍生产品'
          },
          {
            value: 0,
            name: '续保业务'
          },
          {
            value: 0,
            name: '其他政策提成'
          }
        ]
        this.initCurveChartOpts([
          {
            title: '维修台次 / 台次',
            needInteger: true,
            needRetract: false
          },
          {
            title: '产值 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '工时费 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '毛利 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '毛利率 / %',
            needInteger: false,
            needRetract: false
          },
          {
            title: '保养套餐 / 套',
            needInteger: true,
            needRetract: false
          }
        ])
      } else if (this.$moment.userInfo.user.scope === 'D') { // D:事故服务顾问
        this.summarizings = [
          {
            progress: 0,
            title: '接车台次',
            num: 0,
            des: '台次'
          },
          {
            progress: 0,
            title: '总产值',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '毛利',
            num: 0,
            des: '元'
          },
          {
            progress: 0,
            title: '续保',
            num: 0,
            des: '元'
          }
        ]
        this.grjxChartOpt.series[0].data = [
          {
            value: 0,
            name: '工龄工资'
          },
          {
            value: 0,
            name: '岗位津贴'
          },
          {
            value: 0,
            name: '台次'
          },
          {
            value: 0,
            name: '产值'
          },
          {
            value: 0,
            name: '衍生产品'
          },
          {
            value: 0,
            name: '续保'
          },
          {
            value: 0,
            name: '其他政策提成'
          }
        ]
        this.initCurveChartOpts([
          {
            title: '接车台次 / 台次',
            needInteger: true,
            needRetract: false
          },
          {
            title: '总产值 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '毛利 / 元',
            needInteger: false,
            needRetract: true
          },
          {
            title: '续保 / 元',
            needInteger: false,
            needRetract: true
          }
        ])
      }
      if (this.summarizings.length < 5) {
        this.progressBallSpace = 1.4
      }
    },
    initCurveChartOpts (optItems) {
      for (let optIndex in optItems) {
        var curveChartOpt = {
          title: {
            text: optItems[optIndex].title,
            textStyle: {
              color: '#3A3A3A',
              fontSize: 14,
              fontFamily: 'FZLTHJW, "Avenir", Helvetica, Arial, sans-serif'
            }
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
        if (optItems[optIndex].needInteger) {
          curveChartOpt.yAxis.minInterval = 1
        }
        if (optItems[optIndex].needRetract) {
          curveChartOpt.grid = {
            left: '60'
          }
        }
        this.curveChartOpts.push(curveChartOpt)
      }
    },
    scrollPage () {
      var pageScrollTop = document.querySelector('#page-home').scrollTop
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
      var headerUri = `data/public/contrast/${this.$moment.userInfo.user.id}`
      if (this.$moment.userInfo.user.scope === 'B') { // B:机电服务顾问
        headerUri = `after/public/contrast/serve/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === 'C') { // C:机电班组
        headerUri = `after/public/contrast/group/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === 'D') { // D:事故服务顾问
        headerUri = `after/public/contrast/accident/${this.$moment.userInfo.user.id}`
      }
      this.$comfun.http_post(this, headerUri, {
        type: type,
        startDate: startDate,
        endDate: endDate
      }).then((response) => {
        if (response.body.success === '1') {
          if (this.$moment.userInfo.user.scope === 'A') { // A 为售前 B:机电服务顾问 C:机电班组 D:事故服务顾问
            this.summarizings[0].progress = !response.body.contrast.personNewcarNum || !response.body.contrast.maxNewcarNum ? 0 : Math.floor(response.body.contrast.personNewcarNum / response.body.contrast.maxNewcarNum * 100)
            this.summarizings[0].num = response.body.contrast.personNewcarNum || 0
            this.summarizings[1].progress = !response.body.contrast.personAccessorySum || !response.body.contrast.maxAccessorySum ? 0 : Math.floor(response.body.contrast.personAccessorySum / response.body.contrast.maxAccessorySum * 100)
            this.summarizings[1].num = (response.body.contrast.personAccessorySum || 0) >= 10000 ? Math.floor((response.body.contrast.personAccessorySum || 0) / 10000) : (response.body.contrast.personAccessorySum || 0)
            this.summarizings[1].des = (response.body.contrast.personAccessorySum || 0) >= 10000 ? '销售额（万元）' : '销售额（元）'
            this.summarizings[2].progress = !response.body.contrast.personFinanceNum || !response.body.contrast.maxFinanceNum ? 0 : Math.floor(response.body.contrast.personFinanceNum / response.body.contrast.maxFinanceNum * 100)
            this.summarizings[2].num = response.body.contrast.personFinanceNum || 0
            this.summarizings[3].progress = !response.body.contrast.personInsuranceNum || !response.body.contrast.maxInsuranceNum ? 0 : Math.floor(response.body.contrast.personInsuranceNum / response.body.contrast.maxInsuranceNum * 100)
            this.summarizings[3].num = response.body.contrast.personInsuranceNum || 0
            this.summarizings[4].progress = !response.body.contrast.personOldcarNum || !response.body.contrast.maxOldcarNum ? 0 : Math.floor(response.body.contrast.personOldcarNum / response.body.contrast.maxOldcarNum * 100)
            this.summarizings[4].num = response.body.contrast.personOldcarNum || 0
          } else if (this.$moment.userInfo.user.scope === 'B') {
            this.summarizings[0].progress = !response.body.result.personNumNum || !response.body.result.maxNumNum ? 0 : Math.floor(response.body.result.personNumNum / response.body.result.maxNumNum * 100)
            this.summarizings[0].num = response.body.result.personNumNum || 0
            this.summarizings[1].progress = !response.body.result.personOneprofitNum || !response.body.result.maxOneprofitNum ? 0 : Math.floor(response.body.result.personOneprofitNum / response.body.result.maxOneprofitNum * 100)
            this.summarizings[1].num = (response.body.result.personOneprofitNum || 0) >= 10000 ? Math.floor((response.body.result.personOneprofitNum || 0) / 10000) : (response.body.result.personOneprofitNum || 0)
            this.summarizings[1].des = (response.body.result.personOneprofitNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[2].progress = !response.body.result.personSumprofitsNum || !response.body.result.maxSumprofitsNum ? 0 : Math.floor(response.body.result.personSumprofitsNum / response.body.result.maxSumprofitsNum * 100)
            this.summarizings[2].num = (response.body.result.personSumprofitsNum || 0) >= 10000 ? Math.floor((response.body.result.personSumprofitsNum || 0) / 10000) : (response.body.result.personSumprofitsNum || 0)
            this.summarizings[2].des = (response.body.result.personSumprofitsNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[3].progress = !response.body.result.personProfitNum || !response.body.result.maxProfitNum ? 0 : Math.floor(response.body.result.personProfitNum / response.body.result.maxProfitNum * 100)
            this.summarizings[3].num = (response.body.result.personProfitNum || 0) >= 10000 ? Math.floor((response.body.result.personProfitNum || 0) / 10000) : (response.body.result.personProfitNum || 0)
            this.summarizings[3].des = (response.body.result.personProfitNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[4].progress = !response.body.result.personDeriveNum || !response.body.result.maxDeriveNum ? 0 : Math.floor(response.body.result.personDeriveNum / response.body.result.maxDeriveNum * 100)
            this.summarizings[4].num = (response.body.result.personDeriveNum || 0) >= 10000 ? Math.floor((response.body.result.personDeriveNum || 0) / 10000) : (response.body.result.personDeriveNum || 0)
            this.summarizings[4].des = (response.body.result.personDeriveNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[5].progress = !response.body.result.personMaintainNum || !response.body.result.maxMaintainNum ? 0 : Math.floor(response.body.result.personMaintainNum / response.body.result.maxMaintainNum * 100)
            this.summarizings[5].num = response.body.result.personMaintainNum || 0
            this.summarizings[6].progress = !response.body.result.personNewmemberNum || !response.body.result.maxNewmemberNum ? 0 : Math.floor(response.body.result.personNewmemberNum / response.body.result.maxNewmemberNum * 100)
            this.summarizings[6].num = response.body.result.personNewmemberNum || 0
            this.summarizings[7].progress = !response.body.result.personRenewalNum || !response.body.result.maxRenewalNum ? 0 : Math.floor(response.body.result.personRenewalNum / response.body.result.maxRenewalNum * 100)
            this.summarizings[7].num = (response.body.result.personRenewalNum || 0) >= 10000 ? Math.floor((response.body.result.personRenewalNum || 0) / 10000) : (response.body.result.personRenewalNum || 0)
            this.summarizings[7].des = (response.body.result.personRenewalNum || 0) >= 10000 ? '万元' : '元'
          } else if (this.$moment.userInfo.user.scope === 'C') {
            this.summarizings[0].progress = !response.body.result.personNumNum || !response.body.result.maxNumNum ? 0 : Math.floor(response.body.result.personNumNum / response.body.result.maxNumNum * 100)
            this.summarizings[0].num = response.body.result.personNumNum || 0
            this.summarizings[1].progress = !response.body.result.personSumprofitsNum || !response.body.result.maxSumprofitsNum ? 0 : Math.floor(response.body.result.personSumprofitsNum / response.body.result.maxSumprofitsNum * 100)
            this.summarizings[1].num = (response.body.result.personSumprofitsNum || 0) >= 10000 ? Math.floor((response.body.result.personSumprofitsNum || 0) / 10000) : (response.body.result.personSumprofitsNum || 0)
            this.summarizings[1].des = (response.body.result.personSumprofitsNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[2].progress = !response.body.result.personCostNum || !response.body.result.maxCostNum ? 0 : Math.floor(response.body.result.personCostNum / response.body.result.maxCostNum * 100)
            this.summarizings[2].num = (response.body.result.personCostNum || 0) >= 10000 ? Math.floor((response.body.result.personCostNum || 0) / 10000) : (response.body.result.personCostNum || 0)
            this.summarizings[2].des = (response.body.result.personCostNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[3].progress = !response.body.result.personProfitNum || !response.body.result.maxProfitNum ? 0 : Math.floor(response.body.result.personProfitNum / response.body.result.maxProfitNum * 100)
            this.summarizings[3].num = (response.body.result.personProfitNum || 0) >= 10000 ? Math.floor((response.body.result.personProfitNum || 0) / 10000) : (response.body.result.personProfitNum || 0)
            this.summarizings[3].des = (response.body.result.personProfitNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[4].progress = !response.body.result.personProfitrateNum || !response.body.result.maxDeriveNum ? 0 : Math.floor(response.body.result.personProfitrateNum / response.body.result.maxDeriveNum * 100)
            this.summarizings[4].num = response.body.result.personProfitrateNum || 0
            this.summarizings[5].progress = !response.body.result.personMaintainNum || !response.body.result.maxMaintainNum ? 0 : Math.floor(response.body.result.personMaintainNum / response.body.result.maxMaintainNum * 100)
            this.summarizings[5].num = response.body.result.personMaintainNum || 0
          } else if (this.$moment.userInfo.user.scope === 'D') {
            this.summarizings[0].progress = !response.body.result.personNumNum || !response.body.result.maxNumNum ? 0 : Math.floor(response.body.result.personNumNum / response.body.result.maxNumNum * 100)
            this.summarizings[0].num = response.body.result.personNumNum || 0
            this.summarizings[1].progress = !response.body.result.personSumprofitsNum || !response.body.result.maxSumprofitsNum ? 0 : Math.floor(response.body.result.personSumprofitsNum / response.body.result.maxSumprofitsNum * 100)
            this.summarizings[1].num = (response.body.result.personSumprofitsNum || 0) >= 10000 ? Math.floor((response.body.result.personSumprofitsNum || 0) / 10000) : (response.body.result.personSumprofitsNum || 0)
            this.summarizings[1].des = (response.body.result.personSumprofitsNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[2].progress = !response.body.result.personProfitNum || !response.body.result.maxProfitNum ? 0 : Math.floor(response.body.result.personProfitNum / response.body.result.maxProfitNum * 100)
            this.summarizings[2].num = (response.body.result.personProfitNum || 0) >= 10000 ? Math.floor((response.body.result.personProfitNum || 0) / 10000) : (response.body.result.personProfitNum || 0)
            this.summarizings[2].des = (response.body.result.personProfitNum || 0) >= 10000 ? '万元' : '元'
            this.summarizings[3].progress = !response.body.result.personRenewalNum || !response.body.result.maxRenewalNum ? 0 : Math.floor(response.body.result.personRenewalNum / response.body.result.maxRenewalNum * 100)
            this.summarizings[3].num = (response.body.result.personRenewalNum || 0) >= 10000 ? Math.floor((response.body.result.personRenewalNum || 0) / 10000) : (response.body.result.personRenewalNum || 0)
            this.summarizings[3].des = (response.body.result.personRenewalNum || 0) >= 10000 ? '万元' : '元'
          }
        }
        if (this.$moment.userInfo.user.scope === 'A') {
          this.$comfun.http_post(this, `data/public/profit/${this.$moment.userInfo.user.id}`, {
            startDate: startDate,
            endDate: endDate
          }).then((response) => {
            if (response.body.success === '1') {
              this.mlvChartOpt.title.text = `{money|${response.body.profit.profitSum || 0}}\t\t{unit|元}\n综合毛利`
              this.mlvChartOpt.series[0].data[0].value = response.body.profit.newcarProfit || 0
              this.mlvChartOpt.series[0].data[1].value = response.body.profit.insuranceProfit || 0
              this.mlvChartOpt.series[0].data[2].value = response.body.profit.oldcarProfit || 0
              this.mlvChartOpt.series[0].data[3].value = response.body.profit.financeProfit || 0
              this.mlvChartOpt.series[0].data[4].value = response.body.profit.accessoryProfit || 0
            }
          })
        }
        var grjxUri = `data/public/perf/${this.$moment.userInfo.user.id}`
        if (this.$moment.userInfo.user.scope === 'B') { // B:机电服务顾问
          grjxUri = `after/public/perf/serve/${this.$moment.userInfo.user.id}`
        } else if (this.$moment.userInfo.user.scope === 'C') { // C:机电班组
          grjxUri = `after/public/perf/group/${this.$moment.userInfo.user.id}`
        } else if (this.$moment.userInfo.user.scope === 'D') { // D:事故服务顾问
          grjxUri = `after/public/perf/accident/${this.$moment.userInfo.user.id}`
        }
        this.$comfun.http_post(this, grjxUri, {
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          this.dateChangeLoading = false
          if (response.body.success === '1') {
            if (this.$moment.userInfo.user.scope === 'A') {
              this.grjxChartOpt.title.text = `{money|${response.body.perf.profitSum || 0}}\t\t{unit|元}\n个人绩效`
              this.grjxChartOpt.series[0].data[0].value = response.body.perf.newcarPerf || 0
              this.grjxChartOpt.series[0].data[1].value = response.body.perf.insurancePerf || 0
              this.grjxChartOpt.series[0].data[2].value = response.body.perf.oldcarPerf || 0
              this.grjxChartOpt.series[0].data[3].value = response.body.perf.financePerf || 0
              this.grjxChartOpt.series[0].data[4].value = response.body.perf.accessoryPerf || 0
            } else if (this.$moment.userInfo.user.scope === 'B') { // B:机电服务顾问
              this.grjxChartOpt.title.text = `{money|${response.body.result.sumAll || 0}}\t\t{unit|元}\n个人绩效`
              this.grjxChartOpt.series[0].data[0].value = response.body.result.hrSenioritypay || 0
              this.grjxChartOpt.series[0].data[1].value = response.body.result.hrAllowance || 0
              this.grjxChartOpt.series[0].data[2].value = response.body.result.hrNum || 0
              this.grjxChartOpt.series[0].data[3].value = response.body.result.hrProfit || 0
              this.grjxChartOpt.series[0].data[4].value = response.body.result.hrDerive || 0
              this.grjxChartOpt.series[0].data[5].value = response.body.result.hrRenewal || 0
              this.grjxChartOpt.series[0].data[6].value = response.body.result.hrOtherroyalty || 0
            } else if (this.$moment.userInfo.user.scope === 'C') { // C:机电班组
              this.grjxChartOpt.title.text = `{money|${response.body.result.sumAll || 0}}\t\t{unit|元}\n个人绩效`
              this.grjxChartOpt.series[0].data[0].value = response.body.result.hrNum || 0
              this.grjxChartOpt.series[0].data[1].value = response.body.result.hrProfit || 0
              this.grjxChartOpt.series[0].data[2].value = response.body.result.hrManhour || 0
              this.grjxChartOpt.series[0].data[3].value = response.body.result.hrAdditional || 0
              this.grjxChartOpt.series[0].data[4].value = response.body.result.hrDerive || 0
              this.grjxChartOpt.series[0].data[5].value = response.body.result.hrRenewal || 0
              this.grjxChartOpt.series[0].data[6].value = response.body.result.hrOtherroyalty || 0
            } else if (this.$moment.userInfo.user.scope === 'D') { // D:事故服务顾问
              this.grjxChartOpt.title.text = `{money|${response.body.result.sumAll || 0}}\t\t{unit|元}\n个人绩效`
              this.grjxChartOpt.series[0].data[0].value = response.body.result.hrSenioritypay || 0
              this.grjxChartOpt.series[0].data[1].value = response.body.result.hrAllowance || 0
              this.grjxChartOpt.series[0].data[2].value = response.body.result.hrNum || 0
              this.grjxChartOpt.series[0].data[3].value = response.body.result.hrProfit || 0
              this.grjxChartOpt.series[0].data[4].value = response.body.result.hrDerive || 0
              this.grjxChartOpt.series[0].data[5].value = response.body.result.hrRenewal || 0
              this.grjxChartOpt.series[0].data[6].value = response.body.result.hrOtherroyalty || 0
            }
          }
        })
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
      this.getLineChartData(type, startDate, endDate)
    },
    getLineChartData (type, startDate, endDate) {
      var chartLimitDate = ''
      if (this.$moment.userInfo.user.scope === 'A') {
        // 整车
        this.$comfun.http_post(this, `data/public/newcar/curve/${this.$moment.userInfo.user.id}`, {
          type: type,
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            var xAxisData = []
            var seriesData = []
            for (let i = 0; i < response.body.newcar.length; i++) {
              let startDate = null
              let endDate = null
              if (type === 2) {
                startDate = new Date(response.body.newcar[i].startDate.replace(/-/g, '/'))
                endDate = new Date(response.body.newcar[i].endDate.replace(/-/g, '/'))
                let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d') + '-' + this.$comfun.formatDate(endDate, 'yy/M/d')
                xAxisData.push(xAxis)
              } else if (type === 3) {
                xAxisData.push(String(response.body.newcar[i].yearnum).substr(2, 2) + '-' + response.body.newcar[i].monthnum)
              } else if (type === 4) {
                xAxisData.push(String(response.body.newcar[i].yearnum))
              }
              seriesData.push({
                value: response.body.newcar[i].num ? response.body.newcar[i].num : 0,
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
        this.$comfun.http_post(this, `data/public/oldcar/curve/${this.$moment.userInfo.user.id}`, {
          type: type,
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            var xAxisData = []
            var seriesData = []
            for (let i = 0; i < response.body.oldcar.length; i++) {
              let startDate = null
              let endDate = null
              if (type === 2) {
                startDate = new Date(response.body.oldcar[i].startDate.replace(/-/g, '/'))
                endDate = new Date(response.body.oldcar[i].endDate.replace(/-/g, '/'))
                let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d') + '-' + this.$comfun.formatDate(endDate, 'yy/M/d')
                xAxisData.push(xAxis)
              } else if (type === 3) {
                xAxisData.push(String(response.body.oldcar[i].yearnum).substr(2, 2) + '-' + response.body.oldcar[i].monthnum)
              } else if (type === 4) {
                xAxisData.push(String(response.body.oldcar[i].yearnum))
              }
              seriesData.push({
                value: response.body.oldcar[i].num ? response.body.oldcar[i].num : 0,
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
        this.$comfun.http_post(this, `data/public/insurance/curve/${this.$moment.userInfo.user.id}`, {
          type: type,
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            var xAxisData = []
            var seriesData = []
            for (let i = 0; i < response.body.insurance.length; i++) {
              let startDate = null
              let endDate = null
              if (type === 2) {
                startDate = new Date(response.body.insurance[i].startDate.replace(/-/g, '/'))
                endDate = new Date(response.body.insurance[i].endDate.replace(/-/g, '/'))
                let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d') + '-' + this.$comfun.formatDate(endDate, 'yy/M/d')
                xAxisData.push(xAxis)
              } else if (type === 3) {
                xAxisData.push(String(response.body.insurance[i].yearnum).substr(2, 2) + '-' + response.body.insurance[i].monthnum)
              } else if (type === 4) {
                xAxisData.push(String(response.body.insurance[i].yearnum))
              }
              seriesData.push({
                value: response.body.insurance[i].num ? response.body.insurance[i].num : 0,
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
        this.$comfun.http_post(this, `data/public/accessory/curve/${this.$moment.userInfo.user.id}`, {
          type: type,
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            var xAxisData = []
            var seriesData = []
            for (let i = 0; i < response.body.accessory.length; i++) {
              let startDate = null
              let endDate = null
              if (type === 2) {
                startDate = new Date(response.body.accessory[i].startDate.replace(/-/g, '/'))
                endDate = new Date(response.body.accessory[i].endDate.replace(/-/g, '/'))
                let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d') + '-' + this.$comfun.formatDate(endDate, 'yy/M/d')
                xAxisData.push(xAxis)
              } else if (type === 3) {
                xAxisData.push(String(response.body.accessory[i].yearnum).substr(2, 2) + '-' + response.body.accessory[i].monthnum)
              } else if (type === 4) {
                xAxisData.push(String(response.body.accessory[i].yearnum))
              }
              seriesData.push({
                value: response.body.accessory[i].num ? response.body.accessory[i].num : 0,
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
        this.$comfun.http_post(this, `data/public/finance/curve/${this.$moment.userInfo.user.id}`, {
          type: type,
          startDate: startDate,
          endDate: endDate
        }).then((response) => {
          if (response.body.success === '1') {
            var xAxisData = []
            var seriesData = []
            for (let i = 0; i < response.body.finance.length; i++) {
              let startDate = null
              let endDate = null
              if (type === 2) {
                startDate = new Date(response.body.finance[i].startDate.replace(/-/g, '/'))
                endDate = new Date(response.body.finance[i].endDate.replace(/-/g, '/'))
                let xAxis = this.$comfun.formatDate(startDate, 'yy/M/d') + '-' + this.$comfun.formatDate(endDate, 'yy/M/d')
                xAxisData.push(xAxis)
              } else if (type === 3) {
                xAxisData.push(String(response.body.finance[i].yearnum).substr(2, 2) + '-' + response.body.finance[i].monthnum)
              } else if (type === 4) {
                xAxisData.push(String(response.body.finance[i].yearnum))
              }
              seriesData.push({
                value: response.body.finance[i].num ? response.body.finance[i].num : 0,
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
      } else {
        var curveType = ''
        var curveUris = []
        if (this.$moment.userInfo.user.scope === 'B') { // B:机电服务顾问
          curveType = 'serve'
          curveUris = [
            'serve/curve/num/', 'serve/curve/oneprofit/', 'serve/curve/sumprofits/', 'serve/curve/profit/',
            'serve/curve/derive/', 'serve/curve/maintain/', 'serve/curve/newmember/', 'serve/curve/renewal/'
          ]
        } else if (this.$moment.userInfo.user.scope === 'C') { // C:机电班组
          curveType = 'group'
          curveUris = [
            'group/curve/num/', 'group/curve/sumprofits/', 'group/curve/cost/', 'group/curve/profit/', 'group/curve/profitrate/',
            'group/curve/maintain/'
          ]
        } else if (this.$moment.userInfo.user.scope === 'D') { // D:事故服务顾问
          curveType = 'accident'
          curveUris = [
            'accident/curve/num/', 'accident/curve/sumprofits/', 'accident/curve/profit/', 'accident/curve/renewal/'
          ]
        }
        for (let uriIndex in curveUris) {
          ;((uriIndex) => {
            this.$comfun.http_post(this, `after/public/${curveUris[uriIndex]}${this.$moment.userInfo.user.id}`, {
              type: type,
              startDate: startDate,
              endDate: endDate
            }).then((response) => {
              if (response.body.success === '1') {
                var xAxisData = []
                var seriesData = []
                for (let i = 0; i < response.body[curveType].length; i++) {
                  let startDate = new Date(response.body[curveType][i].date.replace(/-/g, '/'))
                  let xAxis = ''
                  if (type === 2) {
                    xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
                  } else if (type === 3) {
                    xAxis = this.$comfun.formatDate(startDate, 'yy/M/d')
                  } else if (type === 4) {
                    xAxis = this.$comfun.formatDate(startDate, 'yy')
                  }
                  xAxisData.push(xAxis)
                  seriesData.push({
                    value: response.body[curveType][i].num ? response.body[curveType][i].num : 0,
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
                this.curveChartOpts[uriIndex].xAxis.data = xAxisData
                this.curveChartOpts[uriIndex].series[0].data = seriesData
                this.curveChartOpts[uriIndex].dataZoom = [
                  {
                    startValue: chartLimitDate
                  },
                  {
                    type: 'inside'
                  }
                ]
              }
            })
          })(uriIndex)
        }
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
          background-image: url('./../assets/star-2.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
        }
        i.star:nth-of-type(n + 2) {
          margin-left: 0.3rem;
        }
        i.has-star {
          width: 0.93rem;
          background-image: url('./../assets/star-1.png');
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
    height: 8.4rem;
    font-size: 0;
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
    /* 进度条样式 */
    .progress-strip-wrap {
      position: relative;
      display: inline-block;
      width: 50%;
      font-size: 0.8rem;
      .des-wrap {
        position: relative;
        .title {
          position: relative;
          display: inline-block;
          font-size: 0.6rem;
          transform: scale(0.8, 0.8);
        }
        .num-wrap {
          position: absolute;
          left: 4rem;
          bottom: -0.2rem;
          white-space: nowrap;
          .num {
            position: relative;
            font-size: 1.2rem;
            display: inline-block;
            transform: scale(0.8, 0.8);
          }
          .des {
            position: relative;
            color: rgb(126, 172, 228);
            font-size: 0.6rem;
            display: inline-block;
            transform: scale(0.8, 0.8);
          }
        }
      }
      .progress-rail {
        position: relative;
        margin-top: 0.6rem;
        margin-bottom: 1.2rem;
        width: 94%;
        height: 3px;
        background-color: rgb(84, 129, 184);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0;
        .progress-cur {
          position: relative;
          height: 100%;
          width: 0%;
          background-color: #1FFF98;
          transition: all 0.4s ease 0s;
        }
        div.progress-animate {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to left, rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(51, 106, 175, .4), rgba(51, 106, 175, .6), rgba(51, 106, 175, .8), rgba(51, 106, 175, .6), rgba(51, 106, 175, .4), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0));
          animation: moveflash 5s ease 0s infinite;
        }
      }
      .progress-percent-val {
        position: absolute;
        bottom: 0.9rem;
        display: inline-block;
        font-size: 0.6rem;
        color: #3dbbff;
        transition: all 0.4s ease 0s;
        margin-left: 0.2rem;
      }
    }
    .line-last {
      padding-left: 0.8rem;
      width: calc(50% - 0.8rem);
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
      top: 11rem;
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
        bottom: -0.36rem;
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

@keyframes moveflash {
  0% {
    transform: translateX(-68%);
  }
  100% {
    transform: translateX(68%);
  }
}
</style>
