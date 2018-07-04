import DialogMsg from './msg.js'
import DialogLoading from './loading.js'

export default {
  install: function (Vue, options) {
    Vue.component(DialogMsg.name, DialogMsg)
    Vue.component(DialogLoading.name, DialogLoading)

    Vue.prototype.$dialog_msg = DialogMsg.installMsg
    Vue.prototype.$dialog_loading = DialogLoading.installLoading
    Vue.prototype.$dialog_close_loading = DialogLoading.closeLoading
  }
}
