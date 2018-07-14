<template>
  <div class="page-user-list">
    <div class="search-wrap">
      <i class="iconfont icon-fdj"></i>
      <input type="text" placeholder="请输入姓名查询" v-model="searchVal">
    </div>
    <div class="users-list-wrap" v-show="!showSearchPanel">
      <div class="users-group-item close" v-for="(group, groupIndex) in userList" :key="groupIndex">
        <div class="group-info-wrap" ref="group-info-wrap" @click="toggleItem(group, groupIndex)">
          <i class="toggle-status"></i>
          <span class="group-name">{{group.groupName}}</span>
          <span class="group-user-size" v-show="group.users.length > 0">{{group.users.length}} 人</span>
          <span class="group-user-loading finish-loading"></span>
        </div>
        <div class="group-users-wrap" ref="group-users-wrap" :style="{ 'height': `calc(4rem * ${group.users.length})` }">
          <div class="user-item" v-for="(user, userIndex) in group.users" :key="userIndex" v-if="group.show" @click="toSellPage(user)">
            <i :class="['user-head', user.userHead !== '' ? 'has-head' : '']">
              <i :style="user.userHead ? { 'background-image': `url(${user.userHead})` } : { 'background-image': `url(${defaultUserHead})` }">
                <span class="user-name-for-head" v-if="!user.userHead">{{user.userName.substr(user.userName.trim().length - 2)}}</span>
              </i>
            </i>
            <div class="user-info">
              <span class="user-name">{{user.userName.trim()}}</span>
              <span class="user-duty">{{user.userDuty}}</span>
            </div>
            <div class="user-level">
              <i :class="['star', starIndex < user.level ? 'has-star' : '']" v-for="(star, starIndex) in starCount" :key="starIndex"></i>
            </div>
            <i class="user-call iconfont icon-dianhua" @click.stop="call(user.phone)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result-wrap" v-show="showSearchPanel">
      <div class="user-item" v-for="(searchUser, searchUserIndex) in searchUserList" :key="searchUserIndex">
        <i :class="['user-head', searchUser.userHead !== '' ? 'has-head' : '']">
          <i :style="searchUser.userHead ? { 'background-image': `url(${searchUser.userHead})` } : { 'background-image': `url(${defaultUserHead})` }">
            <span class="user-name-for-head" v-if="!searchUser.userHead">{{searchUser.userName.substr(searchUser.userName.trim().length - 2)}}</span>
          </i>
        </i>
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
      defaultUserHead: '',
      searchTimer: null,
      searchVal: '',
      showSearchPanel: false,
      searchUserList: [],
      userList: []
    }
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'flex'
    this.defaultUserHead = this.$moment.defaultHead

    this.$comfun.http_post(this, `data/public/query/company`).then((company) => {
      if (company.body.success === '1') {
        for (let c = 0; c < company.body.result.length; c++) {
          this.userList.push({
            groupId: company.body.result[c].id,
            head: '',
            groupName: company.body.result[c].name,
            users: [],
            show: true,
            closeTimer: null
          })
        }
      }
    })
  },
  methods: {
    toggleItem (group, groupIndex) {
      var targetParent = event.target.parentNode
      if (targetParent.classList.contains('open')) {
        targetParent.classList.remove('open')
        targetParent.classList.add('close')
        group.closeTimer = setTimeout(() => {
          group.show = false
        }, 402)
      } else {
        clearTimeout(group.closeTimer)
        group.show = true
        this.getCompanyData(group.groupId, groupIndex, () => {
          targetParent.classList.remove('close')
          targetParent.classList.add('open')
        })
      }
    },
    getCompanyData (groupId, groupIndex, callBack) {
      var groupItem = this.$refs['group-info-wrap'][groupIndex]
      var groupUserLoading = groupItem.getElementsByClassName('group-user-loading')[0]
      groupUserLoading.classList.remove('finish-loading')
      this.$comfun.http_post(this, `data/public/query/consultant/${groupId}`).then((response) => {
        setTimeout(() => {
          groupUserLoading.classList.add('finish-loading')
        }, 300)
        if (response.body.success === '1') {
          let users = []
          for (let u = 0; u < response.body.result.length; u++) {
            users.push({
              userId: response.body.result[u].id,
              userHead: response.body.result[u].photo ? this.$moment.HttpAddress_1 + `showFile/${response.body.result[u].photo}` : '',
              userDuty: response.body.result[u].dutyName || '职位未设置',
              userName: response.body.result[u].name,
              phone: response.body.result[u].phone,
              level: 3
            })
          }
          this.userList[groupIndex].users = users
          if (callBack) {
            callBack()
          }
        } else {
          this.$dialog_msg({
            msg: '该厂未录入员工数据'
          })
        }
      })
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
    search (searchVal) {
      this.searchUserList.splice(0, this.searchUserList.length)
      this.$comfun.http_post(this, 'data/senior/query/consultant', {
        name: searchVal
      }).then((response) => {
        if (response.body.success === '1') {
          this.showSearchPanel = true
          for (let u = 0; u < response.body.result.length; u++) {
            this.searchUserList.push({
              userId: response.body.result[u].id,
              userHead: response.body.result[u].photo ? this.$moment.HttpAddress_1 + `showFile/${response.body.result[u].photo}` : '',
              userDuty: response.body.result[u].dutyName,
              userName: response.body.result[u].name,
              phone: response.body.result[u].phone,
              factory: response.body.result[u].companyName,
              level: 3
            })
          }
        } else {
          this.$dialog_msg({
            msg: '销售员查询失败'
          })
        }
      })
    },
    toSellPage (userInfo) {
      this.$router.push(`/sell-data/${userInfo.userId}`)
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
            this.search(newVal.trim())
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
          background-size: 100% auto;
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
        span.group-user-size {
          position: absolute;
          right: 1.4rem;
          color: #797979;
          font-size: 0.6rem;
          pointer-events: none;
        }
        span.group-user-loading {
          position: absolute;
          right: 3.2rem;
          display: inline-block;
          width: 1.8rem;
          height: 1.8rem;
          top: 0;
          bottom: 0;
          margin: auto 0;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% auto;
          background-image: url('./../assets/user-loading.gif');
          pointer-events: none;
        }
        span.finish-loading {
          display: none;
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
            background-color: #7daffa;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% auto;
            pointer-events: none;
            overflow: hidden;
            z-index: 2;
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
          i.has-head {
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
        background-color: #7daffa;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
        pointer-events: none;
        overflow: hidden;
        z-index: 2;
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
        }
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
      i.has-head {
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
