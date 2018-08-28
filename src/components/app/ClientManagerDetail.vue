<template>
  <div class="client-manager-detail">
    <div class="client-item-wrap" v-for="(data, dataIndex) in dataList" :key="dataIndex">
      <div class="head-wrap flex-r flex-b">
        <div class="left">
          <span>A</span>
          <span>都吉欣</span>
          <span>来访时间：<span>18/02/22</span></span>
        </div>
        <div class="right">
          <i class="iconfont icon-phone"></i>
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
    padding: 0.8rem 1rem;
    .head-wrap {
      position: relative;
      .left {}
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
