<template>
  <div class="client-manager-detail">
    <div class="client-item-wrap" v-for="(data, dataIndex) in dataList" :key="dataIndex">
      <div class="do-wrap">234</div>
      <div class="move-point">
        <div class="head-wrap flex-r flex-b">
          <div class="left">
            <span>A</span>
            <span>都吉欣</span>
            <span>来访时间：<i>18/02/22</i></span>
          </div>
          <div class="right">
            <i class="iconfont icon-phone"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppClientManagerDetail',
  data () {
    return {
      dataList: []
    }
  },
  mounted () {
    // 模拟数据
    this.dataList = [
      {}, {}
    ]
  }
}
</script>

<style lang="scss" scoped>
.client-manager-detail {
  position: relative;
  background-color: #F5F5F5;
  height: 100vh;
  font-size: 0.8rem;
  .client-item-wrap {
    position: relative;
    background-color: #ffffff;
    .do-wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      background-color: #FF3B30;
      width: 4rem;
    }
    .move-point {
      position: relative;
      background-color: #ffffff;
      padding: 0.8rem 1rem;
    }
    .head-wrap {
      position: relative;
      .left {
        position: relative;
        span {
          position: relative;
          display: inline-block;
          vertical-align: bottom;
        }
        i {
          position: relative;
          display: inline-block;
          font-style: normal;
          vertical-align: bottom;
          color: #484848;
        }
        span:nth-of-type(1) {
          width: 1.1rem;
          height: 1.1rem;
          line-height: 1.1rem;
          border-radius: 50%;
          text-align: center;
          background-color: #A8DAF4;
          font-size: 0.5rem;
          color: rgb(31, 137, 194);
          margin-right: 0.3rem;
        }
        span:nth-of-type(2) {
          font-size: 1rem;
        }
        span:nth-of-type(3) {
          font-size: 0.6rem;
          color: #727272;
          margin-left: 0.4rem;
        }
      }
      .right {
        position: relative;
        i {
          position: relative;
          color: #23EFA9;
          font-size: 1.4rem;
        }
      }
    }
  }
  .client-item-wrap:nth-of-type(n + 2) {
    margin-top: 0.8rem;
  }
}
</style>
