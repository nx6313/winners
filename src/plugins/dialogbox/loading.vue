<template>
  <div v-if="isShow" id="dialog-loading-wrap" class="dialog-loading-wrap">
    <div class="loading-shade animated fadeIn" @click="closeLoading"></div>
    <div class="loading-content animated fadeIn">
      <div class="loadster" :style="{ 'transform': 'scale(' + scale + ', ' + scale + ')' }">
        <div class="loadster__body">
          <div class="body__gum"></div>
        </div>
        <div class="loadster__mask"></div>
        <div class="loadster__head">
          <div class="head__face"></div>
          <div class="head__ear"></div>
          <div class="head__eye"></div>
          <div class="head__horn">
            <div class="horn__circle"></div>
          </div>
          <div class="head__smile"></div>
          <div class="head__hand"></div>
        </div>
        <div class="loadster__bottom">
          <div class="bottom__foot"></div>
        </div>
      </div>
      <span :class="['loading-tip', progress ? 'isProgress' : '']">{{tip}}</span>
      <div id="loading-progress-wrap" class="loading-progress-wrap" ref="loading-progress-wrap">
        <div id="loading-progress-current" class="loading-progress-current" ref="loading-progress-current"></div>
        <div class="loading-progress-animate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import './loading.css'

export default {
  name: 'dialog-confirm',
  data () {
    return {
      isShow: true,
      shadeClose: false,
      scale: 0.16,
      tip: '数据加载中...',
      progress: false,
      update: () => {}
    }
  },
  beforeMount () {
    let dialogLoading = document.querySelector('#dialog-loading-wrap')
    if (dialogLoading && dialogLoading.parentNode) {
      dialogLoading.parentNode.removeChild(dialogLoading)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.progress) {
        this.update(this.updateProgress)
      }
    })
  },
  methods: {
    closeLoading () {
      if (this.shadeClose) {
        this.isShow = false
      }
    },
    updateProgress (progress) {
      var totleWidth = this.$refs['loading-progress-wrap'].clientWidth
      this.$refs['loading-progress-current'].style.width = `${totleWidth * progress}px`
    }
  }
}
</script>

<style lang="scss" scoped>
#dialog-loading-wrap {
  position: relative;
  transition: all 0.3s ease 0s;
}

.loading-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(31, 31, 31, 0.3);
  z-index: 999999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.loading-content {
  position: fixed;
  top: calc((100% - 6rem) / 2);
  left: calc((100% - 20rem) / 2);
  width: 20rem;
  height: 6rem;
  background-color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 3px;
  z-index: 9999999;
  box-shadow: 0 0 10px 0px rgba(143, 143, 143, 0.3);
}

.loading-content > div.loadster {
  top: 1.4rem;
  left: 1.2rem;
}

.loading-content > span.loading-tip {
  position: absolute;
  display: inline-block;
  top: 2.4rem;
  left: 6rem;
}

.loading-content > span.isProgress {
  position: absolute;
  display: inline-block;
  top: 1.8rem;
  left: 6rem;
}

.loading-content > div.loading-progress-wrap {
  position: absolute;
  display: inline-block;
  top: 3.6rem;
  left: 6rem;
  width: calc(100% - 6rem - 1rem);
  height: 6px;
  border-radius: 10rem;
  font-size: 0px;
  background-color: rgba(243, 239, 251, .8);
  overflow: hidden;
  div.loading-progress-current {
    position: relative;
    height: 100%;
    width: 0px;
    background: linear-gradient(to left, #583D9B, #1499CA, #5E3D9B);
    transition: width 0.3s ease 0s;
    overflow: hidden;
  }
  div.loading-progress-animate {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, .4), rgba(243, 239, 251, .6), rgba(243, 239, 251, .8), rgba(243, 239, 251, .6), rgba(243, 239, 251, .4), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0), rgba(243, 239, 251, 0));
    animation: moveflash 4s ease 0s infinite;
  }
}

@keyframes moveflash {
  0% {
    transform: translateX(-68%);
  }
  100% {
    transform: translateX(68%);
  }
}
</style>
