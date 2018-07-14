<template>
  <div id="app-footer" class="app-footer flex-r flex-a">
    <div class="menu-item-wrap" v-for="(menu, menuIndex) in menus" :key="menuIndex" :style="{ 'width': `calc((100% - 4rem) / ${menus.length})` }" :class="curMenuIndex === menuIndex ? 'cur-menu' : ''" @click="toPage(menu.path, menuIndex)">
      <i :class="['iconfont', menu.icon_normal]" v-if="curMenuIndex !== menuIndex"></i>
      <i :class="['iconfont', menu.icon_select]" v-if="curMenuIndex === menuIndex"></i>
      <span>{{menu.txt}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      curMenuIndex: 0,
      menus: []
    }
  },
  mounted () {
    this.$root.eventHub.$on('init-menu', () => {
      if (this.menus.length === 0) {
        this.initMenu()
      }
    })
    this.$root.eventHub.$on('clear-menu', () => {
      this.menus.splice(0, this.menus.length)
    })
    this.$root.eventHub.$on('ref-menu', () => {
      this.resetMenuIndicator()
    })
  },
  methods: {
    toPage (path, menuIndex) {
      this.curMenuIndex = menuIndex
      this.$router.replace(path)
    },
    initMenu () {
      if (Number(this.$moment.userInfo.user.grade) === 1) { // 个人
        this.menus = [
          {
            txt: '我的业绩',
            path: '/home',
            icon_normal: 'icon-gryj1',
            icon_select: 'icon-gryj'
          },
          {
            txt: '龙虎榜',
            path: '/sale-list',
            icon_normal: 'icon-lhb',
            icon_select: 'icon-lhb1'
          },
          {
            txt: '我的',
            path: '/me',
            icon_normal: 'icon-wdyj',
            icon_select: 'icon-wdyj1'
          }
        ]
      } else if (Number(this.$moment.userInfo.user.grade) === 2) { // 公司
        this.menus = [
          {
            txt: '智能决策',
            path: '/home-manager',
            icon_normal: 'icon-znjc1',
            icon_select: 'icon-znjc'
          },
          {
            txt: '销售业绩',
            path: '/sale-performance',
            icon_normal: 'icon-gryj1',
            icon_select: 'icon-gryj'
          },
          {
            txt: '龙虎榜',
            path: '/sale-list',
            icon_normal: 'icon-lhb',
            icon_select: 'icon-lhb1'
          }
        ]
      } else if (Number(this.$moment.userInfo.user.grade) === 3) { // 集团
        this.menus = [
          {
            txt: '智能决策',
            path: '/home-boss',
            icon_normal: 'icon-znjc1',
            icon_select: 'icon-znjc'
          },
          {
            txt: '公司业绩',
            path: '/company-performance',
            icon_normal: 'icon-gryj1',
            icon_select: 'icon-gryj'
          },
          {
            txt: '龙虎榜',
            path: '/sale-list',
            icon_normal: 'icon-lhb',
            icon_select: 'icon-lhb1'
          },
          {
            txt: '通讯录',
            path: '/user-list',
            icon_normal: 'icon-txl',
            icon_select: 'icon-txl1'
          }
        ]
      }
    },
    resetMenuIndicator () {
      var curRouterPath = this.$router.currentRoute.path
      if (Number(this.$moment.userInfo.user.grade) === 1) { // 个人
        if (curRouterPath.indexOf('/home') === 0) {
          this.curMenuIndex = 0
        } else if (curRouterPath.indexOf('/sale-list') === 0) {
          this.curMenuIndex = 1
        } else if (curRouterPath.indexOf('/me') === 0) {
          this.curMenuIndex = 2
        }
      } else if (Number(this.$moment.userInfo.user.grade) === 2) { // 公司
        if (curRouterPath.indexOf('/home-manager') === 0) {
          this.curMenuIndex = 0
        } else if (curRouterPath.indexOf('/sale-performance') === 0) {
          this.curMenuIndex = 1
        } else if (curRouterPath.indexOf('/sale-list') === 0) {
          this.curMenuIndex = 2
        }
      } else if (Number(this.$moment.userInfo.user.grade) === 3) { // 集团
        if (curRouterPath.indexOf('/home-boss') === 0) {
          this.curMenuIndex = 0
        } else if (curRouterPath.indexOf('/company-performance') === 0) {
          this.curMenuIndex = 1
        } else if (curRouterPath.indexOf('/sale-list') === 0) {
          this.curMenuIndex = 2
        } else if (curRouterPath.indexOf('/user-list') === 0) {
          this.curMenuIndex = 3
        } else if (curRouterPath.indexOf('/sell-data') === 0) {
          this.curMenuIndex = 3
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-footer {
  position: fixed;
  width: 100%;
  height: 3.2rem;
  line-height: 3.2rem;
  bottom: 0;
  background-color: #ffffff;
  z-index: 999999;
  display: none;
  .menu-item-wrap {
    position: relative;
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    font-size: 0.7rem;
    color: #8C8C8C;
    i {
      position: relative;
      display: inline-block;
      top: -0.44rem;
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1.5rem;
      pointer-events: none;
    }
    span {
      position: relative;
      display: block;
      top: -2.4rem;
      pointer-events: none;
    }
  }
  .cur-menu {
    color: #0D3C6E;
  }
}

.app-footer::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  border-top: 0.06rem solid rgba(0, 0, 0, 0.08);
}
</style>
