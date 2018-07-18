var HttpIp = ''
var HttpPort = ''
// var HttpAddress = 'http://172.18.168.222:8080/'
var HttpAddress = 'http://wx.dcsc520.cn/lhp/'
var HttpAddressRoot = 'http://wx.dcsc520.cn/'
var localforage = require('localforage')

var defaultDcLogo = require('@/assets/dc-logo.png')
var defaultDcHead = require('@/assets/default-head.png')
var defaultHead = ''

export default {
  install: function (Vue, options) {
    var Moment = {
      // 服务器地址
      // eslint-disable-next-line
      server: () => {
        var returnServer = ''
        if (HttpAddress) {
          returnServer = HttpAddress
        } else {
          returnServer = 'http://' + HttpIp + ':' + HttpPort + '/'
        }
        return returnServer
      },
      // 是否开启调试模式
      debug: true,
      HttpAddress_root: HttpAddressRoot,
      HttpAddress_1: HttpAddress + 'data/public/',
      HttpAddress_2: HttpAddress + 'data/manage/',
      HttpAddress_3: HttpAddress + 'data/senior/',
      // localForage
      localforage: localforage,
      userInfo: {},
      defaultDcLogo: defaultDcLogo,
      defaultDcHead: defaultDcHead,
      defaultHead: defaultHead
    }

    Object.defineProperty(Vue.prototype, '$moment', { value: Moment })
  }
}
