<template>
  <div class="home-manager-list">
    <div class="item-wrap" v-for="(item, itemIndex) in items" :key="itemIndex" @click="toPage(item.route)">
      <div class="head-icon-wrap">
        <span v-html="item.pre" :class="item.pre.length <= 2 ? 'short' : ''"></span>
      </div>
      <div class="des">
          <span>{{item.title}}</span>
          <span>{{item.des}}</span>
      </div>
      <i class="item-arrow"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeManagerList',
  data () {
    return {
      items: []
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sale_after) {
      this.items = [
        {
          pre: '机电顾问',
          title: '机电顾问智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        },
        {
          pre: '事故顾问',
          title: '事故顾问智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        },
        {
          pre: '机修班组',
          title: '机修班组智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        }
      ]
    } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sale_all) {
      this.items = [
        {
          pre: '售前',
          title: '售前智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售前',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        },
        {
          pre: '机电<br>顾问',
          title: '机电顾问智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        },
        {
          pre: '事故<br>顾问',
          title: '事故顾问智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        },
        {
          pre: '机修<br>班组',
          title: '机修班组智能决策',
          des: this.$moment.userInfo.user.companyName + ' 售后',
          route: '/home-manager/' + this.$moment.userInfo.user.scope
        }
      ]
    }
  },
  methods: {
    toPage (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-manager-list {
  position: relative;
  background-color: #F5F5F5;
  .item-wrap {
    position: relative;
    padding: 0.6rem 0.8rem;
    background-color: rgb(255, 255, 255);
    .head-icon-wrap {
      position: relative;
      display: inline-block;
      width: 3rem;
      height: 3rem;
      text-align: center;
      background-color: #139BEB;
      border-radius: 50%;
      overflow: hidden;
      pointer-events: none;
      span {
        position: absolute;
        display: inline-block;
        font-size: 0.6rem;
        color: #ffffff;
        height: 1.8rem;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .short {
        height: 0.9rem;
      }
    }
    .des {
      position: absolute;
      top: 1.2rem;
      left: 4.6rem;
      bottom: 1.2rem;
      pointer-events: none;
      span {
        position: relative;
        display: block;
      }
      span:nth-of-type(1) {
        font-size: 0.8rem;
        color: #383838;
      }
      span:nth-of-type(2) {
        font-size: 0.6rem;
        margin-top: 0.4rem;
        color: #6e6e6e;
      }
    }
    .item-arrow {
      position: absolute;
      display: inline-block;
      top: 0;
      right: 0.8rem;
      bottom: 0;
      width: 1.6rem;
      pointer-events: none;
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;
      background-image: url('./../assets/item-arrow.png');
    }
  }
  .item-wrap:nth-of-type(n + 2)::before {
    content: '';
    position: absolute;
    left: 1rem;
    right: 1rem;
    top: -0.2rem;
    border-top: 1px solid #f5f5f5;
  }
}
</style>
