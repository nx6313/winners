<template>
  <div class="page-client-follow">
    <div class="header-wrap">
      <div class="search-panl-wrap">
        <div class="search-wrap">
          <i class="iconfont icon-fdj"></i>
          <input type="text" placeholder="姓名 / 电话搜索" v-model="searchVal" @click="searchClick">
        </div>
      </div>
      <div class="filter-panl-wrap">
        <span class="filter-item-wrap" v-for="(filter, filterIndex) in filters" :key="filterIndex" :style="{ 'width': `calc(100% / ${filters.length})` }" @click="openFilter($event, filterIndex)">{{filter.key}}<i class="filter-icon iconfont icon-down"></i></span>
      </div>
      <div class="filter-content-item-shade" ref="filter-content-item-shade" @click="filterClose"></div>
      <div :class="['filter-content-item-wrap', 'filter-content-item-' + filterIndex]" :ref="'filter-content-item-' + filterIndex" v-for="(filter, filterIndex) in filters" :key="filterIndex">
        <span :class="filterKeys.indexOf(filterItem.key) >= 0 ? 'filter-select-item' : ''" v-for="(filterItem, filterItemIndex) in filter.filterItems" :key="filterItemIndex" @click="selectThisFilter($event, filterIndex, filterItemIndex)">{{filterItem.val}}<i class="des" v-if="filterItem.des">{{filterItem.des}}</i><i class="is-select">&#x2714;</i></span>
      </div>
    </div>
    <div class="filter-select-wrap" v-if="hasFilter">
      <span v-for="(filterVal, filterValIndex) in filterVals" :key="filterValIndex" v-if="filterVal">{{filterVal}}<i class="filter-select-delete iconfont icon-delete" @click="deleteSelectFilter($event, filterValIndex)"></i></span>
    </div>
    <div :class="['data-items-wrap', hasFilter ? 'data-items-wrap-has-filter' : '']">
      <div class="data-item-wrap" v-for="(data, dataIndex) in datas" :key="dataIndex" :ref="'data-item-wrap-' + dataIndex">
        <div class="do-wrap">
          <span v-for="(doBtn, doIndex) in data.dos" :key="doIndex">
            <template v-if="doBtn === 'delete'">删除</template>
          </span>
        </div>
        <div class="data-wrap" @touchstart="dataItemTouchStart(dataIndex, data.dos.length)" @touchmove="dataItemTouchMove(dataIndex, data.dos.length)" @touchend="dataItemTouchEnd(dataIndex, data.dos.length)">
          <div class="data-head-wrap flex-r flex-b">
            <div class="left-title">
              <span class="user-name">{{data.userName}}</span>
              <span class="btn-follow"><i class="iconfont icon-phone"></i>立即回访</span>
            </div>
            <i class="iconfont icon-right"></i>
          </div>
          <div class="data-content-wrap flex-r flex-b">
            <div>
              <span>意向车型</span>
              <span>{{data.intentionCarModel ? data.intentionCarModel : '未填写'}}</span>
            </div>
            <div>
              <span>来访时间</span>
              <span>{{data.comeinDate ? data.intentionCarModel : '未填写'}}</span>
            </div>
            <div>
              <span>跟进次数</span>
              <span>1次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppClientFollow',
  data () {
    return {
      holdTimer: null,
      holdTime: 0,
      searchVal: '',
      hasFilter: false,
      filterKeys: [],
      filterVals: [],
      filters: [
        {
          key: '客户级别',
          filterItems: [
            {
              key: 1,
              val: 'H 级',
              des: '（三天内成交）'
            },
            {
              key: 2,
              val: 'A 级',
              des: '（7 天内成交）'
            },
            {
              key: 3,
              val: 'B 级',
              des: '（30 天内成交）'
            },
            {
              key: 4,
              val: 'C 级',
              des: '（30 天以上成交）'
            },
            {
              key: 5,
              val: 'O 级',
              des: '（订车客户）'
            },
            {
              key: 6,
              val: 'D 级',
              des: '（成交客户）'
            },
            {
              key: 7,
              val: 'F 级',
              des: '（战败）'
            }
          ]
        },
        {
          key: '时间筛选',
          filterItems: [
            {
              key: '1',
              val: '一周内客户'
            },
            {
              key: '2',
              val: '两周内客户'
            },
            {
              key: '3',
              val: '本月内客户'
            },
            {
              key: '4',
              val: '三月内客户'
            }
          ]
        }
      ],
      datas: [],
      dataItemMoveStartX: -1,
      dataItemMoveDistance: -1
    }
  },
  mounted () {
    this.$root.eventHub.$on('app-has-save-user-info', () => {
      this.initPageData()
    })
    this.initPageData()
  },
  methods: {
    initPageData () {
      if (this.$moment.userInfo.user) {
        this.$comfun.http_post(this, this.$moment.appServer + '/customerManager/searchByBsSubCusto', {
          'createBy': this.$moment.userInfo.user.id
        }).then((response) => {
          this.datas = []
          for (let c = 0; c < response.body.list.length; c++) {
            this.datas.push({
              id: response.body.list[c].scId,
              userName: response.body.list[c].custoName,
              mobile: response.body.list[c].mobile,
              dos: [ 'delete' ]
            })
          }
        })
      }
      this.$comfun.http_get(this, this.$moment.appServer + '/bsCustoLevelManager/getAllCustomerLevel').then((response) => {
        this.filters[0].filterItems = []
        for (let l = 0; l < response.body.length; l++) {
          this.filters[0].filterItems.push({
            key: response.body[l].customerLevelId,
            val: response.body[l].customerLevelValue
          })
        }
      })
      this.filters[1].filterItems[0].key = 'filter-1-0,' + this.$comfun.formatDate(this.$comfun.getTargetDate(-6), 'yyyy-MM-dd') + ',' + this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.filters[1].filterItems[1].key = 'filter-1-1,' + this.$comfun.formatDate(this.$comfun.getTargetDate(-12), 'yyyy-MM-dd') + ',' + this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
      this.filters[1].filterItems[2].key = 'filter-1-2,' + this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[0], 'yyyy-MM-dd') + ',' + this.$comfun.formatDate(this.$comfun.getMonthStartEnd()[1], 'yyyy-MM-dd')
      this.filters[1].filterItems[3].key = 'filter-1-3,' + this.$comfun.formatDate(this.$comfun.getMonthStartEnd(-2)[0], 'yyyy-MM-dd') + ',' + this.$comfun.formatDate(new Date(), 'yyyy-MM-dd')
    },
    searchClick () {
      this.filterClose()
    },
    filterClose () {
      this.$refs['filter-content-item-shade'].classList.remove('shade-show')
      var filters = document.getElementsByClassName('filter-item-wrap')
      for (let f = 0; f < filters.length; f++) {
        filters[f].classList.remove('filter-open')
      }
      var filterContents = document.getElementsByClassName('filter-content-item-wrap')
      for (let c = 0; c < filterContents.length; c++) {
        filterContents[c].classList.remove('filter-content-open')
        filterContents[c].classList.remove('filter-content-open-' + c)
      }
    },
    openFilter (event, filterIndex) {
      this.$refs['filter-content-item-shade'].classList.remove('shade-show')
      var filters = event.target.parentNode.getElementsByClassName('filter-item-wrap')
      for (let f = 0; f < filters.length; f++) {
        if (f !== filterIndex) {
          filters[f].classList.remove('filter-open')
        }
      }
      var filterContents = document.getElementsByClassName('filter-content-item-wrap')
      for (let c = 0; c < filterContents.length; c++) {
        filterContents[c].classList.remove('filter-content-open')
        filterContents[c].classList.remove('filter-content-open-' + c)
      }
      if (!event.target.classList.contains('filter-open')) {
        event.target.classList.add('filter-open')
        this.$refs['filter-content-item-shade'].classList.add('shade-show')
        this.$refs['filter-content-item-' + filterIndex][0].classList.add('filter-content-open')
        this.$refs['filter-content-item-' + filterIndex][0].classList.add('filter-content-open-' + filterIndex)
      } else {
        event.target.classList.remove('filter-open')
      }
    },
    selectThisFilter (event, filterIndex, filterItemIndex) {
      if (this.filterKeys[filterIndex] === this.filters[filterIndex].filterItems[filterItemIndex].key) {
        this.$set(this.filterKeys, filterIndex, undefined)
        this.$set(this.filterVals, filterIndex, undefined)
      } else {
        this.$set(this.filterKeys, filterIndex, this.filters[filterIndex].filterItems[filterItemIndex].key)
        this.$set(this.filterVals, filterIndex, this.filters[filterIndex].filterItems[filterItemIndex].val)
      }
      var filterCount = 0
      for (let f in this.filterKeys) {
        if (this.filterKeys[f]) {
          filterCount++
        }
      }
      if (filterCount > 0) {
        this.hasFilter = true
      } else {
        this.hasFilter = false
      }
      this.searchData(this.searchVal.trim())
    },
    deleteSelectFilter (event, filterValIndex) {
      this.$set(this.filterKeys, filterValIndex, undefined)
      this.$set(this.filterVals, filterValIndex, undefined)
      var filterCount = 0
      for (let f in this.filterKeys) {
        if (this.filterKeys[f]) {
          filterCount++
        }
      }
      if (filterCount > 0) {
        this.hasFilter = true
      } else {
        this.hasFilter = false
      }
      this.searchData(this.searchVal.trim())
    },
    dataItemTouchStart (dataIndex, doCount) {
      this.$refs['data-item-wrap-' + dataIndex][0].getElementsByClassName('data-wrap')[0].style['transition-duration'] = '0s'
      this.dataItemMoveStartX = event.touches[0].pageX
      if (event.target.classList.contains('btn-follow')) {
        this.$call('callPhone', this.datas[dataIndex]['mobile'])
      } else {
        clearInterval(this.holdTimer)
        this.holdTimer = setInterval(() => {
          this.holdTime++
          if (this.holdTime > 60) {
            clearInterval(this.holdTimer)
            this.holdTime = 0
            this.$call('skipPage', JSON.stringify({
              path: 'app-client-follow-detail',
              title: '潜客详情',
              titleDos: [
                {
                  event: 'client-follow-detail-edit',
                  txt: '编辑'
                }
              ],
              titleBarColor: '#1F6FC8',
              statusBarStyle: 'highlight',
              fullPage: false,
              pageParams: {
                dataId: this.datas[dataIndex]['id']
              }
            }))
          }
        }, 10)
      }
    },
    dataItemTouchMove (dataIndex, doCount) {
      clearInterval(this.holdTimer)
      if (this.dataItemMoveStartX < 0) {
        this.dataItemMoveStartX = event.touches[0].pageX
      }
      this.dataItemMoveDistance = event.touches[0].pageX - this.dataItemMoveStartX
      if (this.$refs['data-item-wrap-' + dataIndex][0].classList.contains('open')) {
        this.dataItemMoveDistance += -doCount * 5 * 16
      }
      if (this.dataItemMoveDistance > 0) {
        this.dataItemMoveDistance = 0
      } else if (this.dataItemMoveDistance < (-doCount * 5 * 16)) {
        this.dataItemMoveDistance = -doCount * 5 * 16
      }
      this.$refs['data-item-wrap-' + dataIndex][0].getElementsByClassName('data-wrap')[0].style.transform = `translateX(${this.dataItemMoveDistance}px)`
    },
    dataItemTouchEnd (dataIndex, doCount) {
      this.$refs['data-item-wrap-' + dataIndex][0].getElementsByClassName('data-wrap')[0].style['transition-duration'] = '0.2s'
      if (Math.abs(this.dataItemMoveDistance) > 3 * 16) {
        this.$refs['data-item-wrap-' + dataIndex][0].getElementsByClassName('data-wrap')[0].style.transform = `translateX(${-doCount * 5 * 16}px)`
        this.$refs['data-item-wrap-' + dataIndex][0].classList.add('open')
      } else {
        this.$refs['data-item-wrap-' + dataIndex][0].getElementsByClassName('data-wrap')[0].style.transform = `translateX(0px)`
        this.$refs['data-item-wrap-' + dataIndex][0].classList.remove('open')
      }
      this.dataItemMoveStartX = -1
      this.dataItemMoveDistance = -1
    },
    searchData (searchVal) {
      var searchParams = {}
      searchParams['createBy'] = this.$moment.userInfo.user.id
      if (searchVal !== '') {
        searchParams['phoneOrName'] = searchVal
      }
      if (this.filterKeys[0]) {
        searchParams['custoLevel'] = this.filterKeys[0]
      }
      if (this.filterKeys[1]) {
        var searchDateSE = this.filterKeys[1].split(',')
        searchParams['startTime'] = searchDateSE[1]
        searchParams['endTime'] = searchDateSE[2]
      }
      this.$comfun.http_post(this, this.$moment.appServer + 'customerManager/searchByBsSubCusto', searchParams).then((response) => {
        this.datas = []
        if (response.body.code === 1 && response.body.totals && response.body.totals > 0) {
          for (let c = 0; c < response.body.list.length; c++) {
            this.datas.push({
              id: response.body.list[c].scId,
              userName: response.body.list[c].custoName,
              mobile: response.body.list[c].mobile,
              dos: [ 'delete' ]
            })
          }
        }
      })
    }
  },
  watch: {
    searchVal (val, old) {
      this.searchData(val.trim())
    }
  }
}
</script>

<style lang="scss" scoped>
.page-client-follow {
  position: relative;
  background-color: #f5f5f5;
  height: 100vh;
  overflow: hidden;
  .header-wrap {
    position: relative;
    height: 6rem;
    background-color: #ffffff;
    .search-panl-wrap {
      position: relative;
      background-color: #f5f5f5;
      padding: 0.6rem 1rem;
      z-index: 9;
      .search-wrap {
        position: relative;
        font-size: 0;
        i {
          position: absolute;
          z-index: 9;
          top: 0.58rem;
          left: 0.64rem;
          font-size: 0.9rem;
          color: #cacaca;
        }
        input {
          position: relative;
          width: calc(100% - 0.6rem - 2.2rem);
          padding: 0.6rem 0.6rem 0.6em 2.2rem;
          font-size: 0.9rem;
          z-index: 8;
          border: none;
          outline: none;
          vertical-align: middle;
          background-color: #ffffff;
          border-radius: 6px;
        }
      }
    }
    .filter-panl-wrap {
      position: relative;
      background-color: #ffffff;
      z-index: 9;
      span {
        position: relative;
        display: inline-block;
        text-align: center;
        padding: 1rem 0;
        font-size: 0.8rem;
        color: #818181;
        i {
          position: relative;
          display: inline-block;
          font-size: 0.6rem;
          margin-left: 0.4rem;
          color: #818181;
          vertical-align: middle;
          transition: all 0.3s ease 0s;
          transform-origin: center 42% 0;
          pointer-events: none;
        }
      }
      .filter-open {
        color: #0090e4;
        i {
          color: #0090e4;
          transform: rotate(180deg);
        }
      }
    }
    .filter-content-item-shade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 2;
      background-color: rgba(30, 30, 30, .4);
      display: none;
    }
    .shade-show {
      display: block;
    }
    .filter-content-item-wrap {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #ffffff;
      opacity: 0;
      z-index: 3;
      span {
        position: relative;
        display: block;
        padding: 0.9rem 1rem;
        font-size: 0.8rem;
        color: #353535;
        i.des {
          position: relative;
          font-style: normal;
          font-size: 0.8rem;
          color: #818181;
          transition: all 0.3s ease 0s;
          pointer-events: none;
        }
        i.is-select {
          position: absolute;
          right: 1.6rem;
          color: #52a4d3;
          display: none;
          transition: all 0.3s ease 0s;
          pointer-events: none;
        }
      }
      span:nth-of-type(n + 2)::before {
        content: '';
        position: absolute;
        left: 1rem;
        right: 1rem;
        top: -0.1rem;
        border-top: 1px solid #f7f7f7;
      }
      .filter-select-item {
        color: #0090e4;
        i.des {
          color: #52a4d3;
        }
        i.is-select {
          display: inline-block;
        }
      }
    }
    .filter-content-open {
      opacity: 1;
    }
    .filter-content-open-0 {
      transform: translateY(100.6%);
    }
    .filter-content-open-1 {
      transform: translateY(100.6%);
    }
  }
  .header-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.2rem;
    border-bottom: 1px solid #ebebeb;
    z-index: 9;
  }
  .filter-select-wrap {
    position: relative;
    background-color: #f6fdfd;
    padding: 0 0.8rem;
    margin-top: -0.4rem;
    margin-bottom: -0.3rem;
    span {
      position: relative;
      display: inline-block;
      margin: 1.1rem 0.6rem 0.6rem 0;
      font-size: 0.7rem;
      color: #ffffff;
      padding: 0.2rem 1.4rem 0.2rem 0.5rem;
      border: 1px solid #52a4d3;
      background-color: #52a4d3;
      border-radius: 4px;
      i.filter-select-delete {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        font-size: 0.8rem;
        color: #ffffff;
      }
    }
  }
  .data-items-wrap {
    position: relative;
    height: calc(100% - 6.2rem);
    margin-top: 0rem;
    padding: 0.1rem 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .data-item-wrap {
      position: relative;
      height: 9.6rem;
      background-color: #ffffff;
      .do-wrap {
        position: absolute;
        display: inline-block;
        top: 0;
        right: 0;
        height: 100%;
        padding: 0.2rem 0;
        background-color: #fd4646;
        color: #ffffff;
        font-size: 0.8rem;
        span {
          display: inline-block;
          width: 5rem;
          height: 100%;
          line-height: 9.6rem;
          text-align: center;
        }
      }
      .data-wrap {
        position: relative;
        height: calc(100% - 0.78rem);
        padding: 0.6rem 0.8rem;
        font-size: 0.8rem;
        transition: all 0.2s ease 0s;
        background-color: #f7f7f7;
        .data-head-wrap {
          position: relative;
          padding: 1rem 0 0.9rem;
          background-color: #ffffff;
          div.left-title {
            position: relative;
            display: inline-block;
          }
          span.user-name {
            position: relative;
            display: inline-block;
            font-size: 1.1rem;
            color: #2c2c2c;
            pointer-events: none;
          }
          span.btn-follow {
            position: relative;
            display: inline-block;
            font-size: 0.8rem;
            color: #0165d8;
            margin-left: 0.8rem;
            i {
              position: relative;
              display: inline-block;
              font-size: 0.8rem;
              margin-left: 0.4rem;
              color: rgb(168, 168, 168);
              pointer-events: none;
            }
            i:first-of-type {
              margin-right: 0.2rem;
              color: #0165d8;
            }
          }
          i {
            color: rgb(168, 168, 168);
          }
        }
        .data-head-wrap::after {
          content: '';
          position: absolute;
          left: 0.3rem;
          right: 0.3rem;
          bottom: 0;
          border-bottom: 1px solid #e9e9e9;
        }
        .data-content-wrap {
          position: relative;
          padding: 1.2rem 0;
          pointer-events: none;
          div {
            position: relative;
            span {
              display: block;
            }
            span:nth-of-type(1) {
              font-size: 0.7rem;
              color: #818181;
              margin-bottom: 1rem;
            }
            span:nth-of-type(2) {
              font-size: 1rem;
              color: #303030;
            }
          }
          div:nth-of-type(1) {
            text-align: left;
          }
          div:nth-of-type(2) {
            text-align: center;
          }
          div:nth-of-type(3) {
            text-align: right;
          }
        }
      }
    }
    .data-item-wrap:nth-of-type(n + 2)::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      border-top: 1px solid #e9e9e9;
    }
  }
  .data-items-wrap-has-filter {
    height: calc(100% - 8.5rem);
  }
}

input::-webkit-input-placeholder { /* WebKit browsers */
  color: #c6c6c6;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #c6c6c6;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #c6c6c6;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
}
input:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #c6c6c6;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
