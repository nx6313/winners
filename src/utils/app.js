const android = window.android

window['saveUserInfoForAndroid'] = (userInfo) => {
  window.app.$moment.userInfo = userInfo
  window.app.$root.eventHub.$emit('app-has-save-user-info')
}

export default android
