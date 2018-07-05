<template>
  <div class="page-me">
    <div class="user-header-wrap">
      <span class="user-head" :style="userInfo.userHead ? { 'background-image': `url(${userInfo.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></span>
      <span class="user-name">{{userInfo.userName}}</span>
      <div class="user-level-wrap">
        <span></span>
        <i class="star" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
      </div>
      <i class="user-footer"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Me',
  data () {
    return {
      defaultUserHead: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1060129963,1724829206&fm=27&gp=0.jpg',
      userInfo: {},
      starCount: 5
    }
  },
  mounted () {
    this.$set(this.userInfo, 'userHead', '')
    this.$set(this.userInfo, 'userName', '刘德华')
    document.querySelector('#app-footer').style.display = 'flex'
  }
}
</script>

<style lang="scss" scoped>
.user-header-wrap {
  position: relative;
  background-color: #0F4E97;
  padding: 0.8rem 0;
  height: 16rem;
  overflow: hidden;
  .user-head {
    position: relative;
    display: block;
    width: 5.4rem;
    height: 5.4rem;
    border-radius: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: 2.4rem;
    border: 2px solid #f0f0f0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    z-index: 9;
  }
  .user-name {
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-top: 1.6rem;
    color: #ffffff;
    font-size: 1.2rem;
    z-index: 9;
  }
  .user-level-wrap {
    position: relative;
    z-index: 9;
  }
  i.user-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 80vw;
    height: 20rem;
    margin: 0 auto;
    background-image: url('./../assets/user-info-d.jpg');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 100% auto;
  }
}
</style>
