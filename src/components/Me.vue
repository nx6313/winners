<template>
  <div class="page-me">
    <div class="user-header-wrap">
      <span class="user-head" :style="userInfo.userHead ? { 'background-image': `url(${userInfo.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></span>
      <span class="user-name">{{userInfo.userName}}</span>
      <div class="user-level-wrap">
        <span>等级</span>
        <div class="star-wrap">
          <i :class="['star', starIndex < userLevel ? 'has-star' : '']" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
        </div>
      </div>
      <i class="user-footer"></i>
    </div>
    <div class="user-info-item-wrap">
      <div class="user-info-item" v-for="(userInfo, userInfoIndex) in userInfos" :key="userInfoIndex">
        <span class="title">{{userInfo.title}}</span>
        <span class="content">{{userInfo.content}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Me',
  data () {
    return {
      starCount: 5,
      defaultUserHead: '',
      userInfo: {},
      userLevel: 3,
      userInfos: []
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.defaultUserHead = this.$moment.defaultHead
    this.$set(this.userInfo, 'userHead', '')
    this.$set(this.userInfo, 'userName', this.$moment.userInfo.user.name)
    this.userInfos = [
      {
        title: '公司',
        content: this.$moment.userInfo.user.companyName || '未设置'
      },
      {
        title: '职务',
        content: this.$moment.userInfo.user.dutyName || '未设置'
      },
      {
        title: '电话',
        content: this.$moment.userInfo.user.phone || '未设置'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.page-me {
  background-color: #f0f0f0;
}
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
    background-size: auto 100%;
    z-index: 9;
  }
  .user-head::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 1.2rem;
    height: 1.2rem;
    background-image: url('./../assets/user-info-write.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
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
    text-align: center;
    margin-top: 1.2rem;
    span {
      font-size: 0.8rem;
      color: #ffffff;
    }
    .star-wrap {
      position: relative;
      display: inline-block;
      margin-left: 1rem;
      vertical-align: middle;
      i.star {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 1.2rem;
        height: 1.2rem;
        background-image: url('./../assets/star-2.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
      }
      i.star:nth-of-type(n + 2) {
        margin-left: 0.3rem;
      }
      i.has-star {
        background-image: url('./../assets/star-1.png');
      }
    }
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
.user-info-item-wrap {
  position: relative;
  .user-info-item {
    position: relative;
    padding: 1.2rem 0.8rem;
    background-color: #ffffff;
    font-size: 0.8rem;
    .title {
      position: relative;
      display: inline-block;
      width: 3.2rem;
      color: #6d6d6d;
    }
    .content {
      position: relative;
    }
  }
  .user-info-item:nth-of-type(n + 2)::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    border-top: 1px solid #f8f8f8;
  }
}
</style>
