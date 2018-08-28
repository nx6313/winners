<template>
  <div class="client-manager">
    <div class="top-wrap">
      <div class="item-wrap">
        <div>
          <span>总人数（人）</span>
          <span>{{headData.total}}</span>
        </div>
        <div>
          <span>意向客户（人）</span>
          <span>{{headData.intentionCount}}</span>
        </div>
        <div>
          <span>试乘试驾（人）</span>
          <span>{{headData.tryCarCount}}</span>
        </div>
      </div>
      <div class="item-wrap">
        <div>
          <span>成交客户（人）</span>
          <span>{{headData.okCount}}</span>
        </div>
        <div>
          <span>战败客户（人）</span>
          <span>{{headData.defeatCount}}</span>
        </div>
      </div>
    </div>
    <div class="tabs-wrap">
      <div class="tabs-header-wrap">
        <span :class="curPage === 0 ? 'cur-head' : ''" @click="toTab(0)">客户级别</span>
        <span :class="curPage === 1 ? 'cur-head' : ''" @click="toTab(1)">意向车系</span>
        <span :class="curPage === 2 ? 'cur-head' : ''" @click="toTab(2)">录入时间</span>
        <span :class="curPage === 3 ? 'cur-head' : ''" @click="toTab(3)">跟进次数</span>
        <i class="head-indicator" :style="{ 'left': `calc(100% / 4 * ${curPage} + 1rem)` }"></i>
      </div>
      <template v-if="curPage === 0">
        <div class="level-client-item" v-for="(level, levelIndex) in levelList" :key="levelIndex" @click="toPage(`${level.level}类客户详情`, level.level)">
          <span class="level-type">{{level.level}}</span>
          <div class="progress-wrap">
            <span class="progress-title">{{level.level}}级别客户</span>
            <div class="progress-rail">
              <div class="progress-cur" :style="{ 'width': `${level.count / headData.total * 100}%`, 'background-color': `${colors[levelIndex]}` }"></div>
              <span class="progress-val" :style="level.count / headData.total * 100 >= 70 ? { 'left': `calc(70% + 0.4rem)` } : { 'left': `calc(${level.count / headData.total * 100}% + 0.4rem)` }">{{(level.count / headData.total * 100).toFixed(2)}}%</span>
            </div>
          </div>
          <div class="arrow-wrap">
            <span>{{level.count}}</span>
            <span>人</span>
            <i class="iconfont icon-right"></i>
          </div>
        </div>
      </template>
      <template v-if="curPage === 1">
        <div class="level-client-item" v-for="(intention, intentionIndex) in intentionList" :key="intentionIndex" @click="toPage(`${intention.carName} - 意向客户详情`, intention.carId)">
          <span class="level-type-car" :style="{ 'background-image': `url(${intention.carImg})` }"></span>
          <div class="progress-wrap">
            <span class="progress-title">{{intention.carName}}</span>
            <div class="progress-rail">
              <div class="progress-cur" :style="{ 'width': `${intention.count / headData.total * 100}%`, 'background-color': `${colors[intentionIndex]}` }"></div>
              <span class="progress-val" :style="intention.count / headData.total * 100 >= 70 ? { 'left': `calc(70% + 0.4rem)` } : { 'left': `calc(${intention.count / headData.total * 100}% + 0.4rem)` }">{{(intention.count / headData.total * 100).toFixed(2)}}%</span>
            </div>
          </div>
          <div class="arrow-wrap">
            <span>{{intention.count}}</span>
            <span>人</span>
            <i class="iconfont icon-right"></i>
          </div>
        </div>
      </template>
      <template v-if="curPage === 2">
        <div class="data-item-wrap flex-r flex-b" v-for="(time, timeIndex) in timeList" :key="timeIndex" @click="toPage(`${time.title} - 意向客户详情`, time.timeId)">
          <div class="left-content">{{time.title}}</div>
          <div class="right-content">
            <span>{{time.count}}</span>
            <i class="iconfont icon-right"></i>
          </div>
        </div>
      </template>
      <template v-if="curPage === 3">
        <div class="data-item-wrap flex-r flex-b" v-for="(followCount, followCountIndex) in followCountList" :key="followCountIndex" @click="toPage(`${followCount.title} - 意向客户详情`, followCount.followCount)">
          <div class="left-content">{{followCount.title}}</div>
          <div class="right-content">
            <span>{{followCount.count}}</span>
            <i class="iconfont icon-right"></i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppClientManager',
  data () {
    return {
      curPage: 0,
      colors: ['#FCC858', '#58EBFC', '#7598FF', '#A1FC58', '#58FCC0', '#FCC858', '#58FCA5', '#FC6F68', '#B868FC', '#BFFF5B', '#FFC35B'],
      headData: {
        total: 300,
        intentionCount: 25,
        tryCarCount: 20,
        okCount: 21,
        defeatCount: 3
      },
      levelList: [],
      intentionList: [],
      timeList: [],
      followCountList: []
    }
  },
  mounted () {
    this.$call('addTitleBtn', JSON.stringify([
      {
        event: 'title-btn-month',
        txt: '月'
      },
      {
        event: 'title-btn-year',
        txt: '总计'
      }
    ]))
    // 数据模拟
    this.levelList = [
      {
        level: 'H',
        count: 45
      },
      {
        level: 'A',
        count: 300
      }
    ]
    this.intentionList = [
      {
        carId: 1,
        carImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535347553991&di=e9193e1a8815074e6541dc28e9981954&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3De0cfd96b3312b31bd361c56aee715c0f%2Fb151f8198618367a49f63af124738bd4b31ce59b.jpg',
        carName: '科雷傲',
        count: 45
      },
      {
        carId: 2,
        carImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535942290&di=af819322355c90d2b4a0c842fa1fd2b6&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F38dbb6fd5266d016e36c420c9d2bd40735fa3599.jpg',
        carName: '梅甘娜',
        count: 80
      },
      {
        carId: 3,
        carImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535347602444&di=26718d17c0c09b1d226ae118647e4ffa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fbd315c6034a85edf27ea220743540923dd5475b4.jpg',
        carName: '风朗',
        count: 300
      }
    ]
    this.timeList = [
      {
        timeId: 1,
        title: '本周',
        count: 150
      },
      {
        timeId: 2,
        title: '本日',
        count: 120
      },
      {
        timeId: 3,
        title: '本月',
        count: 120
      }
    ]
    this.followCountList = [
      {
        followCount: 1,
        title: '一次跟进',
        count: 150
      },
      {
        followCount: 2,
        title: '两次跟进',
        count: 120
      }
    ]
  },
  methods: {
    toTab (tabIndex) {
      this.curPage = tabIndex
    },
    toPage (pageTitle, key) {
      this.$call('skipPage', JSON.stringify({
        path: 'app-client-manager-detail',
        title: pageTitle,
        titleBarColor: '#1F6FC8',
        statusBarStyle: 'highlight',
        fullPage: false,
        pageParams: {
          dataKey: key
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.client-manager {
  position: relative;
  background-color: #ffffff;
  height: 100vh;
  font-size: 0.8rem;
  .top-wrap {
    position: relative;
    background-color: #ffffff;
    margin-bottom: 0.8rem;
    .item-wrap {
      position: relative;
      padding: 1.5rem 0;
      font-size: 0;
      div {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        width: calc(100% / 3);
        text-align: center;
        span {
          position: relative;
          display: block;
          font-size: 0.7rem;
          color: rgb(85, 85, 85);
        }
        span:last-of-type {
          font-size: 0.9rem;
          margin-top: 0.8rem;
          color: rgb(0, 114, 180);
        }
      }
      div:nth-of-type(n + 2)::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-left: 1px solid #ececec;
      }
    }
    .item-wrap:first-of-type::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #ececec;
    }
  }
  .top-wrap::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    left: 0;
    right: 0;
    height: 0.8rem;
    background-color: #f5f5f5;
  }
  .tabs-wrap {
    position: relative;
    .tabs-header-wrap {
      position: relative;
      font-size: 0;
      span {
        position: relative;
        display: inline-block;
        font-size: 0.8rem;
        width: calc(100% / 4);
        text-align: center;
        padding: 0.9rem 0;
      }
      .cur-head {
        color: #007FC8;
      }
      i.head-indicator {
        position: absolute;
        left: calc(100% / 4 * 0 + 1rem);
        bottom: 0.1rem;
        width: calc(100% / 4 - 2 * 1rem);
        height: 0.16rem;
        border-radius: 2rem;
        background-color: #007FC8;
      }
    }
    .tabs-header-wrap::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #ececec;
    }
    .level-client-item {
      position: relative;
      padding: 1rem 0.8rem 0;
      height: 3rem;
      .level-type {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        border-radius: 50%;
        background-color: #007FC8;
        color: #ffffff;
        font-size: 0.9rem;
      }
      .level-type-car {
        position: relative;
        display: inline-block;
        width: 3.4rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
      }
      .progress-wrap {
        position: absolute;
        top: 1rem;
        bottom: 0;
        left: 4.5rem;
        right: 5.3rem;
        .progress-title {
          position: relative;
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.86rem;
        }
        .progress-rail {
          position: relative;
          width: 100%;
          height: 1.4rem;
          background-color: #f5f5f5;
          .progress-cur {
            position: relative;
            display: inline-block;
            width: 0%;
            height: 100%;
            background-color: #007FC8;
          }
          .progress-val {
            position: absolute;
            line-height: 1.4rem;
            display: inline-block;
            font-size: 0.6rem;
            left: calc(0% + 0.4rem);
            top: 0;
            bottom: 0;
            margin: auto 0;
          }
        }
      }
      .arrow-wrap {
        position: absolute;
        top: 1.65rem;
        bottom: 0;
        right: 0.8rem;
        padding: 0.9rem 0;
        span:first-of-type {
          position: relative;
          font-size: 0.9rem;
        }
        span:last-of-type {
          position: relative;
          font-size: 0.6rem;
        }
        i {
          position: relative;
          color: #dbdbdb;
          font-size: 0.8rem;
          margin-left: 0.2rem;
        }
      }
    }
    .data-item-wrap {
      position: relative;
      padding: 1rem 0.8rem;
      .left-content {
        position: relative;
        font-size: 0.8rem;
      }
      .right-content {
        position: relative;
        font-size: 0.8rem;
        color: rgb(190, 190, 190);
        i {
          font-size: 0.9rem;
          margin-left: 0.8rem;
        }
      }
    }
    .data-item-wrap::before {
      content: '';
      position: absolute;
      left: 0.8rem;
      right: 0.8rem;
      bottom: 0;
      border-top: 1px solid #f0f0f0;
    }
    .data-item-wrap:last-of-type::before {
      border-top: none;
    }
  }
}
</style>
