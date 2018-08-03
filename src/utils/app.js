const android = window.android
const ios = window.webkit

window['saveUserInfo'] = (userInfo) => {
  window.app.$moment.userInfo = userInfo
  window.app.$moment.userInfo.loginDate = new Date(window.app.$moment.userInfo.loginDate)
  window.app.$moment.userInfo.basedate = new Date(window.app.$moment.userInfo.basedate)
  if (!window.app.$moment.userInfo.user.photo) {
    window.app.$moment.userInfo.user.photo = null
  }
  window.app.$root.eventHub.$emit('app-has-save-user-info')
}

window['androidEvent'] = (event, params) => {
  window.app.$root.eventHub.$emit(event, params)
}

export default {
  install: function (Vue, options) {
    Vue.prototype.$android = android
    Vue.prototype.$ios = ios

    Vue.prototype.$setTimeOut = (eventName, duration) => {
      if (window.deviceType === 'android') {
        if (android) {
          android.setTimeOut(eventName, duration)
        }
      } else if (window.deviceType === 'ios') {
        if (ios) {
          ios.messageHandlers.setTimeOut.postMessage(eventName, duration)
        }
      }
    }

    Vue.prototype.$call = (eventName, params) => {
      if (window.deviceType === 'android') {
        if (android) {
          android.callAndroid(eventName, params)
        }
      } else if (window.deviceType === 'ios') {
        if (ios) {
          ios.messageHandlers.callIos.postMessage(eventName, params)
        }
      }
    }
  }
}
