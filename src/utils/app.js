const android = window.android

window['saveUserInfoForAndroid'] = (userInfo) => {
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

export default android
