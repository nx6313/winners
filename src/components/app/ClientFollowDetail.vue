<template>
  <div class="page-client-follow-detail" ref="page-client-follow-detail" @scroll="scrollPage">
    <div class="head-wrap flex-r flex-b">
      <i class="head-bg"></i>
      <div class="user-info-wrap">
        <span>{{clientName}}</span>
        <span>客户等级：{{clientLevel}}</span>
      </div>
      <i class="phone-call iconfont icon-phone" @click="call"></i>
    </div>
    <div class="tabs-wrap flex-r flex-a" :style="isFixed ? { 'position': `fixed`, 'top': '0px', 'left': '0px', 'z-index': 9 } : {}">
      <span :class="tabIndex === 0 ? 'cur' : ''" v-for="(tab, tabIndex) in tabs" :key="tabIndex" @click="toTab($event, tabIndex)">{{tab.title}}</span>
    </div>
    <div class="tabs-wrap-replace" ref="tabs-wrap-replace" v-show="isFixed"></div>
    <div class="content-rail-wrap">
      <transition name="fade" mode="out-in">
        <div class="page-item-wrap" v-for="(tab, tabIndex) in tabs" :key="tabIndex" v-if="curPage === tabIndex">
          <template v-if="tab.type === 'item'">
            <div class="page-item" v-for="(tabItem, tabItemIndex) in tab.items" :key="tabItemIndex">
              <span>{{tabItem.title}}</span>
              <span>{{tabItem.val}}</span>
            </div>
          </template>
          <template v-if="tab.type === 'time-follow'">
            <div class="page-time-follow-item-wrap">
              <div class="page-time-follow-item" v-for="(tabItem, tabItemIndex) in tab.items" :key="tabItemIndex">
                <div class="time-follow-wrap">
                  <span class="time" v-html="getTimeFollowTime(tabItem.time)"></span>
                  <i class="time-follow-point"></i>
                  <span class="title">{{tabItem.title ? tabItem.title : '~ 没写什么东西 ~'}}</span>
                  <span class="pics" v-if="tabItem.pics.length > 0">
                    <i v-for="(pic, picIndex) in tabItem.pics" :key="picIndex" :style="{ 'background-image': `url(${pic})` }"></i>
                  </span>
                  <span class="order-time" v-if="tabItem.orderTime">预约跟进时间：<span>{{tabItem.orderTime}}</span></span>
                </div>
              </div>
              <div class="page-time-follow-item">
                <div class="time-follow-wrap">
                  <span class="time" v-html="getTimeFollowTime('now')"></span>
                  <i class="time-follow-point"></i>
                  <textarea class="follow-content-write" placeholder="请输入本次跟进内容" v-model="followContent"></textarea>
                  <span class="select-order-time" @click="getFollowOrderTime">预约跟进时间<i class="iconfont icon-time-s"></i><span class="order-time-new" v-if="followOrderTime !== ''">{{followOrderTime}}</span></span>
                  <div class="picture-content-wrap">
                    <i class="picture-selected" v-for="(pic, picIndex) in followPics" :key="picIndex" :style="{ 'background-image': `url(${pic})` }"><i class="picture-selected-delete iconfont icon-delete" @click="deleteSelectPicture(picIndex)"></i></i>
                    <i :class="['picture-add-btn', followPics.length > 0 ? 'has-selected' : '']" v-if="followPics.length < followPicMax" @click="addPicture"></i>
                  </div>
                </div>
              </div>
              <i class="save-btn">保存</i>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppClientFollowDetail',
  data () {
    return {
      curPage: 0,
      isFixed: false,
      clientName: '~',
      clientLevel: '~',
      followContent: '',
      followOrderTime: '',
      followPics: [],
      followPicMax: 3,
      tabs: [
        {
          type: 'item',
          title: '客户信息',
          items: [
            {
              title: '手机号码',
              val: ''
            },
            {
              title: '客户性别',
              val: ''
            },
            {
              title: '接触方式',
              val: ''
            },
            {
              title: '来访人数',
              val: ''
            },
            {
              title: '来访时间',
              val: ''
            },
            {
              title: '离店时间',
              val: ''
            }
          ]
        },
        {
          type: 'item',
          title: '购车详情',
          items: [
            {
              title: '意向车型',
              val: ''
            },
            {
              title: '竞品车型',
              val: ''
            },
            {
              title: '是否试驾',
              val: ''
            },
            {
              title: '信息来源',
              val: ''
            },
            {
              title: '进店类型',
              val: ''
            },
            {
              title: '购车预算',
              val: ''
            },
            {
              title: '需求颜色',
              val: ''
            },
            {
              title: '客户描述',
              val: ''
            }
          ]
        },
        {
          type: 'time-follow',
          title: '跟进记录',
          items: [
            {
              time: '2018/07/24',
              title: '再看看，还没想好',
              pics: ['http://a5.topitme.com/o025/1002536708f56d0bfd.jpg', 'http://www.wallcoo.com/cartoon/David_Lanham_Illustration/wallpapers/1280x800/spacedoggy.jpg', 'http://www.cssxt.com/uploadfile/2017/1208/20171208110834538.jpg'],
              orderTime: '2018/07/25'
            },
            {
              time: '2018/07/24',
              title: '',
              pics: [],
              orderTime: '2018/07/25'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.$root.eventHub.$on('follow-order-time', (data) => {
      this.followOrderTime = this.$comfun.formatDate(new Date(Number(data)), 'yyyy-MM-dd hh:mm:ss')
    })
    this.$comfun.http_get(this, this.$moment.appServer + 'customerManager/findOne/' + this.$comfun.getRequest('dataId')).then((response) => {
      if (response.body) {
        this.clientName = response.body.custoName
        this.clientLevel = response.body.custoLevel

        this.tabs[0].items[0].val = response.body.mobile
        this.tabs[0].items[1].val = response.body.custoSex === 1 ? '男' : '女'
        this.tabs[0].items[2].val = response.body.mobile
        this.tabs[0].items[3].val = response.body.mobile
        this.tabs[0].items[4].val = response.body.mobile
        this.tabs[0].items[5].val = response.body.mobile

        this.tabs[1].items[0].val = response.body.mobile
        this.tabs[1].items[1].val = response.body.mobile
        this.tabs[1].items[2].val = response.body.mobile
        this.tabs[1].items[3].val = response.body.mobile
        this.tabs[1].items[4].val = response.body.mobile
        this.tabs[1].items[5].val = response.body.mobile
        this.tabs[1].items[6].val = response.body.mobile
        this.tabs[1].items[7].val = response.body.mobile
      }
    })
    this.$comfun.http_get(this, this.$moment.appServer + 'customerManager/findByScId/' + this.$comfun.getRequest('dataId')).then((response) => {})
  },
  methods: {
    scrollPage () {
      var pageScrollTop = this.$refs['page-client-follow-detail'].scrollTop
      if (pageScrollTop > 4.7 * 16) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    call () {
      if (this.tabs[0].items[2].val) {
        this.$call('callPhone', this.tabs[0].items[2].val)
      } else {
        this.$dialog_msg({
          msg: '客户手机号码存在问题，无法拨打'
        })
      }
    },
    toTab (event, index) {
      event.target.parentNode.getElementsByClassName('cur')[0].classList.remove('cur')
      event.target.classList.add('cur')
      this.curPage = index
    },
    getTimeFollowTime (time) {
      if (time === 'now') {
        return this.$comfun.formatDate(new Date(), 'M/d') + '<br><span style="font-size: 0.7rem; color: #B9B9B9;">' + this.$comfun.formatDate(new Date(), 'yyyy') + '</span>'
      }
      return this.$comfun.formatDate(new Date(time), 'M/d') + '<br><span style="font-size: 0.7rem; color: #B9B9B9;">' + this.$comfun.formatDate(new Date(time), 'yyyy') + '</span>'
    },
    getFollowOrderTime () {
      this.$call('pickerView', JSON.stringify({
        event: 'follow-order-time',
        type: 'time',
        title: '预约跟进时间'
      }))
    },
    deleteSelectPicture (picIndex) {
      this.followPics.splice(picIndex, 1)
    },
    addPicture () {
      this.$call('pickerView', JSON.stringify({
        event: 'follow-order-pic',
        type: 'picture',
        title: '',
        has: this.followPics.length,
        max: this.followPicMax
      }))
      // this.followPics.push('http://www.wallcoo.com/flower/Amazing_Color_Flowers_2560x1600_III/wallpapers/2560x1600/Flowers_Wallpapers_91.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
.page-client-follow-detail {
  position: relative;
  background-color: #f5f5f5;
  height: 100vh;
  .head-wrap {
    position: relative;
    background-color: #1F6FC8;
    padding: 1.2rem 0.9rem;
    overflow: hidden;
    .head-bg {
      position: absolute;
      display: inline-block;
      top: 0;
      right: -3rem;
      width: 80%;
      height: 100%;
      opacity: 0.4;
      background-image: url('./../../assets/client-detail-head-bg.png');
      background-size: cover;
      background-position: center 0.4rem;
      background-repeat: no-repeat;
    }
    .user-info-wrap {
      position: relative;
      span {
        position: relative;
        display: block;
        color: #ffffff;
        font-size: 1rem;
      }
      span:last-of-type {
        position: relative;
        margin-top: 0.4rem;
        font-size: 0.6rem;
        color: rgb(154, 195, 243);
      }
    }
    .phone-call {
      position: relative;
      font-size: 2rem;
      color: #fefefe;
    }
  }
  .tabs-wrap {
    position: relative;
    width: 100%;
    font-size: 0;
    background-color: #f5f5f5;
    span {
      position: relative;
      display: inline-block;
      text-align: center;
      font-size: 0.7rem;
      color: #8E8E8E;
      padding: 0.9rem 0;
    }
    .cur {
      color: #0C9AEA;
    }
    .cur::after {
      content: '';
      position: absolute;
      width: 2.8rem;
      height: 4px;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      background-color: #0C9AEA;
    }
  }
  .tabs-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #eeeeee;
  }
  .tabs-wrap-replace {
    position: relative;
    height: 2.7rem;
  }
  .content-rail-wrap {
    position: relative;
    div.page-item-wrap {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      background-color: #ffffff;
      padding: 0.6rem 0 0;
      .page-item {
        position: relative;
        padding: 0.8rem 1rem;
        font-size: 0.8rem;
        span:nth-of-type(1) {
          color: #8E8E8E;
        }
        span:nth-of-type(2) {
          color: rgb(53, 53, 53);
          margin-left: 1rem;
        }
      }
      .page-item:last-of-type {
        margin-bottom: 0.6rem;
      }
      .page-time-follow-item-wrap {
        position: relative;
        background-color: #F5F5F5;
        font-size: 0;
        padding-bottom: 1.4rem;
        .page-time-follow-item {
          position: relative;
          background-color: #ffffff;
          padding: 0.8rem 1rem;
          font-size: 0.8rem;
          .time-follow-wrap {
            position: relative;
            margin-left: 4.2rem;
            span {
              position: relative;
              display: block;
              margin-bottom: 0.8rem;
            }
            .time-follow-point {
              position: absolute;
              top: 0.1rem;
              left: -1.18rem;
              display: inline-block;
              width: 0.4rem;
              height: 0.4rem;
              background-color: #3AA9FF;
              border-radius: 50%;
            }
            .time-follow-point::before {
              content: '';
              position: absolute;
              top: calc(-0.05rem - 1px);
              left: calc(-0.05rem - 1px);
              display: inline-block;
              width: 0.5rem;
              height: 0.5rem;
              border: 1px solid rgb(84, 179, 252);
              border-radius: 50%;
              animation: halo 1s 0.2s infinite ease-out;
            }
            .time-follow-point::after {
              content: '';
              position: absolute;
              top: calc(-0.1rem - 1px);
              left: calc(-0.1rem - 1px);
              display: inline-block;
              width: 0.6rem;
              height: 0.6rem;
              border: 1px solid rgb(84, 179, 252);
              border-radius: 50%;
              animation: halo 1s 0.5s infinite ease-out;
            }
            .time {
              position: absolute;
              top: 0;
              left: -4rem;
              font-size: 1rem;
            }
            .title {
              position: relative;
              font-size: 0.9rem;
            }
            .pics {
              position: relative;
              i {
                position: relative;
                display: inline-block;
                width: 5rem;
                height: 5rem;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
              }
              i:nth-of-type(n + 2) {
                margin-left: 0.4rem;
              }
            }
            .order-time {
              position: relative;
              font-size: 0.6rem;
              color: #8E8E8E;
              span {
                display: inline;
                color: rgb(56, 56, 56);
              }
            }
            .follow-content-write {
              position: relative;
              display: block;
              width: calc(100% - 0.5rem - 1.6rem);
              resize: none;
              user-select: none;
              outline: none;
              border: none;
              background-color: rgb(241, 241, 241);
              padding: 0.6rem 0.8rem;
              height: 5rem;
              font-size: 0.8rem;
              margin-bottom: 0.8rem;
            }
            .select-order-time {
              position: relative;
              color: #8E8E8E;
              vertical-align: middle;
              font-size: 0.9rem;
              i {
                position: relative;
                vertical-align: middle;
                top: -0.14rem;
                margin-left: 0.4rem;
                font-size: 1.3rem;
                pointer-events: none;
              }
              .order-time-new {
                position: relative;
                display: inline;
                font-size: 0.6rem;
                margin-left: 0.2rem;
              }
            }
            .picture-content-wrap {
              position: relative;
              margin-top: 0.5rem;
              margin-bottom: 0.9rem;
              .picture-add-btn {
                position: relative;
                display: inline-block;
                width: 5rem;
                height: 5rem;
                background-image: url('./../../assets/add-pic.png');
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
              }
              .has-selected {
                margin-left: 0.8rem;
              }
              .picture-selected {
                position: relative;
                display: inline-block;
                width: 5rem;
                height: 5rem;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                z-index: 1;
                .picture-selected-delete {
                  position: absolute;
                  display: inline-block;
                  top: -0.5rem;
                  right: -0.3rem;
                  width: 1rem;
                  height: 1rem;
                  border-radius: 50%;
                  z-index: 9;
                  color: #0095E8;
                  background: #FFFFFF;
                  font-size: 1.1rem;
                }
              }
              .picture-selected:nth-of-type(n + 2) {
                margin-left: 0.8rem;
              }
            }
          }
          .time-follow-wrap::before {
            content: '';
            position: absolute;
            top: -0.8rem;
            bottom: -1.6rem;
            left: -1rem;
            border-left: 1px solid #e6e6e6;
          }
        }
        .page-time-follow-item:first-of-type {
          .time-follow-wrap::before {
            top: 0;
            bottom: -1.6rem;
          }
        }
        .page-time-follow-item:last-of-type {
          padding-bottom: 1.4rem;
          .time-follow-wrap::before {
            top: -1.6rem;
            bottom: -0.8rem;
          }
        }
        .save-btn {
          position: relative;
          display: block;
          background-color: #0C9AEA;
          font-style: normal;
          color: #ffffff;
          font-size: 0.9rem;
          text-align: center;
          padding: 0.6rem 0;
          margin: 1.4rem 1rem 0;
          border-radius: 3px;
          user-select: none;
        }
        .save-btn:active {
          background-color: rgb(15, 144, 219);
        }
      }
    }
  }
}

.fade-enter-active {
  transition: all .2s ease;
}
.fade-leave-active {
  transition: all .2s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
