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
          <span>{{userSaleInfo.factory}}</span>
          <span class="duty">{{userSaleInfo.duty}}</span>
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
            <span>{{sale.factory}}</span>
            <span class="duty">{{sale.duty}}</span>
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
      defaultUserHead: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1060129963,1724829206&fm=27&gp=0.jpg',
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
        userName: '',
        saleNum: '',
        saleUnit: '',
        factory: '',
        duty: ''
      },
      saleList: [
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: 8
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: 8
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: 8
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: 8
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: -10
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问',
          up: 8
        }
      ]
    }
  },
  mounted () {
    this.$set(this.userSaleInfo, 'ranking', 2)
    this.$set(this.userSaleInfo, 'userHead', '')
    this.$set(this.userSaleInfo, 'userName', '张三丰')
    this.$set(this.userSaleInfo, 'saleNum', 16)
    this.$set(this.userSaleInfo, 'saleUnit', '台')
    this.$set(this.userSaleInfo, 'factory', '六厂')
    this.$set(this.userSaleInfo, 'duty', '销售顾问')
    this.$set(this.userSaleInfo, 'up', 2)
    document.querySelector('#app-footer').style.display = 'flex'
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      this.$moment.localforage.getItem('userLoginInfo').then((loginInfo) => {
        if (loginInfo) {
          var startDate = '2018-07-01'
          var endDate = '2018-07-06'
          var startOldDate = '2018-06-24'
          var endOldDate = '2018-06-30'
          this.$comfun.http_post(this, this.curTabType + `/order/${loginInfo.user.id}`, {
            startDate: startDate,
            endDate: endDate,
            startOldDate: startOldDate,
            endOldDate: endOldDate,
            start: 0,
            limit: 10
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
      background-size: 100% auto;
    }
    .user-info-wrap {
      position: absolute;
      top: 1.6rem;
      left: 8.2rem;
      div.line-first {
        position: relative;
        width: calc(100vw - 9rem);
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
        span {
          color: #3b3b3b;
        }
        span.duty {
          position: absolute;
          display: inline-block;
          top: 0;
          left: 3.6rem;
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
