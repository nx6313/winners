<template>
  <div class="page-sale-list">
    <div class="tabs-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab, tabIndex) in tabs" :key="tabIndex" :class="tabIndex === 0 ? 'cur-tab' : ''" :style="{ 'width': `calc(100vw / 4)` }">{{tab.txt}}</span>
      </div>
    </div>
    <div class="sale-item-wrap user-self">
      <span class="ranking">7</span>
      <span class="user-head" :style="{ 'background-image': `url(${defaultUserHead})` }"></span>
      <div class="user-info-wrap">
        <div class="line-first flex-r flex-b">
          <span class="user-name">本人</span>
          <div class="sale-num-wrap">
            <span>销量：</span>
            <span class="big">15</span>
            <span>台</span>
          </div>
        </div>
        <div class="line-two">
          <span>一厂</span>
          <span class="duty">销售顾问</span>
        </div>
      </div>
    </div>
    <div class="tabs-wrap sort-list-tab-wrap">
      <div class="tabs-rail-wrap">
        <span v-for="(tab2, tab2Index) in tabs2" :key="tab2Index" :class="tab2Index === 0 ? 'cur-tab' : ''" :style="{ 'width': `calc(100vw / ${tabs2.length})` }">{{tab2.txt}}</span>
      </div>
    </div>
    <div class="all-sale-list-wrap">
      <div class="sale-item-wrap" v-for="(sale, saleIndex) in saleList" :key="saleIndex">
        <span class="ranking">{{saleIndex + 1}}</span>
        <span class="user-head" :style="sale.userHead ? { 'background-image': `url(${sale.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></span>
        <div class="user-info-wrap">
          <div class="line-first flex-r flex-b">
            <span class="user-name">{{sale.userName}}</span>
            <div class="sale-num-wrap">
              <span>销量：</span>
              <span class="big">{{sale.saleNum}}</span>
              <span>{{sale.saleUnit}}</span>
            </div>
          </div>
          <div class="line-two">
            <span>{{sale.factory}}</span>
            <span class="duty">{{sale.duty}}</span>
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
      defaultUserHead: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1060129963,1724829206&fm=27&gp=0.jpg',
      tabs: [
        {
          txt: '整车销售'
        },
        {
          txt: '汽车用品'
        },
        {
          txt: '金融'
        },
        {
          txt: '保险'
        },
        {
          txt: '二手车'
        },
        {
          txt: '综合毛利'
        }
      ],
      tabs2: [
        {
          txt: '周排行'
        },
        {
          txt: '月排行'
        },
        {
          txt: '年排行'
        }
      ],
      userSaleInfo: null,
      saleList: [
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        },
        {
          userHead: '',
          userName: '张三丰',
          saleNum: '18',
          saleUnit: '台',
          factory: '七厂',
          duty: '销售顾问'
        }
      ]
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
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
        font-size: 1rem;
        height: 3.4rem;
        line-height: 3.4rem;
        text-align: center;
      }
      .cur-tab {
        color: #ff721f;
      }
      .cur-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0.6rem;
        right: 0.6rem;
        border-bottom: 4px solid #ff721f;
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
  .user-self {
    margin: 0.8rem 0;
  }
  .sale-item-wrap {
    position: relative;
    background-color: #ffffff;
    height: 6.8rem;
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
      top: 1rem;
      width: 4.4rem;
      height: 4.4rem;
      border-radius: 50%;
      margin-left: 3.4rem;
      border: 2px solid #d1d1d1;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
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
          font-size: 1.2rem;
          color: #0f4e97;
        }
        div.sale-num-wrap {
          position: relative;
          display: inline-block;
          color: #9c9c9c;
          font-size: 0.84rem;
          .big {
            color: #ff721f;
            font-size: 1.2rem;
            font-weight: bold;
          }
        }
      }
      div.line-two {
        position: relative;
        margin-top: 1rem;
        span {
          color: #3b3b3b;
        }
        span.duty {
          position: absolute;
          display: inline-block;
          top: 0;
          left: 5rem;
        }
      }
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
    border-bottom: 1px solid #f1f1f1;
    box-shadow: none;
  }
  .all-sale-list-wrap {
    position: relative;
    .sale-item-wrap:nth-of-type(n + 2)::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid #f3f3f3;
    }
  }
}
</style>
