<template>
  <div class="page-login">
    <div class="login-wrap">
      <div class="form-item-wrap">
        <input type="text" placeholder="输入手机号" v-model="userPhone">
      </div>
      <div class="form-item-wrap">
        <input type="password" placeholder="输入密码" autocomplete="off" v-model="userPwd">
      </div>
      <div class="form-btn-wrap">
        <button class="btn-sure" @click="login">登陆</button>
      </div>
    </div>
    <canvas id="smokeCanvas" width="1008" height="1000"></canvas>
  </div>
</template>

<script>
import '@/plugins/canvas/smoke.js'

export default {
  name: 'Login',
  data () {
    return {
      userPhone: '',
      userPwd: ''
    }
  },
  beforeCreate () {
  },
  mounted () {
    document.querySelector('#app-footer').style.display = 'none'
    this.$moment.localforage.getItem('userLoginInfo').then((loginInfo) => {
      if (loginInfo) {
        if (Date.now() - loginInfo.loginDate.getTime() < 1 * 24 * 60 * 60 * 1000) {
          this.userPhone = loginInfo.user.phone
          // this.userPwd = loginInfo.user.password || ''
        } else {
          this.$moment.localforage.removeItem('userLoginInfo')
        }
      }
    })
  },
  methods: {
    login () {
      if (!this.$comfun.isNotNull(this.userPhone)) {
        this.$dialog_msg({
          msg: '登陆手机号不能为空'
        })
        return false
      }
      if (!this.$comfun.isNotNull(this.userPwd)) {
        this.$dialog_msg({
          msg: '登陆密码不能为空'
        })
        return false
      }
      this.$dialog_loading({
        tip: '登陆中，请稍后...'
      })
      this.$comfun.http_post(this, 'login', {
        phone: this.userPhone.trim(),
        password: this.userPwd.trim()
      }).then((response) => {
        if (response.body.success === '1') {
          this.$moment.localforage.setItem('userLoginInfo', {
            loginDate: new Date(),
            basedate: new Date(response.body.basedate),
            user: response.body.user
          })
          if (Number(response.body.user.grade) === 1) { // 个人
            this.$router.replace('/home')
          } else if (Number(response.body.user.grade) === 2) { // 公司
            this.$router.replace('/home-manager')
          } else if (Number(response.body.user.grade) === 3) { // 集团
            this.$router.replace('/home')
          }
        } else {
          this.$dialog_msg({
            msg: '登陆失败'
          })
        }
      })
    }
  },
  destroyed () {
    this.$cvs_fire_remove()
  }
}
</script>

<style scoped>
.router-view-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.page-login {
  position: relative;
  background-image: url('./../assets/login-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.login-wrap {
  position: absolute;
  top: calc((100% - 9.6rem) / 2);
  left: 10vw;
  width: 80vw;
  height: 9.6rem;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 0.4rem;
  padding: 1.2rem 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}

.login-wrap > .form-item-wrap {
  position: relative;
  text-align: center;
}

.login-wrap > .form-item-wrap:nth-of-type(n + 2) {
  margin-top: 0.6rem;
}

.login-wrap > .form-item-wrap > input {
  position: relative;
  outline: none;
  width: calc(100% - 1.6rem - 2rem);
  padding: 0.6rem 0.8rem;
  background-color: rgba(214, 214, 214, 0.5);
  border: none;
  border-radius: 0px;
  font-size: 0.8rem;
  color: #181818;
}

.login-wrap > .form-item-wrap > input::-webkit-input-placeholder { /* WebKit browsers */
  color: rgb(49, 49, 49);
}
.login-wrap > .form-item-wrap > input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: rgb(49, 49, 49);
}
.login-wrap > .form-item-wrap > input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: rgb(49, 49, 49);
}
.login-wrap > .form-item-wrap > input:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: rgb(49, 49, 49);
}

.login-wrap > .form-btn-wrap {
  position: relative;
  text-align: center;
  margin-top: 1.6rem;
  width: 100%;
}

.login-wrap > .form-btn-wrap > button {
  position: relative;
  outline: none;
  width: calc(100% - 2rem);
  padding: 0.8rem 0;
  background-color: rgba(16, 93, 180, 0.9);
  border: none;
  border-radius: 0px;
  font-size: 0.8rem;
  color: #ececec;
  font-weight: bold;
  letter-spacing: 20px;
  text-indent: 20px;
}

.login-wrap > .form-btn-wrap > button:active {
  background-color: rgba(35, 90, 153, 0.9);
}

.login-wrap::before {
  content: '';
  position: absolute;
  top: -20rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 46vw;
  height: 20rem;
  background-image: url('./../assets/login-logo.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom;
}

#smokeCanvas {
  width: 100%;
  height: 100%;
}
</style>
