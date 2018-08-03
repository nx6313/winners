<template>
  <div class="page-advance">
    <div class="star-wrap">
      <div class="star-light-bg"></div>
      <div class="star-light"></div>
      <transition name="fade" mode="out-in">
        <div v-if="showStarDisplay" class="star-show" :style="userLevel ? (userLevel.level <= curMoveToLevelIndex ? { 'background-image': `url(${levels[curMoveToLevelIndex].iconNo})` } : { 'background-image': `url(${levels[curMoveToLevelIndex].icon})` }) : {}"></div>
      </transition>
      <div class="user-empirical"><span>{{userEmpiricalVal}}</span>经验值</div>
    </div>
    <div class="empirical-wrap" ref="empirical-wrap" :style="{ 'width': `${getEmpiricalWrapWidth()}px` }">
      <div class="empirical-cur" :style="{ 'width': `${getUserCurEmpiricalWidth()}px` }"></div>
      <span class="level-point" v-for="(level, levelIndex) in levels" :key="levelIndex" :style="[{ 'width': `${levelIconWidth}rem`, 'height': `${levelIconWidth}rem`, 'top': `calc(-${levelIconWidth / 2}rem + 2px)`, 'left': `${getLevelPointLeft(level.getEmpiricalVal, levelIndex)}px` }, level.getEmpiricalVal <= userEmpiricalVal ? { 'background-image': `url(${require('@/assets/lv.png')})` } : {}]">
        <i>{{level.txt}}</i>
      </span>
    </div>
    <div class="level-content-wrap">
      <div class="level-rail-wrap" ref="level-rail-wrap" :style="userLevel ? { 'transform': `translateX(calc((3rem - 100vw - 0.8rem) * ${userLevel.level - 1}))` } : {}" @touchstart="levelTouchStart" @touchmove="levelTouchMove" @touchend="levelTouchEnd">
        <div :class="['level-content-panel', userLevel.level - 1 === levelIndex ? 'cur-panel' : '', userLevel.level - 1 > levelIndex ? 'get-panel' : '']" v-for="(level, levelIndex) in levels" :key="levelIndex" :style="{ 'left': `calc(1.5rem + (100vw - 3rem + 0.8rem) * ${levelIndex})` }">
          <div class="level-scroll-content">
            <div class="header flex-r flex-b">
              <div>
                <span>10000 成长值</span>
                <span>260 名同事已达到</span>
              </div>
              <div>升级报告</div>
            </div>
            <img class="content-img" :src="require('@/assets/temp-1.png')">
          </div>
          <div class="level-footer" v-if="userLevel.level - 1 >= levelIndex">-2017/02/05达到该等级-</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppAdvance',
  data () {
    return {
      showStarDisplay: false,
      levelTouchStartX: -1,
      levelMoveDistance: -1,
      curMoveToLevelIndex: -1,
      levels: [
        {
          level: 1,
          txt: 'LV.1',
          getEmpiricalVal: 100,
          icon: require('@/assets/1.png'),
          iconNo: require('@/assets/1-1.png')
        },
        {
          level: 2,
          txt: 'LV.2',
          getEmpiricalVal: 300,
          icon: require('@/assets/2.png'),
          iconNo: require('@/assets/2-2.png')
        },
        {
          level: 3,
          txt: 'LV.3',
          getEmpiricalVal: 600,
          icon: require('@/assets/3.png'),
          iconNo: require('@/assets/3-3.png')
        },
        {
          level: 4,
          txt: 'LV.4',
          getEmpiricalVal: 1000,
          icon: require('@/assets/4.png'),
          iconNo: require('@/assets/4-4.png')
        },
        {
          level: 5,
          txt: 'LV.5',
          getEmpiricalVal: 1500,
          icon: require('@/assets/5.png'),
          iconNo: require('@/assets/5-5.png')
        },
        {
          level: 6,
          txt: 'LV.6',
          getEmpiricalVal: 2100,
          icon: require('@/assets/6.png'),
          iconNo: require('@/assets/6-6.png')
        },
        {
          level: 7,
          txt: 'LV.7',
          getEmpiricalVal: 2800,
          icon: require('@/assets/7.png'),
          iconNo: require('@/assets/7-7.png')
        },
        {
          level: 8,
          txt: 'LV.8',
          getEmpiricalVal: 3000,
          icon: require('@/assets/8.png'),
          iconNo: require('@/assets/8-8.png')
        },
        {
          level: 9,
          txt: 'LV.9',
          getEmpiricalVal: 3400,
          icon: require('@/assets/9.png'),
          iconNo: require('@/assets/9-9.png')
        },
        {
          level: 10,
          txt: 'LV.10',
          getEmpiricalVal: 3800,
          icon: require('@/assets/10.png'),
          iconNo: require('@/assets/10-10.png')
        }
      ],
      maxEmpiricalVal: 4000,
      scal: 0.4,
      levelIconWidth: 1.8, // rem
      userLevel: null,
      userEmpiricalVal: 400
    }
  },
  mounted () {
    this.getUserLevel()
  },
  methods: {
    getUserLevel () {
      var userLevelData = null
      for (let index in this.levels) {
        if (this.userEmpiricalVal >= this.levels[index].getEmpiricalVal) {
          userLevelData = this.levels[index]
        }
      }
      this.userLevel = userLevelData
      this.curMoveToLevelIndex = this.userLevel.level - 1
      this.showStarDisplay = true
    },
    getEmpiricalWrapWidth () {
      var totalWidth = this.maxEmpiricalVal * this.scal + this.levels.length * this.levelIconWidth * 16 + 200
      return totalWidth
    },
    getUserCurEmpiricalWidth () {
      if (this.userLevel === null) {
        this.getUserLevel()
      }
      return this.scal * this.userEmpiricalVal + this.userLevel.level * this.levelIconWidth * 16
    },
    getLevelPointLeft (targetEmpirical, levelIndex) {
      return this.scal * targetEmpirical + levelIndex * this.levelIconWidth * 16
    },
    levelTouchStart () {
      this.$refs['level-rail-wrap'].style['transition-duration'] = '0s'
      this.levelTouchStartX = event.touches[0].pageX
    },
    levelTouchMove () {
      if (this.levelTouchStartX < 0) {
        this.levelTouchStartX = event.touches[0].pageX
      }
      this.levelMoveDistance = (event.touches[0].pageX - this.levelTouchStartX) * 0.2
      this.$refs['level-rail-wrap'].style.transform = `translateX(calc((3rem - 100vw - 0.8rem) * ${this.curMoveToLevelIndex} + ${this.levelMoveDistance}px))`
    },
    levelTouchEnd () {
      this.$refs['level-rail-wrap'].style['transition-duration'] = '0.3s'
      if (Math.abs(this.levelMoveDistance) > document.body.clientWidth * 1 / 16) {
        this.showStarDisplay = false
        if (this.levelMoveDistance > 0) {
          this.curMoveToLevelIndex -= 1
        } else {
          this.curMoveToLevelIndex += 1
        }
        if (this.curMoveToLevelIndex < 0) {
          this.showStarDisplay = true
          this.curMoveToLevelIndex = 0
        }
        if (this.curMoveToLevelIndex > this.levels.length - 1) {
          this.showStarDisplay = true
          this.curMoveToLevelIndex = this.levels.length - 1
        }
        setTimeout(() => {
          this.showStarDisplay = true
        }, 0)
      }
      this.$refs['level-rail-wrap'].style.transform = `translateX(calc((3rem - 100vw - 0.8rem) * ${this.curMoveToLevelIndex}))`
      var empiricalWrapTsX = (document.body.clientWidth / 2) - (this.scal * this.levels[this.curMoveToLevelIndex].getEmpiricalVal + this.curMoveToLevelIndex * this.levelIconWidth * 16) - this.levelIconWidth * 16 / 2
      if (empiricalWrapTsX > 0) {
        empiricalWrapTsX = 0
      }
      this.$refs['empirical-wrap'].style.transform = `translateX(calc(${empiricalWrapTsX}px))`
    }
  }
}
</script>

<style lang="scss" scoped>
.page-advance {
  position: relative;
  height: 100vh;
  background-color: #0B488F;
  overflow: hidden;
  .star-wrap {
    position: relative;
    height: 16rem;
    text-align: center;
    .star-light-bg {
      position: absolute;
      display: inline-block;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      top: -3rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      background: radial-gradient(#2268bb, #0B488F, #0B488F);
    }
    .star-light {
      position: absolute;
      display: inline-block;
      width: 22rem;
      height: 22rem;
      top: -3rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      background-image: url('./../../assets/light.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      transform-origin: 50% 50%;
      animation: spin 100s infinite linear;
    }
    .star-show {
      position: relative;
      display: inline-block;
      width: 6.4rem;
      height: 6.4rem;
      top: 4.6rem;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    .user-empirical {
      position: absolute;
      display: inline-block;
      left: 0;
      width: 100%;
      top: 12.4rem;
      text-align: center;
      font-size: 0.8rem;
      color: #ffffff;
      span {
        position: relative;
        font-size: 0.9rem;
        margin-right: 0.2rem;
      }
    }
  }
  .empirical-wrap {
    position: relative;
    width: 200vw;
    height: 4px;
    background-color: #b0b9c3;
    transition: all 0.3s ease 0s;
    .empirical-cur {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 30vw;
      z-index: 8;
      background-color: #feb13e;
    }
    .empirical-cur::after {
      content: '';
      position: absolute;
      display: inline-block;
      top: -3px;
      right: -5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      z-index: 7;
      background-color: #feb13e;
    }
    .level-point {
      position: absolute;
      display: inline-block;
      z-index: 9;
      background-image: url('./../../assets/lv-no.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      i {
        position: relative;
        display: inline-block;
        width: 100%;
        text-align: center;
        top: 2rem;
        font-style: normal;
        font-size: 0.7rem;
        color: #ffffff;
      }
    }
  }
  .level-content-wrap {
    position: relative;
    margin-top: 4rem;
    .level-rail-wrap {
      position: relative;
      transition: all 0.3s ease 0s;
      transform: translateX(calc((3rem - 100vw - 0.8rem) * 0));
      .level-content-panel {
        position: absolute;
        background-color: #dbefff;
        width: calc(100vw - 3rem);
        top: 0;
        left: 1.5rem;
        height: calc(100vh - 18rem);
        border-radius: 8px;
        .level-scroll-content {
          position: relative;
          height: calc(100% - 5rem);
          overflow-x: hidden;
          overflow-y: auto;
          .header {
            position: relative;
            padding: 0.8rem 1.4rem;
            div {
              span {
                position: relative;
                display: block;
              }
            }
            div:nth-of-type(1) {
              text-align: left;
              span:nth-of-type(1) {
                color: rgb(4, 167, 77);
                font-size: 1rem;
              }
              span:nth-of-type(2) {
                color: rgb(56, 56, 56);
                font-size: 0.8rem;
                margin-top: 0.6rem;
              }
            }
            div:nth-of-type(2) {
              color: #ffffff;
              background-color: rgb(0, 190, 117);
              font-size: 0.8rem;
              padding: 0.4rem 0.6rem 0.22rem;
              border-radius: 10rem;
            }
          }
          .header::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            border-bottom: 1px solid #f1f1f1;
          }
          .content-img {
            position: relative;
            width: calc(100% - 0.8rem);
            padding: 0 0.4rem;
          }
        }
        .level-footer {
          position: absolute;
          width: 100%;
          text-align: center;
          bottom: 3.2rem;
          font-size: 0.6rem;
          color: rgb(143, 143, 143);
        }
      }
      .get-panel {
        background-color: #ffffff;
      }
      .cur-panel {
        background-color: #ffffff;
      }
      .cur-panel::before {
        content: '';
        position: absolute;
        top: -0.4rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 2rem;
        height: 2rem;
        transform: rotate(45deg);
        background-color: #ffffff;
      }
    }
  }
}

.fade-enter-active {
  transition: all .4s ease;
}
.fade-leave-active {
  transition: all .4s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(2px);
  opacity: 0;
}
</style>
