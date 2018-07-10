<template>
  <div v-if="isShow" id="dialog-msg-wrap" class="dialog-msg-wrap">
    <div class="msg-shade animated fadeIn" @click="closeMsg"></div>
    <div class="msg-content animated fadeIn" ref="msg-content">
      <div>{{msg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-msg',
  data () {
    return {
      isShow: true,
      shadeClose: true,
      duration: 2200,
      autoCloseTimer: null,
      msg: ''
    }
  },
  beforeMount () {
    clearTimeout(this.autoCloseTimer)
    let dialogMsg = document.querySelector('#dialog-msg-wrap')
    if (dialogMsg && dialogMsg.parentNode) {
      dialogMsg.parentNode.removeChild(dialogMsg)
    }
  },
  mounted () {
    this.autoCloseTimer = setTimeout(() => {
      this.isShow = false
    }, this.duration)
  },
  methods: {
    closeMsg () {
      if (this.shadeClose) {
        clearTimeout(this.autoCloseTimer)
        this.isShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.msg-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.msg-content {
  position: fixed;
  top: calc((100% - 2rem) / 2);
  width: 100%;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 999999;
  div {
    position: relative;
    display: inline-block;
    background-color: #474747;
    color: #ffffff;
    border-radius: 3px;
    padding: 0 0.8rem;
  }
}
</style>
