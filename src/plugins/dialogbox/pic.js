import Vue from 'vue'
import Pic from './pic.vue'

Pic.installPic = function (options) {
  var PicComment = Vue.extend(Pic)
  var comment = new PicComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Pic
