<template>
  <div class="page-sale-list">
    <div class="tabs-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab, tabIndex) in tabs" :key="tabIndex" :class="tabIndex === 0 ? 'cur' : ''" :style="{ 'width': `calc(100vw / ${tabShowCount})` }" @click="refOrder('tabType', tab.id, tabIndex)">{{tab.txt}}</span>
      </div>
    </div>
    <div class="user-self-order-wrap-all">
      <div class="user-self-order-wrap" ref="user-self-order-wrap" @touchstart.prevent="userSelfTouchStart" @touchmove.prevent="userSelfTouchMove" @touchend.prevent="userSelfTouchEnd" v-if="userGrade !== 3">
        <div :id="'user-self-page_' + userSaleInfoIndex" ref="user-self-order" :class="['user-self-order', userSaleInfoIndex === 0 ? 'cur-page-for-user-self' : '', (userSaleInfo.ranking >= 1 && userSaleInfo.ranking <= 3)? 'user-self-ranking-' + userSaleInfo.ranking : '']" v-for="(userSaleInfo, userSaleInfoIndex) in userSaleInfos" :key="userSaleInfoIndex">
            <div class="user-head-name-wrap">
            <i class="user-head-wrap"></i>
            <span :class="['user-head', userSaleInfo.userHead ? 'has-head' : '']">
                <i :style="userSaleInfo.userHead ? { 'background-image': `url(${userSaleInfo.userHead})` } : { 'background-image': `url(${defaultUserHead})` }">
                <span class="user-name-for-head" v-if="!userSaleInfo.userHead">{{userSaleInfo.userName.substr(userSaleInfo.userName.trim().length - 2)}}</span>
                </i>
            </span>
            <span class="user-name">{{userSaleInfo.userName}}</span>
            </div>
            <div class="user-info-wrap flex-r flex-b">
            <div class="order-item">
                <div class="ranking-wrap">
                <span class="rank">{{userSaleInfo['company-ranking']}}</span>
                <span>名</span>
                <span class="up-dowm">
                    <i :class="['iconfont', userSaleInfo['company-up'] >= 0 ? ['icon-shang', 'up'] : ['icon-xia', 'down']]"></i>
                    <span>{{Math.abs(userSaleInfo['company-up'])}}</span>
                </span>
                </div>
                <div class="ranking-des">本厂{{userSaleInfo.dateType}}排行</div>
            </div>
            <div class="order-item">
                <div class="ranking-wrap">
                <span class="rank">{{userSaleInfo['group-ranking']}}</span>
                <span>名</span>
                <span class="up-dowm">
                    <i :class="['iconfont', userSaleInfo['group-up'] >= 0 ? ['icon-shang', 'up'] : ['icon-xia', 'down']]"></i>
                    <span>{{Math.abs(userSaleInfo['group-up'])}}</span>
                </span>
                </div>
                <div class="ranking-des">集团{{userSaleInfo.dateType}}排行</div>
            </div>
            <div class="order-item">
                <div class="ranking-wrap">
                <span class="rank">{{userSaleInfo.saleNum}}</span>
                <span>{{userSaleInfo.saleUnit}}</span>
                </div>
                <div class="ranking-des">{{userSaleInfo.salePre}}</div>
            </div>
            </div>
            <div class="page-index">
            <span v-for="(indicator, indicatorIndex) in 4" :key="indicatorIndex" :class="indicatorIndex === userSaleInfoIndex ? 'cur-page' : ''"></span>
            </div>
        </div>
      </div>
    </div>
    <div class="tabs-wrap sort-list-tab-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab2, tab2Index) in tabs2" :key="tab2Index" :class="tab2Index === 0 ? 'cur' : ''" :style="{ 'width': `calc(100vw / ${tabs2.length})` }" @click="refOrder('orderType', tab2.id)">{{tab2.txt}}</span>
      </div>
    </div>
    <div class="sort-type-wrap flex-r flex-a" v-if="userGrade !== 3">
      <span class="cur" @click="refOrder('way', 8)">集团</span>
      <span @click="refOrder('way', 9)">本厂</span>
    </div>
    <div class="all-sale-list-wrap">
      <div :class="['sale-item-wrap', ((saleIndex + 1) >= 1 && (saleIndex + 1) <= 3)? 'ranking-' + (saleIndex + 1) : '']" v-for="(sale, saleIndex) in saleList" :key="saleIndex" @click="toUserData(sale.userId)">
        <span class="ranking"><span>{{saleIndex + 1}}</span><i></i></span>
        <i class="user-head-wrap"></i>
        <span :class="['user-head', sale.userHead ? 'has-head' : '']">
          <i :style="sale.userHead ? { 'background-image': `url(${sale.userHead})` } : { 'background-image': `url(${defaultUserHead})` }">
            <span class="user-name-for-head" v-if="!sale.userHead">{{sale.userName.substr(sale.userName.trim().length - 2)}}</span>
          </i>
        </span>
        <div class="user-info-wrap">
          <div class="line-first flex-r flex-b">
            <span class="user-name">{{sale.userName}}</span>
            <div class="sale-num-wrap">
              <span>{{sale.salePre}}:</span>
              <span class="big">{{sale.saleNum}}</span>
              <span>{{sale.saleUnit}}</span>
            </div>
          </div>
          <div class="line-two flex-r flex-b">
            <div>
              <span>{{sale.factory}}</span>
              <span class="duty">{{sale.duty}}</span>
            </div>
            <span class="up-dowm">
              <i :class="['iconfont', sale.up >= 0 ? ['icon-shang', 'up'] : ['icon-xia', 'down']]"></i>
              <span v-if="sale.up >= 0">上升 {{sale.up}} 名</span>
              <span v-if="sale.up < 0">下降 {{-sale.up}} 名</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import android from '@/utils/app.js'

export default {
  name: 'AppSaleList',
  data () {
    return {
      userGrade: 1,
      userSelfCurPage: 0,
      userSelfTouchStartX: -1,
      userSelfMoveDistance: 0,
      curTabType: 'newcar',
      curDateTabType: 'day',
      curOrderWay: 8, // 8 集团 、9 公司
      defaultUserHead: '',
      tabShowCount: 6,
      tabs: [
        {
          id: 'newcar',
          txt: '整车销售'
        },
        {
          id: 'accessory',
          txt: '汽车用品'
        },
        {
          id: 'finance',
          txt: '金融'
        },
        {
          id: 'insurance',
          txt: '保险'
        },
        {
          id: 'oldcar',
          txt: '二手车'
        },
        {
          id: 'profit',
          txt: '综合毛利'
        }
      ],
      tabs2: [
        {
          id: 'day',
          txt: '日排行'
        },
        {
          id: 'week',
          txt: '周排行'
        },
        {
          id: 'month',
          txt: '月排行'
        },
        {
          id: 'year',
          txt: '年排行'
        }
      ],
      userSaleInfos: [
        {
          userHead: '',
          'company-ranking': 0,
          'group-ranking': 0,
          'company-up': 0,
          'group-up': 0,
          userName: '~',
          saleNum: '~',
          salePre: '~',
          saleUnit: '~',
          dateType: '日'
        },
        {
          userHead: '',
          'company-ranking': 0,
          'group-ranking': 0,
          'company-up': 0,
          'group-up': 0,
          userName: '~',
          saleNum: '~',
          salePre: '~',
          saleUnit: '~',
          dateType: '周'
        },
        {
          userHead: '',
          'company-ranking': 0,
          'group-ranking': 0,
          'company-up': 0,
          'group-up': 0,
          userName: '~',
          saleNum: '~',
          salePre: '~',
          saleUnit: '~',
          dateType: '月'
        },
        {
          userHead: '',
          'company-ranking': 0,
          'group-ranking': 0,
          'company-up': 0,
          'group-up': 0,
          userName: '~',
          saleNum: '~',
          salePre: '~',
          saleUnit: '~',
          dateType: '年'
        }
      ],
      saleList: []
    }
  },
  mounted () {
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      this.initPageData()
    })
    document.querySelector('#app-footer').style.display = 'none'
    this.defaultUserHead = this.$moment.defaultHead
    this.initPageData()
  },
  methods: {
    initPageData () {
      this.initPageByScope()
      this.userGrade = Number(this.$moment.userInfo.user.grade)
      if (this.$moment.userInfo.user && this.$moment.userInfo.user.photo !== null) {
        this.$set(this.userSaleInfos[0], 'userHead', this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`)
        this.$set(this.userSaleInfos[1], 'userHead', this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`)
        this.$set(this.userSaleInfos[2], 'userHead', this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`)
        this.$set(this.userSaleInfos[3], 'userHead', this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}`)
      }
      this.getUserSelfOrder('day')
      this.getUserSelfOrder('week')
      this.getUserSelfOrder('month')
      this.getUserSelfOrder('year')
      this.getOrderList()
    },
    initPageByScope () {
      if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        this.tabs = [
          {
            id: 'num',
            txt: '接车台次'
          },
          {
            id: 'oneprofit',
            txt: '单车产值'
          },
          {
            id: 'sumprofits',
            txt: '总产值'
          },
          {
            id: 'profit',
            txt: '毛利'
          },
          {
            id: 'derive',
            txt: '衍生产值'
          },
          {
            id: 'maintain',
            txt: '保养套餐'
          },
          {
            id: 'newmember',
            txt: '新入会员'
          },
          {
            id: 'renewal',
            txt: '续保'
          }
        ]
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        this.tabs = [
          {
            id: 'num',
            txt: '维修台次'
          },
          {
            id: 'sumprofits',
            txt: '产值'
          },
          {
            id: 'cost',
            txt: '工时费'
          },
          {
            id: 'profit',
            txt: '毛利'
          },
          {
            id: 'profitrate',
            txt: '毛利率'
          },
          {
            id: 'maintain',
            txt: '保险套餐'
          }
        ]
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        this.tabs = [
          {
            id: 'num',
            txt: '接车台次'
          },
          {
            id: 'sumprofits',
            txt: '总产值'
          },
          {
            id: 'profit',
            txt: '毛利'
          },
          {
            id: 'renewal',
            txt: '续保'
          }
        ]
      }
      this.curTabType = this.tabs[0].id
      if (this.tabs.length < this.tabShowCount) {
        this.tabShowCount = this.tabs.length
      }
    },
    refOrder (type, val, index) {
      event.target.parentNode.getElementsByClassName('cur')[0].classList.remove('cur')
      event.target.classList.add('cur')
      if (index % this.tabShowCount === this.tabShowCount - 1) {
        event.target.parentNode.style.transform = `translateX(calc(((-100vw / ${this.tabShowCount}) * ${this.tabs.length - this.tabShowCount})))`
      } else if (index === this.tabs.length - this.tabShowCount) {
        event.target.parentNode.style.transform = `translateX(0)`
      }
      if (type === 'tabType') {
        this.curTabType = val
        this.getUserSelfOrder('day')
        this.getUserSelfOrder('week')
        this.getUserSelfOrder('month')
        this.getUserSelfOrder('year')
      } else if (type === 'orderType') {
        this.curDateTabType = val
      } else if (type === 'way') {
        this.curOrderWay = val
      }
      this.getOrderList()
    },
    userSelfTouchStart () {
      this.$refs['user-self-order-wrap'].style['transition-duration'] = '0s'
      this.userSelfTouchStartX = event.touches[0].pageX
      var userSelfPages = this.$refs['user-self-order']
      for (let p = 0; p < userSelfPages.length; p++) {
        if (userSelfPages[p].classList.contains('cur-page-for-user-self')) {
          let pageItemId = userSelfPages[p].id
          this.userSelfCurPage = Number(pageItemId.split('_')[1])
        }
      }
    },
    userSelfTouchMove () {
      if (this.userSelfTouchStartX < 0) {
        this.userSelfTouchStartX = event.touches[0].pageX
      }
      this.userSelfMoveDistance = event.touches[0].pageX - this.userSelfTouchStartX
      if (!((this.userSelfMoveDistance > 0 && this.userSelfCurPage === 0) || (this.userSelfMoveDistance < 0 && this.userSelfCurPage === 3) || Math.abs(this.userSelfMoveDistance) > document.body.clientWidth)) {
        var transTo = `translateX(calc(${-this.userSelfCurPage} * 100vw + ${this.userSelfMoveDistance}px))`
        this.$refs['user-self-order-wrap'].style.transform = transTo
      }
    },
    userSelfTouchEnd () {
      this.$refs['user-self-order-wrap'].style['transition-duration'] = '0.4s'
      if (Math.abs(this.userSelfMoveDistance) > 80) {
        if (this.userSelfMoveDistance > 0) {
          // 下一页
          if (this.userSelfCurPage > 0) {
            this.userSelfCurPage--
          }
        } else if (this.userSelfMoveDistance < 0) {
          // 上一页
          if (this.userSelfCurPage < 3) {
            this.userSelfCurPage++
          }
        }
      }
      var userSelfPages = this.$refs['user-self-order']
      for (let p = 0; p < userSelfPages.length; p++) {
        if (userSelfPages[p].classList.contains('cur-page-for-user-self')) {
          userSelfPages[p].classList.remove('cur-page-for-user-self')
          if (p === this.userSelfCurPage) {
            userSelfPages[p].classList.add('cur-page-for-user-self')
          }
        }
      }
      let transTo = `translateX(calc(${-this.userSelfCurPage} * 100vw))`
      this.$refs['user-self-order-wrap'].style.transform = transTo
      this.userSelfTouchStartX = -1
      this.userSelfMoveDistance = 0
    },
    getDesAndUnit (datePre) {
      var preDes = ''
      var unit = ''
      if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sale) {
        if (this.curTabType === 'newcar') {
          preDes = datePre + '销量'
          unit = '台'
        } else if (this.curTabType === 'accessory') {
          preDes = datePre + '销售额'
          unit = '元'
        } else if (this.curTabType === 'finance') {
          preDes = datePre + '信贷量'
          unit = '台'
        } else if (this.curTabType === 'insurance') {
          preDes = datePre + '投保量'
          unit = '单'
        } else if (this.curTabType === 'oldcar') {
          preDes = datePre + '置换量'
          unit = '台'
        } else if (this.curTabType === 'profit') {
          preDes = datePre + '销售额'
          unit = '元'
        }
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        if (this.curTabType === 'num') {
          preDes = datePre + '接车台次'
          unit = '台'
        } else if (this.curTabType === 'oneprofit') {
          preDes = datePre + '单车产值'
          unit = '元'
        } else if (this.curTabType === 'sumprofits') {
          preDes = datePre + '总产值'
          unit = '元'
        } else if (this.curTabType === 'profit') {
          preDes = datePre + '毛利'
          unit = '元'
        } else if (this.curTabType === 'derive') {
          preDes = datePre + '衍生产值'
          unit = '元'
        } else if (this.curTabType === 'maintain') {
          preDes = datePre + '保养套餐'
          unit = '套'
        } else if (this.curTabType === 'newmember') {
          preDes = datePre + '新入会员'
          unit = '个'
        } else if (this.curTabType === 'renewal') {
          preDes = datePre + '续保'
          unit = '元'
        }
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        if (this.curTabType === 'num') {
          preDes = datePre + '维修台次'
          unit = '台次'
        } else if (this.curTabType === 'sumprofits') {
          preDes = datePre + '产值'
          unit = '元'
        } else if (this.curTabType === 'cost') {
          preDes = datePre + '工时费'
          unit = '元'
        } else if (this.curTabType === 'profit') {
          preDes = datePre + '毛利'
          unit = '元'
        } else if (this.curTabType === 'profitrate') {
          preDes = datePre + '毛利率'
          unit = '%'
        } else if (this.curTabType === 'maintain') {
          preDes = datePre + '保险套餐'
          unit = '套'
        }
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        if (this.curTabType === 'num') {
          preDes = datePre + '接车台次'
          unit = '台次'
        } else if (this.curTabType === 'sumprofits') {
          preDes = datePre + '总产值'
          unit = '元'
        } else if (this.curTabType === 'profit') {
          preDes = datePre + '毛利'
          unit = '元'
        } else if (this.curTabType === 'renewal') {
          preDes = datePre + '续保'
          unit = '元'
        }
      }
      return {
        preDes: preDes,
        unit: unit
      }
    },
    getUserSelfOrder (dateType) {
      var startDate = ''
      var endDate = ''
      var startOldDate = ''
      var endOldDate = ''
      var datePre = '日'
      var preDes = ''
      var unit = ''
      if (dateType === 'day') {
        this.$set(this.userSaleInfos[0], 'userHead', this.$moment.userInfo.user.photo ? this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}` : '')
        this.$set(this.userSaleInfos[0], 'userName', this.$moment.userInfo.user.name)
        datePre = '日'
        preDes = this.getDesAndUnit(datePre).preDes
        unit = this.getDesAndUnit(datePre).unit
        this.$set(this.userSaleInfos[0], 'salePre', preDes)
        this.$set(this.userSaleInfos[0], 'saleUnit', unit)
        var yesterday = this.$comfun.getTargetDate(-1)
        var beforeYesterday = this.$comfun.getTargetDate(-2)
        startDate = this.$comfun.formatDate(yesterday, 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(yesterday, 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeYesterday, 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeYesterday, 'yyyy-MM-dd')
      } else if (dateType === 'week') {
        this.$set(this.userSaleInfos[1], 'userHead', this.$moment.userInfo.user.photo ? this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}` : '')
        this.$set(this.userSaleInfos[1], 'userName', this.$moment.userInfo.user.name)
        datePre = '周'
        preDes = this.getDesAndUnit(datePre).preDes
        unit = this.getDesAndUnit(datePre).unit
        this.$set(this.userSaleInfos[1], 'salePre', preDes)
        this.$set(this.userSaleInfos[1], 'saleUnit', unit)
        var curWeek = this.$comfun.getWeekStartEnd()
        var beforeWeek = this.$comfun.getWeekStartEnd(-1)
        startDate = this.$comfun.formatDate(curWeek[0], 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(curWeek[1], 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeWeek[0], 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeWeek[1], 'yyyy-MM-dd')
      } else if (dateType === 'month') {
        this.$set(this.userSaleInfos[2], 'userHead', this.$moment.userInfo.user.photo ? this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}` : '')
        this.$set(this.userSaleInfos[2], 'userName', this.$moment.userInfo.user.name)
        datePre = '月'
        preDes = this.getDesAndUnit(datePre).preDes
        unit = this.getDesAndUnit(datePre).unit
        this.$set(this.userSaleInfos[2], 'salePre', preDes)
        this.$set(this.userSaleInfos[2], 'saleUnit', unit)
        var curMonth = this.$comfun.getMonthStartEnd()
        var beforeMonth = this.$comfun.getMonthStartEnd(-1)
        startDate = this.$comfun.formatDate(curMonth[0], 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(curMonth[1], 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeMonth[0], 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeMonth[1], 'yyyy-MM-dd')
      } else if (dateType === 'year') {
        this.$set(this.userSaleInfos[3], 'userHead', this.$moment.userInfo.user.photo ? this.$moment.HttpAddress_1 + `showFile/${this.$moment.userInfo.user.photo}` : '')
        this.$set(this.userSaleInfos[3], 'userName', this.$moment.userInfo.user.name)
        datePre = '年'
        preDes = this.getDesAndUnit(datePre).preDes
        unit = this.getDesAndUnit(datePre).unit
        this.$set(this.userSaleInfos[3], 'salePre', preDes)
        this.$set(this.userSaleInfos[3], 'saleUnit', unit)
        startDate = new Date().getFullYear() + '-01-01'
        endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
        startOldDate = (new Date().getFullYear() - 1) + '-01-01'
        endOldDate = this.$comfun.formatDate(this.$comfun.getLastDay(new Date().getFullYear() - 1, 12), 'yyyy-MM-dd')
      }
      var orderSelfUri = 'data/public/' + this.curTabType + `/order/my/${this.$moment.userInfo.user.id}`
      if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        orderSelfUri = `after/public/serve/order/${this.curTabType}/my/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        orderSelfUri = `after/public/group/order/${this.curTabType}/my/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        orderSelfUri = `after/public/accident/order/${this.curTabType}/my/${this.$moment.userInfo.user.id}`
      }
      this.$comfun.http_post(this, orderSelfUri, {
        startDate: startDate,
        endDate: endDate,
        startOldDate: startOldDate,
        endOldDate: endOldDate
      }).then((response) => {
        if (response.body.success === '1') {
          if (dateType === 'day') {
            this.$set(this.userSaleInfos[0], 'company-ranking', response.body.company.rank)
            this.$set(this.userSaleInfos[0], 'group-ranking', response.body.group.rank)
            this.$set(this.userSaleInfos[0], 'company-up', !response.body.company.oldRank || response.body.company.oldRank === 0 ? 0 : response.body.company.oldRank - response.body.company.rank)
            this.$set(this.userSaleInfos[0], 'group-up', !response.body.group.oldRank || response.body.group.oldRank === 0 ? 0 : response.body.group.oldRank - response.body.group.rank)
            this.$set(this.userSaleInfos[0], 'saleNum', response.body.company.num)
          }
          if (dateType === 'week') {
            this.$set(this.userSaleInfos[1], 'company-ranking', response.body.company.rank)
            this.$set(this.userSaleInfos[1], 'group-ranking', response.body.group.rank)
            this.$set(this.userSaleInfos[1], 'company-up', !response.body.company.oldRank || response.body.company.oldRank === 0 ? 0 : response.body.company.oldRank - response.body.company.rank)
            this.$set(this.userSaleInfos[1], 'group-up', !response.body.group.oldRank || response.body.group.oldRank === 0 ? 0 : response.body.group.oldRank - response.body.group.rank)
            this.$set(this.userSaleInfos[1], 'saleNum', response.body.company.num)
          }
          if (dateType === 'month') {
            this.$set(this.userSaleInfos[2], 'company-ranking', response.body.company.rank)
            this.$set(this.userSaleInfos[2], 'group-ranking', response.body.group.rank)
            this.$set(this.userSaleInfos[2], 'company-up', !response.body.company.oldRank || response.body.company.oldRank === 0 ? 0 : response.body.company.oldRank - response.body.company.rank)
            this.$set(this.userSaleInfos[2], 'group-up', !response.body.group.oldRank || response.body.group.oldRank === 0 ? 0 : response.body.group.oldRank - response.body.group.rank)
            this.$set(this.userSaleInfos[2], 'saleNum', response.body.company.num)
          }
          if (dateType === 'year') {
            this.$set(this.userSaleInfos[3], 'company-ranking', response.body.company.rank)
            this.$set(this.userSaleInfos[3], 'group-ranking', response.body.group.rank)
            this.$set(this.userSaleInfos[3], 'company-up', !response.body.company.oldRank || response.body.company.oldRank === 0 ? 0 : response.body.company.oldRank - response.body.company.rank)
            this.$set(this.userSaleInfos[3], 'group-up', !response.body.group.oldRank || response.body.group.oldRank === 0 ? 0 : response.body.group.oldRank - response.body.group.rank)
            this.$set(this.userSaleInfos[3], 'saleNum', response.body.company.num)
          }
        }
      })
    },
    getOrderList () {
      var startDate = ''
      var endDate = ''
      var startOldDate = ''
      var endOldDate = ''
      var datePre = '日'
      if (this.curDateTabType === 'day') {
        datePre = '日'
        var yesterday = this.$comfun.getTargetDate(-1)
        var beforeYesterday = this.$comfun.getTargetDate(-2)
        startDate = this.$comfun.formatDate(yesterday, 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(yesterday, 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeYesterday, 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeYesterday, 'yyyy-MM-dd')
      } else if (this.curDateTabType === 'week') {
        datePre = '周'
        var curWeek = this.$comfun.getWeekStartEnd()
        var beforeWeek = this.$comfun.getWeekStartEnd(-1)
        startDate = this.$comfun.formatDate(curWeek[0], 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(curWeek[1], 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeWeek[0], 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeWeek[1], 'yyyy-MM-dd')
      } else if (this.curDateTabType === 'month') {
        datePre = '月'
        var curMonth = this.$comfun.getMonthStartEnd()
        var beforeMonth = this.$comfun.getMonthStartEnd(-1)
        startDate = this.$comfun.formatDate(curMonth[0], 'yyyy-MM-dd')
        endDate = this.$comfun.formatDate(curMonth[1], 'yyyy-MM-dd')
        startOldDate = this.$comfun.formatDate(beforeMonth[0], 'yyyy-MM-dd')
        endOldDate = this.$comfun.formatDate(beforeMonth[1], 'yyyy-MM-dd')
      } else if (this.curDateTabType === 'year') {
        datePre = '年'
        startDate = new Date().getFullYear() + '-01-01'
        endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
        startOldDate = (new Date().getFullYear() - 1) + '-01-01'
        endOldDate = this.$comfun.formatDate(this.$comfun.getLastDay(new Date().getFullYear() - 1, 12), 'yyyy-MM-dd')
      }
      var preDes = this.getDesAndUnit(datePre).preDes
      var unit = this.getDesAndUnit(datePre).unit
      var orderDataUri = 'data/public/' + this.curTabType + `/order/${this.$moment.userInfo.user.id}`
      if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jdfwgw) { // B:机电服务顾问
        orderDataUri = `after/public/serve/order/${this.curTabType}/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.jxbz) { // C:机电班组
        orderDataUri = `after/public/group/order/${this.curTabType}/${this.$moment.userInfo.user.id}`
      } else if (this.$moment.userInfo.user.scope === this.$moment.dutyOpt.sgfwgw) { // D:事故服务顾问
        orderDataUri = `after/public/accident/order/${this.curTabType}/${this.$moment.userInfo.user.id}`
      }
      this.$comfun.http_post(this, orderDataUri, {
        type: this.curOrderWay,
        startDate: startDate,
        endDate: endDate,
        startOldDate: startOldDate,
        endOldDate: endOldDate,
        start: 0,
        limit: 20
      }).then((response) => {
        if (response.body.success === '1') {
          this.saleList = []
          for (let s = 0; s < response.body[this.curTabType].length; s++) {
            this.saleList.push({
              userId: response.body[this.curTabType][s].consultantId,
              userHead: response.body[this.curTabType][s].photo ? this.$moment.HttpAddress_1 + `showFile/${response.body[this.curTabType][s].photo}` : '',
              userName: response.body[this.curTabType][s].name,
              saleNum: response.body[this.curTabType][s].num,
              salePre: preDes,
              saleUnit: unit,
              factory: response.body[this.curTabType][s].companyName,
              duty: response.body[this.curTabType][s].dutyName,
              up: !response.body[this.curTabType][s].oldRank || response.body[this.curTabType][s].oldRank === 0 ? 0 : response.body[this.curTabType][s].oldRank - response.body[this.curTabType][s].rank
            })
          }
        } else {
          this.$dialog_msg({
            msg: '获取排名数据失败'
          })
        }
      })
    },
    toUserData (userId) {
      android.callAndroid('updateTitleBar', JSON.stringify({
        title: '个人信息',
        back: true
      }))
      this.$router.push(`/app-user-data/${userId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-sale-list {
  background-color: #F5F5F5;
  height: 100vh;
  .tabs-wrap {
    position: relative;
    background-color: #ffffff;
    .tabs-rail-wrap {
      position: relative;
      white-space: nowrap;
      overflow-x: visible;
      transition: all 0.2s ease 0s;
      span {
        position: relative;
        display: inline-block;
        color: #808080;
        font-size: 0.7rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
      }
      .cur {
        color: #ff721f;
      }
      .cur::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0.8rem;
        right: 0.8rem;
        border-bottom: 3px solid #ff721f;
      }
    }
  }
  .tabs-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  }
  .user-self-order-wrap-all {
    position: relative;
    width: 100vw;
    overflow: hidden;
  }
  .user-self-order-wrap {
    position: relative;
    white-space: nowrap;
    width: 400vw;
    transition: all 0.4s ease 0s;
    transform: translateX(0vw);
    font-size: 0px;
    margin-top: 0.6rem;
  }
  .sort-type-wrap {
    position: relative;
    background-color: #ffffff;
    padding: 0.8rem 6rem;
    font-size: 0.8rem;
    span {
      border: 1px solid #5193e0;
      padding: 0.5rem 0.8rem 0.3rem;
      border-radius: 4px;
      color: #5193e0;
    }
    .cur {
      background-color: #5193e0;
      color: #ffffff;
    }
  }
  .user-self-order {
    position: relative;
    display: inline-block;
    width: 100vw;
    background-color: #ffffff;
    height: 7.2rem;
    .user-head-name-wrap {
      position: relative;
      display: inline-block;
      width: 6rem;
      height: 100%;
      left: 0.2rem;
      .user-head {
        position: absolute;
        display: inline-block;
        top: 0.9rem;
        width: 3rem;
        height: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        border-radius: 50%;
        border: 2px solid #e2e2e2;
        background-color: #7daffa;
        z-index: 2;
        overflow: hidden;
        i {
          position: relative;
          top: -5%;
          left: -5%;
          display: inline-block;
          width: 110%;
          height: 110%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
          z-index: 1;
          span.user-name-for-head {
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto 0;
            width: 100%;
            height: 1rem;
            line-height: normal;
            text-align: center;
            font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
            font-size: 0.7rem;
            font-weight: bold;
            color: #ffffff;
            white-space: nowrap;
            font-style: normal;
          }
        }
      }
      .has-head {
        background-color: #ffffff;
        i {
          position: relative;
          top: 0;
          left: 0;
          display: inline-block;
          width: 200%;
          height: 200%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
        }
      }
      .user-name {
        position: absolute;
        bottom: 1.6rem;
        font-size: 0.9rem;
        width: 100%;
        text-align: center;
        color: #0f4e97;
      }
    }
    .user-info-wrap {
      position: absolute;
      top: 0;
      left: 6.8rem;
      display: inline-block;
      width: calc(100% - 6.9rem);
      height: 100%;
      font-size: 0px;
      div.order-item {
        position: relative;
        display: inline-block;
        width: calc(100% / 3);
        height: 100%;
        font-size: 0.7rem;
        color: #333333;
        .ranking-wrap {
          position: relative;
          margin-top: 2rem;
          .rank {
            font-size: 1rem;
            color: #ff721f;
            font-weight: bold;
          }
          span.up-dowm {
            position: relative;
            i {
              position: relative;
              display: inline-block;
              width: 0;
              height: 0;
              margin-right: 0.7rem;
              top: 0.08rem;
              font-size: 0.96rem;
            }
            i.up {
              color: #22ac38;
            }
            i.down {
              color: #f44452;
            }
            span {
              color: #9b9b9b;
              font-size: 0.6rem;
            }
          }
        }
        .ranking-des {
          margin-top: 0.6rem;
        }
      }
    }
    .page-index {
      position: absolute;
      width: 100%;
      height: 1.2rem;
      bottom: 0;
      text-align: center;
      span {
        position: relative;
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: #dddddd;
        margin: 0 0.3rem;
      }
      .cur-page {
        background-color: rgb(238, 95, 5);
      }
    }
  }
  .sale-item-wrap {
    position: relative;
    background-color: #ffffff;
    height: 6rem;
    .ranking {
      position: absolute;
      display: inline-block;
      left: 1.4rem;
      color: #999999;
      margin-left: 1rem;
      height: 4rem;
      line-height: 4rem;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
    .user-head {
      position: absolute;
      display: inline-block;
      top: 0.9rem;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      margin-left: 3.4rem;
      border: 2px solid #e2e2e2;
      background-color: #7daffa;
      z-index: 2;
      overflow: hidden;
      i {
        position: relative;
        top: -5%;
        left: -5%;
        display: inline-block;
        width: 110%;
        height: 110%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        z-index: 1;
        span.user-name-for-head {
          display: inline-block;
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          width: 100%;
          height: 1rem;
          line-height: normal;
          text-align: center;
          font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
          font-size: 0.7rem;
          font-weight: bold;
          color: #ffffff;
          white-space: nowrap;
          font-style: normal;
        }
      }
    }
    .has-head {
      background-color: #ffffff;
      i {
        position: relative;
        top: 0;
        left: 0;
        display: inline-block;
        width: 200%;
        height: 200%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
      }
    }
    .user-info-wrap {
      position: absolute;
      top: 1.6rem;
      left: 8.8rem;
      div.line-first {
        position: relative;
        width: calc(100vw - 9.6rem);
        span.user-name {
          position: relative;
          font-size: 1rem;
          color: #0f4e97;
        }
        div.sale-num-wrap {
          position: relative;
          display: inline-block;
          color: #9c9c9c;
          font-size: 0.8rem;
          .big {
            color: #ff721f;
            font-size: 1rem;
            font-weight: bold;
          }
        }
      }
      div.line-two {
        position: relative;
        margin-top: 1rem;
        font-size: 0.8rem;
        div {
          position: relative;
          top: -0.6rem;
          span {
            position: relative;
            color: #3b3b3b;
          }
          span.duty {
            position: absolute;
            display: inline-block;
            width: 8rem;
            top: 1.2rem;
            left: 0;
            color: #727272;
          }
        }
        span.up-dowm {
          position: relative;
          i {
            position: relative;
            display: inline-block;
            width: 0;
            height: 0;
            margin-right: 0.8rem;
            top: 0.08rem;
            font-size: 0.96rem;
          }
          i.up {
            color: #22ac38;
          }
          i.down {
            color: #f44452;
          }
          span {
            color: #9b9b9b;
            font-size: 0.6rem;
          }
        }
      }
    }
  }
  .ranking-1 {
    height: 7rem;
    .ranking {
      span {
        position: relative;
        display: inline-block;
        z-index: 2;
        color: #ffffff;
        font-weight: bold;
      }
      i {
        position: absolute;
        top: 0.25rem;
        left: -0.62rem;
        width: 2rem;
        height: 3rem;
        background-image: url('./../../assets/gold-ranking.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        z-index: 1;
      }
    }
    .user-head {
      top: 1.4rem;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.4rem;
      left: 2.6rem;
      width: 5.9rem;
      height: 5.9rem;
      background-image: url('./../../assets/gold-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-info-wrap {
      top: 2.1rem;
    }
  }
  .ranking-2 {
    height: 7rem;
    .ranking {
      span {
        position: relative;
        display: inline-block;
        z-index: 2;
        color: #ffffff;
        font-weight: bold;
      }
      i {
        position: absolute;
        top: 0.25rem;
        left: -0.62rem;
        width: 2rem;
        height: 3rem;
        background-image: url('./../../assets/silver-ranking.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        z-index: 1;
      }
    }
    .user-head {
      top: 1.4rem;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.4rem;
      left: 2.6rem;
      width: 5.9rem;
      height: 5.9rem;
      background-image: url('./../../assets/silver-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-info-wrap {
      top: 2.1rem;
    }
  }
  .ranking-3 {
    height: 7rem;
    .ranking {
      span {
        position: relative;
        display: inline-block;
        z-index: 2;
        color: #ffffff;
        font-weight: bold;
      }
      i {
        position: absolute;
        top: 0.25rem;
        left: -0.62rem;
        width: 2rem;
        height: 3rem;
        background-image: url('./../../assets/copper-ranking.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        z-index: 1;
      }
    }
    .user-head {
      top: 1.4rem;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.4rem;
      left: 2.6rem;
      width: 5.9rem;
      height: 5.9rem;
      background-image: url('./../../assets/copper-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-info-wrap {
      top: 2.1rem;
    }
  }
  .user-self-ranking-1 {
    .user-head {
      top: 1.2rem !important;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.46rem;
      left: 0.86rem;
      width: 4.4rem;
      height: 4.4rem;
      background-image: url('./../../assets/gold-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-name {
      bottom: 1.1rem !important;
    }
  }
  .user-self-ranking-2 {
    .user-head {
      top: 1.2rem !important;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.46rem;
      left: 0.86rem;
      width: 4.4rem;
      height: 4.4rem;
      background-image: url('./../../assets/gold-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-name {
      bottom: 1.1rem !important;
    }
  }
  .user-self-ranking-3 {
    .user-head {
      top: 1.2rem !important;
    }
    .user-head-wrap {
      position: absolute;
      display: inline-block;
      top: 0.46rem;
      left: 0.86rem;
      width: 4.4rem;
      height: 4.4rem;
      background-image: url('./../../assets/gold-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-name {
      bottom: 1.1rem !important;
    }
  }
  .sort-list-tab-wrap {
    position: relative;
    margin-top: 0.6rem;
    .tabs-rail-wrap {
      .cur {
        color: #246dc1;
      }
      .cur::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 2.2rem;
        right: 2.2rem;
        border-bottom: 4px solid #246dc1;
      }
    }
  }
  .sort-list-tab-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #f8f8f8;
    box-shadow: none;
  }
  .all-sale-list-wrap {
    position: relative;
    .sale-item-wrap:nth-of-type(n + 2)::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid #fafafa;
    }
  }
}
</style>
