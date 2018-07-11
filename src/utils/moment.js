var HttpIp = ''
var HttpPort = ''
// var HttpAddress = 'http://172.18.168.222:8080/data/public/'
var HttpAddress = 'http://wx.dcsc520.cn/lhp/data/public/'
var localforage = require('localforage')

var defaultHead = require('@/assets/default-head.png')

export default {
  install: function (Vue, options) {
    var Moment = {
      // 服务器地址
      // eslint-disable-next-line
      server: HttpAddress ? HttpAddress : 'http://' + HttpIp + ':' + HttpPort + '/',
      // 是否开启调试模式
      debug: true,
      HttpAddress: HttpAddress,
      // localForage
      localforage: localforage,
      userInfo: {},
      defaultHead: defaultHead
    }

    Object.defineProperty(Vue.prototype, '$moment', { value: Moment })
  }
}
