import Vue from 'vue'
import Loading from './loading.vue'

Loading.installLoading = function (options) {
  var LoadingComment = Vue.extend(Loading)
  var comment = new LoadingComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}
Loading.closeLoading = function () {
  if (document.getElementById('dialog-loading-wrap')) {
    document.getElementById('dialog-loading-wrap').style.opacity = 0
    setTimeout(() => {
      if (document.getElementById('dialog-loading-wrap')) {
        document.querySelector('body').removeChild(document.getElementById('dialog-loading-wrap'))
      }
    }, 305)
  }
}
Loading.loadingProgressUpdate = function (progress) {
  if (document.getElementById('dialog-loading-wrap')) {
    var totleWidth = document.getElementById('loading-progress-wrap').clientWidth
    document.getElementById('loading-progress-current').style.width = `${totleWidth * progress}px`
  }
}

export default Loading
