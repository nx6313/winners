<template>
  <div class="page-user-list">
    <div class="search-wrap">
      <i class="iconfont icon-fdj"></i>
      <input type="text" placeholder="请输入姓名查询" v-model="searchVal">
    </div>
    <div class="users-list-wrap" @scroll="scrollPage" v-show="!showSearchPanel">
      <div class="users-group-item close" v-for="(group, groupIndex) in userList" :key="groupIndex">
        <div class="group-info-wrap" ref="group-info-wrap" @click="toggleItem(group, groupIndex)">
          <i class="toggle-status"></i>
          <span class="group-name">{{group.groupName}}</span>
        </div>
        <div class="group-users-wrap" :style="{ 'height': `calc(4rem * ${group.users.length})` }">
          <div class="user-item" v-for="(user, userIndex) in group.users" :key="userIndex">
            <i class="user-head" :style="user.userHead ? { 'background-image': `url(${user.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></i>
            <div class="user-info">
              <span class="user-name">{{user.userName}}</span>
              <span class="user-duty">{{user.userDuty}}</span>
            </div>
            <div class="user-level">
              <i :class="['star', starIndex < user.level ? 'has-star' : '']" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
            </div>
            <i class="user-call iconfont icon-dianhua" @click="call(user.phone)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result-wrap" v-show="showSearchPanel">
      <div class="user-item" v-for="(searchUser, searchUserIndex) in searchUserList" :key="searchUserIndex">
        <i class="user-head" :style="searchUser.userHead ? { 'background-image': `url(${searchUser.userHead})` } : { 'background-image': `url(${defaultUserHead})` }"></i>
        <div class="user-info">
          <span class="user-name">{{searchUser.userName}}</span>
          <span class="user-duty">{{searchUser.factory}}&nbsp;&nbsp;{{searchUser.userDuty}}</span>
        </div>
        <div class="user-level">
          <i :class="['star', starIndex < searchUser.level ? 'has-star' : '']" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
        </div>
        <i class="user-call iconfont icon-dianhua" @click="call(searchUser.phone)"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
      starCount: 5,
      defaultUserHead: require('@/assets/default-head.png'),
      searchTimer: null,
      searchVal: '',
      showSearchPanel: false,
      searchUserList: [],
      userList: []
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.userList = [
      {
        groupId: '',
        groupName: '一厂',
        users: [
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          },
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          }
        ]
      },
      {
        groupId: '',
        groupName: '二厂',
        users: [
          {
            userId: '',
            userHead: '',
            userDuty: '销售顾问',
            userName: '刘德华',
            phone: '15555555555',
            level: 3
          }
        ]
      }
    ]
  },
  methods: {
    toggleItem (group, groupIndex) {
      if (event.target.parentNode.classList.contains('open')) {
        event.target.parentNode.classList.remove('open')
        event.target.parentNode.classList.add('close')
      } else {
        event.target.parentNode.classList.remove('close')
        event.target.parentNode.classList.add('open')
      }
    },
    call (phone) {
      if (phone) {
        window.location.href = 'tel:' + phone
      } else {
        this.$dialog_msg({
          msg: '手机号未设置'
        })
      }
    },
    scrollPage () {
      var fixGroups = this.$refs['group-info-wrap']
      for (let g = 0; g < fixGroups.length; g++) {
        let groupScrollTop = fixGroups[g].offsetTop
        console.log(groupScrollTop)
      }
      // var pageScrollTop = document.querySelector('#page-home')
      // if (pageScrollTop > this.sellTabWrapScrollTop) {
      //   this.isFixed = true
      // } else {
      //   this.isFixed = false
      // }
    },
    search () {
      this.showSearchPanel = true
      this.searchUserList = [
        {
          userId: '',
          userHead: '',
          userDuty: '销售顾问',
          userName: '刘德华',
          phone: '15555555555',
          factory: '一厂',
          level: 3
        },
        {
          userId: '',
          userHead: '',
          userDuty: '销售顾问',
          userName: '刘德华',
          phone: '15555555555',
          factory: '四厂',
          level: 3
        }
      ]
    }
  },
  watch: {
    searchVal (newVal, oldVal) {
      if (newVal.trim() === '') {
        clearTimeout(this.searchTimer)
        this.showSearchPanel = false
      } else {
        if (newVal.trim() !== oldVal.trim()) {
          clearTimeout(this.searchTimer)
          this.searchTimer = setTimeout(() => {
            this.search()
          }, 600)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-list {
  position: relative;
  background-color: #F5F5F5;
  overflow: hidden;
  .search-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: calc(100% - 1.2rem);
    padding: 0.6rem 0.6rem;
    background-color: rgb(255, 255, 255);
    z-index: 99;
    i {
      position: absolute;
      display: inline-block;
      width: 1.4rem;
      height: 1.4rem;
      line-height: 1.4rem;
      top: 0.9rem;
      left: 1.3rem;
      z-index: 9;
      text-align: center;
      font-size: 1rem;
      color: #c6c6c6;
    }
    input {
      position: relative;
      display: inline-block;
      border: none;
      background-color: #F5F5F5;
      width: calc(100% - 1rem - 2.4rem);
      border-radius: 10rem;
      padding: 0.5rem 1rem 0.5rem 2.4rem;
      font-size: 0.7rem;
      outline: none;
      font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #c6c6c6;
      font-size: 0.7rem;
      font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #c6c6c6;
      font-size: 0.7rem;
      font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #c6c6c6;
      font-size: 0.7rem;
      font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #c6c6c6;
      font-size: 0.7rem;
      font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
    }
  }
  .users-list-wrap {
    position: relative;
    margin-top: 3.8rem;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 3.8rem);
    -webkit-overflow-scrolling: touch;
    .users-group-item {
      position: relative;
      background-color: rgb(255, 255, 255);
      .group-info-wrap {
        position: relative;
        padding: 0.9rem 0.8rem;
        i.toggle-status {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          left: 0.9rem;
          display: inline-block;
          width: 1.4rem;
          height: 1.4rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: auto 100%;
          background-image: url('./../assets/item-arrow.png');
          transition: all 0.4s ease 0s;
          pointer-events: none;
        }
        span.group-name {
          position: relative;
          margin-left: 2rem;
          color: #333333;
          font-size: 0.9rem;
          pointer-events: none;
        }
      }
      .group-users-wrap {
        position: relative;
        transition: all 0.4s ease 0s;
        overflow: hidden;
        background-color: rgb(255, 255, 255);
        .user-item {
          position: relative;
          height: 4rem;
          line-height: 4rem;
          padding: 0 0.8rem;
          i.user-head {
            position: relative;
            display: inline-block;
            width: 2.6rem;
            height: 2.6rem;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 0.6rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: auto 100%;
            pointer-events: none;
          }
          div.user-info {
            position: relative;
            display: inline-block;
            pointer-events: none;
            span.user-name {
              position: relative;
              display: inline-block;
              font-size: 0.9rem;
              color: #3a3a3a;
              top: -0.4rem;
            }
            span.user-duty {
              position: absolute;
              width: 8rem;
              display: inline-block;
              font-size: 0.7rem;
              color: #a5a5a5;
              top: 0.8rem;
            }
          }
          div.user-level {
            position: absolute;
            display: inline-block;
            top: 0;
            bottom: 0;
            margin: auto 0;
            left: 9.2rem;
            pointer-events: none;
            i.star {
              position: relative;
              display: inline-block;
              vertical-align: middle;
              width: 0.8rem;
              height: 0.8rem;
              background-image: url('./../assets/star-2.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100% auto;
            }
            i.star:nth-of-type(n + 2) {
              margin-left: 0.3rem;
            }
            i.has-star {
              width: 0.83rem;
              background-image: url('./../assets/star-1.png');
            }
          }
          i.user-call {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto 0;
            right: 0.6rem;
            display: inline-block;
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            color: #b3cdec;
            font-size: 1.2rem;
            -webkit-tap-highlight-color: transparent;
          }
        }
        .user-item:nth-of-type(n + 2)::after {
          content: '';
          position: absolute;
          left: 0.8rem;
          right: 0.8rem;
          top: 0;
          border-top: 0.06rem solid rgba(235, 235, 235, 0.2);
        }
      }
    }
    .close {
      i.toggle-status {
        transform: rotate(0deg);
      }
      .group-users-wrap {
        height: 0px !important;
      }
    }
    .open {
      i.toggle-status {
        transform: rotate(90deg);
      }
    }
  }
  .search-result-wrap {
    position: relative;
    margin-top: 3.8rem;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 3.8rem);
    -webkit-overflow-scrolling: touch;
    .user-item {
      position: relative;
      height: 4rem;
      line-height: 4rem;
      padding: 0 0.8rem;
      background-color: rgb(255, 255, 255);
      i.user-head {
        position: relative;
        display: inline-block;
        width: 2.6rem;
        height: 2.6rem;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 0.6rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 100%;
        pointer-events: none;
      }
      div.user-info {
        position: relative;
        display: inline-block;
        pointer-events: none;
        span.user-name {
          position: relative;
          display: inline-block;
          font-size: 0.9rem;
          color: #3a3a3a;
          top: -0.4rem;
        }
        span.user-duty {
          position: absolute;
          width: 8rem;
          display: inline-block;
          font-size: 0.7rem;
          color: #a5a5a5;
          top: 0.8rem;
        }
      }
      div.user-level {
        position: absolute;
        display: inline-block;
        top: 0;
        bottom: 0;
        margin: auto 0;
        left: 9.2rem;
        top: -0.5rem;
        pointer-events: none;
        i.star {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 0.8rem;
          height: 0.8rem;
          background-image: url('./../assets/star-2.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
        }
        i.star:nth-of-type(n + 2) {
          margin-left: 0.3rem;
        }
        i.has-star {
          width: 0.83rem;
          background-image: url('./../assets/star-1.png');
        }
      }
      i.user-call {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        right: 0.6rem;
        display: inline-block;
        width: 2rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        color: #b3cdec;
        font-size: 1.2rem;
        -webkit-tap-highlight-color: transparent;
      }
    }
    .user-item:nth-of-type(n + 2)::after {
      content: '';
      position: absolute;
      left: 0.8rem;
      right: 0.8rem;
      top: 0;
      border-top: 0.06rem solid rgba(235, 235, 235, 0.2);
    }
  }
}
</style>
