import DialogMsg from './msg.js'
import DialogLoading from './loading.js'
import DialogPic from './pic.js'

export default {
  install: function (Vue, options) {
    Vue.component(DialogMsg.name, DialogMsg)
    Vue.component(DialogLoading.name, DialogLoading)
    Vue.component(DialogPic.name, DialogPic)

    Vue.prototype.$dialog_msg = DialogMsg.installMsg
    Vue.prototype.$dialog_loading = DialogLoading.installLoading
    Vue.prototype.$dialog_close_loading = DialogLoading.closeLoading
    Vue.prototype.$dialog_loading_progress_update = DialogLoading.loadingProgressUpdate
    Vue.prototype.$dialog_pic = DialogPic.installPic
  }
}
