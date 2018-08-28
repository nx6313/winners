<template>
  <div class="page-badge">
    <div class="header">
      <i class="user-head" :style="userHead ? { 'background-image': `url(${userHead})` } : { 'background-image': `url(${require('@/assets/default-head.png')})` }"></i>
      <span class="head-tip"><i class="iconfont icon-xunzhang"></i>188 枚徽章</span>
    </div>
    <div class="select-tab-wrap flex-r flex-b">
      <span class="tab-item cur">已获得勋章</span>
      <span class="tab-item">未获得勋章</span>
    </div>
    <div class="badge-wrap">
      <div class="tab-1">
        <div class="badge-item" v-for="(badge, badgeIndex) in getBadges" :key="badgeIndex" :style="{ 'width': `calc(100% / 3)` }">
          <i :style="{ 'background-image': `url(${badge.icon})` }"></i>
          <span class="name">{{badge.name}}</span>
          <span class="time">{{badge.time}}</span>
        </div>
      </div>
      <div class="tab-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppBadge',
  data () {
    return {
      userHead: '',
      getBadges: [
        {
          icon: require('@/assets/wz-jy.png'),
          name: '销售新锐徽章',
          time: '2018/07/05'
        },
        {
          icon: require('@/assets/wz-kl.png'),
          name: '销售精英徽章',
          time: '2018/07/05'
        },
        {
          icon: require('@/assets/wz-p.png'),
          name: '销售王者徽章',
          time: '2018/07/05'
        },
        {
          icon: require('@/assets/wz-v.png'),
          name: '二手车小白',
          time: '2018/07/05'
        },
        {
          icon: require('@/assets/wz-x.png'),
          name: '二手车新锐',
          time: '2018/07/05'
        },
        {
          icon: require('@/assets/wz-xr.png'),
          name: '二手车王者',
          time: '2018/07/05'
        }
      ]
    }
  },
  mounted () {
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      this.initPageData()
    })
    this.initPageData()
  },
  methods: {
    initPageData () {
      if (this.$moment.userInfo.user && this.$moment.userInfo.user.photo !== null) {
        this.userHead = this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-badge {
  position: relative;
  height: 100vh;
  background-color: #ffffff;
  .header {
    position: relative;
    text-align: center;
    padding: 5.4rem 0 3rem;
    background-image: url('./../../assets/badge-bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .user-head {
      position: relative;
      display: block;
      width: 4rem;
      height: 4rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      margin-bottom: 1.4rem;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 1px solid #ffffff;
    }
    .head-tip {
      position: relative;
      display: inline-block;
      background-color: #0F78F2;
      color: #ffffff;
      padding: 0.2rem 0.6rem;
      font-size: 0.6rem;
      border-radius: 4rem;
      transform: scale(0.9, 0.9);
      i {
        font-size: 0.6rem;
        margin-right: 0.4rem;
        color: #FFB600;
      }
    }
  }
  .select-tab-wrap {
    position: relative;
    font-size: 0;
    span {
      position: relative;
      display: inline-block;
      font-size: 0.8rem;
      width: 50%;
      text-align: center;
      padding: 0.9rem 0;
    }
    .cur::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 3.4rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      border-bottom: 4px solid #007CC7;
    }
  }
  .select-tab-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #f3f3f3;
  }
  .badge-wrap {
    position: relative;
    div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      font-size: 0;
      .badge-item {
        position: relative;
        display: inline-block;
        text-align: center;
        margin-top: 1.4rem;
        margin-bottom: 1.2rem;
        i {
          position: relative;
          display: inline-block;
          width: 4.2rem;
          height: 4.2rem;
          margin-bottom: 0.4rem;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
        .name {
          position: relative;
          display: block;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          color: rgb(54, 54, 54);
        }
        .time {
          position: relative;
          display: block;
          width: 100%;
          text-align: center;
          font-size: 0.6rem;
          margin-top: 0.4rem;
          color: rgb(145, 145, 145);
        }
      }
    }
  }
}
</style>
