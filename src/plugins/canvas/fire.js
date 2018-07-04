import Vue from 'vue'
import Fire from './fire.vue'

Fire.installFire = function (options) {
  var FireComment = Vue.extend(Fire)
  var comment = new FireComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}
Fire.removeFire = function (options) {
  var fireElem = document.querySelector('#cvs-fire-wrap')
  if (fireElem) {
    document.querySelector('body').removeChild(fireElem)
  }
}

export default Fire
