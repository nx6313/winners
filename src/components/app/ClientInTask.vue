<template>
  <div class="client-in-task">
    <template v-if="isloading">
      <span class="data-loading">正在加载中...</span>
    </template>
    <template v-if="!isloading && todaySum === 0">
      <span class="data-empty">数据为空</span>
    </template>
    <template v-if="!isloading && todaySum > 0">
      <div class="count-header">
        <div class="count-wrap">
          <div class="txt-item-wrap">
            <div>
              <span>{{todaySum}}</span>
              <span>批次</span>
            </div>
            <div>需接待客户量</div>
          </div>
          <i></i>
          <div class="txt-item-wrap">
            <div>
              <span>{{completeSum}}</span>
              <span>批次</span>
            </div>
            <div>已完善资料</div>
          </div>
          <i></i>
          <div class="txt-item-wrap">
            <div>
              <span>{{todaySum - completeSum}}</span>
              <span>批次</span>
            </div>
            <div>尚未完善</div>
          </div>
        </div>
        <div class="anay-line-wrap">
          <div class="rail-wrap">
            <i v-for="(i, index) in todaySum" :key="index" :class="['iconfont', i <= completeSum ? ['icon-wdyj1', 'completed'] : 'icon-wdyj']" :style="{ 'width': `calc(100% / ${todaySum})` }"></i>
          </div>
          <span class="arrow completed-arrow" v-if="completeSum > 0">今日接待客户量</span>
          <span class="arrow uncompleted-arrow" v-if="todaySum - completeSum > 0">距任务量还差</span>
        </div>
      </div>
      <div class="list-wrap">
        <div class="item-wrap" v-for="(data, dataIndex) in dataList" :key="dataIndex" @click="toComplete(data)">
          <div class="header flex-r flex-b">
            <span><i>{{dataIndex + 1}}</i>客户</span>
            <span>去完善<i class="iconfont icon-right"></i></span>
          </div>
          <div class="content">
            <div>
              <span>来访时间</span>
              <span>{{$comfun.formatDate(new Date(data.arrivalTime.replace(/-/g, '/')), 'MM/dd hh:mm')}}</span>
            </div>
            <div>
              <span>离店时间</span>
              <span>{{$comfun.formatDate(new Date(data.leaveTime.replace(/-/g, '/')), 'MM/dd hh:mm')}}</span>
            </div>
            <div>
              <span>来访人数</span>
              <span>{{data.custoNo}} 人</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AppClientInTask',
  data () {
    return {
      isloading: true,
      todaySum: 0,
      completeSum: 0,
      dataList: []
    }
  },
  mounted () {
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      this.initPageData()
    })
    this.$root.eventHub.$on('refPage', () => {
      this.initPageData()
    })
    this.initPageData()
  },
  methods: {
    initPageData () {
      if (this.$moment.userInfo.user) {
        this.isloading = true
        this.$comfun.http_get(this, this.$moment.appServer + `custoFrontRecordManager/countTodayNum`, {
          lcId: this.$moment.userInfo.user.id,
          arrivalTime: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
          leaveTime: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
        }).then((response) => {
          this.todaySum = response.body.todaySum
          this.completeSum = response.body.completeSum
          this.$comfun.http_get(this, this.$moment.appServer + `custoFrontRecordManager/findAll`, {
            lcId: this.$moment.userInfo.user.id,
            arrivalTime: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd'),
            leaveTime: this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
          }).then((response) => {
            this.isloading = false
            if (response.body.totals > 0) {
              this.dataList = []
              for (let i in response.body.list) {
                this.dataList.push({
                  frId: response.body.list[i].frId,
                  lcName: response.body.list[i].lcName,
                  arrivalTime: response.body.list[i].ArrivalTime,
                  leaveTime: response.body.list[i].LeaveTime,
                  custoNo: response.body.list[i].custoNo
                })
              }
            }
          })
        })
      }
    },
    toComplete (data) {
      this.$call('skipPage', JSON.stringify({
        path: 'app-client-in',
        title: '潜客录入',
        titleBarColor: '#1F6FC8',
        statusBarStyle: 'highlight',
        fullPage: false,
        pageParams: {
          dataId: data.frId
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.client-in-task {
  position: relative;
  height: 100vh;
  background-color: #F5F5F5;
  .count-header {
    position: relative;
    background-color: #007FC8;
    margin: 0.6rem 0.5rem;
    border-radius: 4px;
    padding: 1.3rem 1rem;
    .count-wrap {
      position: relative;
      color: #FFFFFF;
      font-size: 0;
      .txt-item-wrap {
        position: relative;
        display: inline-block;
        text-align: center;
        width: calc((100% - 2px) / 3);
        div:first-of-type {
          position: relative;
          font-size: 0.8rem;
          span:first-of-type {
            position: relative;
            font-size: 1.6rem;
            font-weight: bold;
          }
          span:last-of-type {
            position: relative;
            margin-left: 0.2rem;
          }
        }
        div:last-of-type {
          position: relative;
          margin-top: 0.8rem;
          font-size: 0.8rem;
          color: rgb(136, 209, 255);
        }
      }
      .txt-item-wrap:last-of-type {
        div:first-of-type {
          span:first-of-type {
            color: rgb(255, 94, 94);
          }
        }
      }
      i {
        position: relative;
        display: inline-block;
        width: 1px;
        height: 2rem;
        top: -0.4rem;
        background: linear-gradient(left, rgb(165, 221, 255), #8adaff);
        box-shadow: 0 0 2px rgb(63, 151, 202);
      }
    }
    .anay-line-wrap {
      position: relative;
      margin-top: 1.2rem;
      padding-bottom: 1.6rem;
      .rail-wrap {
        position: relative;
        font-size: 0;
        border-radius: 4px;
        overflow: hidden;
        i {
          position: relative;
          display: inline-block;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          background-color: #FFFFFF;
          z-index: 1;
        }
        i.completed {
          background-color: #00FF8A;
        }
      }
      .arrow {
        position: absolute;
        display: inline-block;
        top: 1.8rem;
        font-size: 0.8rem;
        color: #FFFFFF;
        margin-top: 1.4rem;
      }
      .completed-arrow {
        left: 0.6rem;
      }
      .completed-arrow::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -2rem;
        width: 1rem;
        height: 1rem;
        background-color: #00FF8A;
        transform: rotate(58deg) skewX(28deg);
        z-index: 0;
      }
      .uncompleted-arrow {
        right: 0.6rem;
      }
      .uncompleted-arrow::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -2rem;
        width: 1rem;
        height: 1rem;
        background-color: #FFFFFF;
        transform: rotate(58deg) skewX(28deg);
        z-index: 0;
      }
    }
  }
  .list-wrap {
    position: relative;
    .item-wrap {
      position: relative;
      background-color: #FFFFFF;
      margin: 0.8rem 0;
      padding: 0.6rem 0.8rem;
      .header {
        position: relative;
        font-size: 0.8rem;
        padding: 0.6rem 0;
        span {
          position: relative;
        }
        span:first-of-type {
          font-size: 1rem;
          i {
            position: relative;
            display: inline-block;
            width: 1.4rem;
            height: 1.4rem;
            line-height: 1.6rem;
            font-size: 0.8rem;
            text-align: center;
            font-style: normal;
            background-color: rgb(159, 219, 252);
            border-radius: 50%;
            color: rgb(0, 116, 184);
            top: -0.18rem;
            margin-right: 0.4rem;
          }
        }
        span:last-of-type {
          font-size: 0.9rem;
          color: #007FC8;
          i {
            position: relative;
            font-size: 1rem;
            color: rgb(180, 180, 180);
            margin-left: 0.4rem;
            top: 0.1rem;
          }
        }
      }
      .header::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #ebebeb;
      }
      .content {
        position: relative;
        padding: 1.2rem 0 0.6rem;
        font-size: 0;
        div {
          position: relative;
          display: inline-block;
          text-align: center;
          width: calc(100% / 3);
          span {
            position: relative;
            display: block;
            font-size: 0.8rem;
            color: #747474;
          }
          span:last-of-type {
            margin-top: 1.2rem;
            color: #272727;
            font-size: 0.9rem;
          }
        }
        div:first-of-type {
          text-align: left;
        }
        div:last-of-type {
          text-align: right;
        }
      }
    }
  }
}
</style>
