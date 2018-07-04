import CvsFire from './fire.js'

export default {
  install: function (Vue, options) {
    Vue.component(CvsFire.name, CvsFire)

    Vue.prototype.$cvs_fire = CvsFire.installFire
    Vue.prototype.$cvs_fire_remove = CvsFire.removeFire
  }
}
