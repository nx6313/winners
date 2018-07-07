<template>
  <div class="page-sale-list">
    <div class="tabs-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab, tabIndex) in tabs" :key="tabIndex" :class="tabIndex === 0 ? 'cur-tab' : ''" :style="{ 'width': `calc(100vw / 4)` }">{{tab.txt}}</span>
      </div>
    </div>
    <div class="sale-item-wrap user-self" :class="['sale-item-wrap', 'user-self', (userSaleInfo.ranking >= 1 && userSaleInfo.ranking <= 3)? 'ranking-' + userSaleInfo.ranking : '']">
      <span class="ranking"><span>{{userSaleInfo.ranking}}</span><i></i></span>
      <i class="user-head-wrap"></i>
      <span class="user-head" :style="userSaleInfo.userHead ? { 'background-image': `url(${userSaleInfo.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></span>
      <div class="user-info-wrap">
        <div class="line-first flex-r flex-b">
          <span class="user-name">本人</span>
          <div class="sale-num-wrap">
            <span>销量:</span>
            <span class="big">{{userSaleInfo.saleNum}}</span>
            <span>{{userSaleInfo.saleUnit}}</span>
          </div>
        </div>
        <div class="line-two flex-r flex-b">
          <div>
            <span>{{userSaleInfo.factory}}</span>
            <span class="duty">{{userSaleInfo.duty}}</span>
          </div>
          <span class="up-dowm">
            <i :class="['iconfont', userSaleInfo.up >= 0 ? ['icon-shang', 'up'] : ['icon-xia', 'down']]"></i>
            <span v-if="userSaleInfo.up >= 0">上升 {{userSaleInfo.up}} 名</span>
            <span v-if="userSaleInfo.up < 0">下降 {{userSaleInfo.up}} 名</span>
          </span>
        </div>
      </div>
    </div>
    <div class="tabs-wrap sort-list-tab-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab2, tab2Index) in tabs2" :key="tab2Index" :class="tab2Index === 0 ? 'cur-tab' : ''" :style="{ 'width': `calc(100vw / ${tabs2.length})` }">{{tab2.txt}}</span>
      </div>
    </div>
    <div class="sort-type-wrap flex-r flex-a">
      <span class="cur">集团</span>
      <span>本厂</span>
    </div>
    <div class="all-sale-list-wrap">
      <div :class="['sale-item-wrap', ((saleIndex + 1) >= 1 && (saleIndex + 1) <= 3)? 'ranking-' + (saleIndex + 1) : '']" v-for="(sale, saleIndex) in saleList" :key="saleIndex">
        <span class="ranking"><span>{{saleIndex + 1}}</span><i></i></span>
        <i class="user-head-wrap"></i>
        <span class="user-head" :style="sale.userHead ? { 'background-image': `url(${sale.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></span>
        <div class="user-info-wrap">
          <div class="line-first flex-r flex-b">
            <span class="user-name">{{sale.userName}}</span>
            <div class="sale-num-wrap">
              <span>销量:</span>
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
export default {
  name: 'SaleList',
  data () {
    return {
      curTabType: 'newcar',
      curDateTabType: 'week',
      defaultUserHead: '',
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
          id: 'newcar',
          txt: '综合毛利'
        }
      ],
      tabs2: [
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
      userSaleInfo: {
        ranking: 0,
        userHead: '',
        userName: '~',
        saleNum: '~',
        saleUnit: '~',
        factory: '~',
        duty: '~'
      },
      saleList: []
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.defaultUserHead = this.$moment.defaultHead
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      var startDate = '2018-07-01'
      var endDate = this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      var startOldDate = '2018-06-24'
      var endOldDate = '2018-06-30'
      this.$comfun.http_post(this, this.curTabType + `/order/${this.$moment.userInfo.user.id}`, {
        startDate: startDate,
        endDate: endDate,
        startOldDate: startOldDate,
        endOldDate: endOldDate,
        start: 0,
        limit: 10
      }).then((response) => {
        if (response.body.success === '1') {
          this.$set(this.userSaleInfo, 'ranking', response.body.user.rank)
          this.$set(this.userSaleInfo, 'userHead', '')
          this.$set(this.userSaleInfo, 'userName', response.body.user.name)
          this.$set(this.userSaleInfo, 'saleNum', response.body.user.num)
          this.$set(this.userSaleInfo, 'saleUnit', '台')
          this.$set(this.userSaleInfo, 'factory', response.body.user.companyName)
          this.$set(this.userSaleInfo, 'duty', response.body.user.dutyName)
          this.$set(this.userSaleInfo, 'up', !response.body.user.oldRank || response.body.user.oldRank === 0 ? 0 : response.body.user.oldRank - response.body.user.rank)

          this.saleList = []
          for (let s = 0; s < response.body[this.curTabType].length; s++) {
            this.saleList.push({
              userHead: '',
              userName: response.body[this.curTabType][s].name,
              saleNum: response.body[this.curTabType][s].num,
              saleUnit: '台',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page-sale-list {
  background-color: #F5F5F5;
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
        font-size: 0.8rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
      }
      .cur-tab {
        color: #ff721f;
      }
      .cur-tab::after {
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
  .user-self {
    margin: 0.6rem 0;
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
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto 100%;
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
        background-image: url('./../assets/gold-ranking.png');
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
      background-image: url('./../assets/gold-head.png');
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
        background-image: url('./../assets/silver-ranking.png');
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
      background-image: url('./../assets/silver-head.png');
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
        background-image: url('./../assets/copper-ranking.png');
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
      background-image: url('./../assets/copper-head.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      z-index: 10;
    }
    .user-info-wrap {
      top: 2.1rem;
    }
  }
  .sort-list-tab-wrap {
    .tabs-rail-wrap {
      .cur-tab {
        color: #246dc1;
      }
      .cur-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 2.6rem;
        right: 2.6rem;
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
