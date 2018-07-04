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
      menus: [
        {
          txt: '我的业绩',
          path: '/home',
          icon_normal: 'icon-lhb',
          icon_select: 'icon-lhb1'
        },
        {
          txt: '龙虎榜',
          path: '/sale-list',
          icon_normal: 'icon-wdyj',
          icon_select: 'icon-wdyj1'
        },
        {
          txt: '我的',
          path: '/sale-list',
          icon_normal: 'icon-wdyj',
          icon_select: 'icon-wdyj1'
        }
      ]
    }
  },
  mounted () {
    // 恢复刷新引起的指示器错位
    var curRouterPath = this.$router.currentRoute.path
    if (curRouterPath.indexOf('/home') === 0) {
      this.curMenuIndex = 0
    } else if (curRouterPath.indexOf('/sale-list') === 0) {
      this.curMenuIndex = 1
    }
  },
  methods: {
    toPage (path, menuIndex) {
      this.curMenuIndex = menuIndex
      this.$router.replace(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-footer {
  position: fixed;
  width: 100%;
  height: 3.6rem;
  line-height: 3.6rem;
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
    font-size: 0.8rem;
    color: #8C8C8C;
    i {
      position: relative;
      display: inline-block;
      top: -0.4rem;
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1.5rem;
      pointer-events: none;
    }
    span {
      position: relative;
      display: block;
      top: -2.3rem;
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
  border-top: 1px solid #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
