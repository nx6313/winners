<template>
  <div class="app-no-page">
    <div class="working-wrap">
      <img class="img" :src="working">
      <span class="tip">程序猿正在努力开发中...</span>
    </div>
    <div class="img-1"></div>
  </div>
</template>

<script>
export default {
  name: 'AppNoPage',
  data () {
    var workingImg = require('@/assets/working.gif')
    return {
      working: workingImg
    }
  }
}
</script>

<style lang="scss" scoped>
.app-no-page {
  position: relative;
  height: 100vh;
  background-color: #3D84A8;
  .working-wrap {
    position: absolute;
    width: 100%;
    top: 27vh;
    text-align: center;
    .img {
      position: relative;
      width: 40vw;
    }
    .tip {
      position: relative;
      display: block;
      font-size: 0.8rem;
      color: #ffffff;
      margin-bottom: 0.2rem;
    }
  }
  .img-1 {
    position: absolute;
    width: 100vw;
    height: 30vh;
    left: 0;
    bottom: 0;
    background-image: url('./../../assets/working-2.gif');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
}
</style>
