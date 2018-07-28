<template>
  <div class="page-client-in">
    <div v-for="(formBlock, formBlockIndex) in formItems" :key="formBlockIndex" class="form-block-wrap">
      <div v-if="formBlock.title" class="form-block-title">
        <span>{{formBlock.title}}</span>
      </div>
      <div v-if="formBlock.items && formBlock.items.length > 0" class="form-block-items-wrap">
        <div v-for="(item, itemIndex) in formBlock.items" :key="itemIndex" class="form-item-wrap">
          <template v-if="item.type === 'input'">
            <div class="form-item-input-wrap">
              <div :class="['tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}}</div>
              <input type="text" name="" :placeholder="item.inputing === true ? item.placeholder : ''" v-model="item.model" @click="inputClick($event, item.type, formBlockIndex, itemIndex)" @blur="inputBlur($event, formBlockIndex, itemIndex)">
            </div>
          </template>
          <template v-if="item.type === 'number'">
            <div class="form-item-input-wrap">
              <div :class="['tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}}</div>
              <input type="text" name="" :placeholder="item.inputing === true ? item.placeholder : ''" v-model="item.model" @click="inputClick($event, item.type, formBlockIndex, itemIndex)" @blur="inputBlur($event, formBlockIndex, itemIndex)" @input="numberInput($event, item.type, formBlockIndex, itemIndex)" @afterpaste="numberInput($event, item.type, formBlockIndex, itemIndex)">
            </div>
          </template>
          <template v-if="item.type === 'picture'">
            <div class="form-item-input-wrap">
              <div :class="['tip', 'picture-tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}} <i :class="['tip-icon', 'iconfont', item.tipIcon !== undefined ? item.tipIcon : 'icon-img']"></i> </div>
              <div class="picture-select-wrap">
                <div class="picture-content-wrap">
                  <i class="picture-selected" v-for="(pic, picIndex) in item.model" :key="picIndex" :style="{ 'background-image': `url(${pic})` }"><i class="picture-selected-delete iconfont icon-delete"></i></i>
                  <i :class="['picture-add-btn', item.model.length > 0 ? 'has-selected' : '']" v-if="item.model.length < item.max"></i>
                </div>
                <div class="picture-select-tip">{{item.placeholder}}</div>
              </div>
            </div>
          </template>
          <template v-if="item.length > 1">
            <div :class="['line-form-wrap', 'line-form-item-' + lineItemIndex]" :style="{ 'width': `calc(100% / ${item.length})` }" v-for="(lineItem, lineItemIndex) in item" :key="lineItemIndex">
              <template v-if="lineItem.type === 'input'">
                <div class="form-item-input-wrap">
                  <div :class="['tip', lineItem.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="lineItem.require === true" class="form-item-require">*</i>{{lineItem.tip}}</div>
                  <input type="text" name="" :placeholder="lineItem.inputing === true ? lineItem.placeholder : ''" v-model="lineItem.model" @click="inputClick($event, lineItem.type, formBlockIndex, itemIndex, lineItemIndex)" @blur="inputBlur($event, formBlockIndex, itemIndex, lineItemIndex)">
                </div>
              </template>
              <template v-if="lineItem.type === 'time'">
                <div class="form-item-input-wrap">
                  <div :class="['tip', 'time-tip', lineItem.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="lineItem.require === true" class="form-item-require">*</i>{{lineItem.tip}} <i :class="['tip-icon', 'iconfont', lineItem.tipIcon !== undefined ? lineItem.tipIcon : 'icon-time-s']"></i> </div>
                  <input type="text" name="" readonly :placeholder="lineItem.inputing === true ? lineItem.placeholder : ''" v-model="lineItem.model" @click="inputClick($event, lineItem.type, formBlockIndex, itemIndex, lineItemIndex)" @blur="inputBlur($event, formBlockIndex, itemIndex, lineItemIndex)">
                </div>
              </template>
            </div>
          </template>
          <template v-if="item.type === 'radio'">
            <div class="form-item-radio-wrap">
              <div :class="['tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}}</div>
              <div class="radio-wrap">
                <input type="hidden" v-model="item.model">
                <span v-for="(radio, radioIndex) in item.radios" :key="radioIndex" :class="['radio-ceil', 'radio-' + radioIndex]" @click="selectRadio($event, formBlockIndex, itemIndex, radioIndex)">{{radio.val}}</span>
              </div>
            </div>
          </template>
          <template v-if="item.type === 'checkbox'">
            <div class="form-item-radio-wrap">
              <div :class="['tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}}</div>
              <div class="radio-wrap">
                <input type="hidden" v-model="item.model">
                <span :class="['checkbox-ceil-wrap', item.model ? 'is-checked' : '']" @click="selectCheck($event, formBlockIndex, itemIndex)"><i class="checkbox-point"></i></span>
              </div>
            </div>
          </template>
          <template v-if="item.type === 'picker'">
            <div class="form-item-input-wrap">
              <div :class="['tip', item.require === true ? 'tip-require' : 'tip-no-require']"><i v-if="item.require === true" class="form-item-require">*</i>{{item.tip}}</div>
              <input type="text" name="" readonly :placeholder="item.inputing === true ? item.placeholder : ''" v-model="item.model" @click="inputClick($event, item.type, formBlockIndex, itemIndex)" @blur="inputBlur($event, formBlockIndex, itemIndex)">
              <i class="picker-to iconfont icon-right"></i>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppClientIn',
  data () {
    return {
      formItems: [
        {
          title: '客户详情',
          items: [
            {
              type: 'input',
              tip: '客户姓名',
              placeholder: '请输入',
              model: '',
              inputing: false,
              require: true
            },
            {
              type: 'radio',
              tip: '客户性别',
              model: '',
              require: true,
              radios: [
                {
                  key: 1,
                  val: '男'
                },
                {
                  key: 2,
                  val: '女'
                }
              ]
            },
            {
              type: 'number',
              tip: '手机号码',
              placeholder: '请输入',
              model: '',
              inputing: false,
              require: true
            },
            {
              type: 'picker',
              tip: '客户级别',
              placeholder: '请选择客户级别',
              model: '',
              inputing: false,
              require: true
            },
            {
              type: 'number',
              tip: '来访人数',
              placeholder: '请输入',
              model: '',
              inputing: false
            },
            [
              {
                type: 'time',
                tip: '来访时间',
                placeholder: '请选择来访时间',
                model: '',
                inputing: false
              },
              {
                type: 'time',
                tip: '离店时间',
                tipIcon: 'icon-time-e',
                placeholder: '请选择离店时间',
                model: '',
                inputing: false
              }
            ],
            {
              type: 'picture',
              tip: '上传客户照片',
              placeholder: '最多上传三张图',
              max: 3,
              model: ['http://www.wallcoo.com/flower/Amazing_Color_Flowers_2560x1600_III/wallpapers/2560x1600/Flowers_Wallpapers_91.jpg', 'http://img2.imgtn.bdimg.com/it/u=888348881,1176056835&fm=27&gp=0.jpg']
            }
          ]
        },
        {
          title: '购车信息',
          items: [
            {
              type: 'picker',
              tip: '意向车型',
              placeholder: '请选择意向车型',
              model: '',
              inputing: false
            },
            {
              type: 'input',
              tip: '竞品车型',
              placeholder: '请输入',
              model: '',
              inputing: false
            },
            {
              type: 'checkbox',
              tip: '是否试驾',
              model: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    inputClick (event, type, formBlockIndex, formItemIndex, lineItemIndex) {
      var clickItemData = this.formItems[formBlockIndex].items[formItemIndex]
      if (lineItemIndex !== undefined) {
        clickItemData = this.formItems[formBlockIndex].items[formItemIndex][lineItemIndex]
      }
      if (type === 'input') {
        if (clickItemData.inputing === false) {
          event.target.parentNode.getElementsByClassName('tip')[0].classList.add('tip-inputing')
          clickItemData.inputing = true
        }
      }
      if (type === 'number') {
        if (clickItemData.inputing === false) {
          event.target.parentNode.getElementsByClassName('tip')[0].classList.add('tip-inputing')
          clickItemData.inputing = true
        }
      }
      if (type === 'time') {
        if (clickItemData.inputing === false) {
          event.target.parentNode.getElementsByClassName('tip')[0].classList.add('tip-inputing')
          clickItemData.inputing = true
        }
      }
      if (type === 'picker') {
        if (clickItemData.inputing === false) {
          event.target.parentNode.getElementsByClassName('tip')[0].classList.add('tip-inputing')
          clickItemData.inputing = true
        }
      }
    },
    inputBlur (event, formBlockIndex, formItemIndex, lineItemIndex) {
      if (event.target.value.trim() === '') {
        var clickItemData = this.formItems[formBlockIndex].items[formItemIndex]
        if (lineItemIndex !== undefined) {
          clickItemData = this.formItems[formBlockIndex].items[formItemIndex][lineItemIndex]
        }
        clickItemData.inputing = false
        event.target.value = ''
        event.target.parentNode.getElementsByClassName('tip')[0].classList.remove('tip-inputing')
      }
    },
    selectRadio (event, formBlockIndex, formItemIndex, radioIndex, lineItemIndex) {
      var clickItemData = this.formItems[formBlockIndex].items[formItemIndex]
      if (lineItemIndex !== undefined) {
        clickItemData = this.formItems[formBlockIndex].items[formItemIndex][lineItemIndex]
      }
      var radios = event.target.parentNode.getElementsByClassName('radio-ceil')
      for (let i = 0; i < radios.length; i++) {
        radios[i].classList.remove('radio-ceil-select')
      }
      clickItemData.model = clickItemData.radios[radioIndex].key
      event.target.classList.add('radio-ceil-select')
    },
    selectCheck (event, formBlockIndex, formItemIndex, lineItemIndex) {
      var clickItemData = this.formItems[formBlockIndex].items[formItemIndex]
      if (lineItemIndex !== undefined) {
        clickItemData = this.formItems[formBlockIndex].items[formItemIndex][lineItemIndex]
      }
      clickItemData.model = !clickItemData.model
    },
    numberInput (event, type, formBlockIndex, formItemIndex, lineItemIndex) {
      this.inputClick(event, type, formBlockIndex, formItemIndex, lineItemIndex)
      var clickItemData = this.formItems[formBlockIndex].items[formItemIndex]
      if (lineItemIndex !== undefined) {
        clickItemData = this.formItems[formBlockIndex].items[formItemIndex][lineItemIndex]
      }
      clickItemData.model = event.target.value.replace(/\D/g, '').trim()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-client-in {
  position: relative;
  background-color: #F5F5F5;
  height: 100vh;
  .form-block-wrap {
    position: relative;
    .form-block-title {
      position: relative;
      background-color: #F5F5F5;
      font-size: 0.7rem;
      color: #6B6B6B;
      margin: 0.8rem 0 0.8rem 1.8rem;
    }
    .form-block-title::before {
      content: '';
      position: absolute;
      top: 0rem;
      bottom: 0rem;
      left: -0.8rem;
      width: 4px;
      background-color: rgb(27, 157, 233);
    }
    .form-block-items-wrap {
      position: relative;
      background-color: #FFFFFF;
      .form-item-wrap {
        position: relative;
        user-select: none;
        font-size: 0;
        .line-form-wrap {
          position: relative;
          font-size: 0;
          display: inline-block;
        }
        .form-item-input-wrap {
          position: relative;
          .tip {
            position: absolute;
            display: inline-block;
            width: calc(100% - 0.8rem);
            font-size: 0.9rem;
            color: rgb(68, 68, 68);
            vertical-align: middle;
            z-index: 9;
            margin-left: 0.8rem;
            margin-top: 0.4rem;
            top: 0.68rem;
            transition: all 0.3s ease 0s;
            transform-origin: left center 0;
            transform: scale(1, 1);
            pointer-events: none;
            .form-item-require {
              position: relative;
              display: inline-block;
              margin-right: 0.4rem;
              color: #f12020;
              font-style: normal;
              top: 0.22rem;
            }
            .tip-icon {
              position: relative;
              color: rgb(173, 173, 173);
              top: 0.06rem;
            }
          }
          .picture-tip {
            .tip-icon {
              position: absolute;
              color: rgb(173, 173, 173);
              top: 0.06rem;
              right: 1.6rem;
            }
          }
          .tip-no-require {
            margin-left: 1.6rem;
            width: calc(100% - 1.6rem);
          }
          .tip-inputing {
            transform: scale(0.7, 0.7);
            color: #0D69C9;
            top: 0rem;
            .tip-icon {
              color: #0D69C9;
            }
          }
          input {
            position: relative;
            display: inline-block;
            width: calc(100% - 2.8rem);
            border: none;
            z-index: 1;
            padding: 1rem 1.4rem 0.6rem;
            margin-top: 0.6rem;
            font-size: 0.8rem;
            outline: none;
          }
          .picture-select-wrap {
            position: relative;
            padding-top: 3.1rem;
            padding-left: 1.62rem;
            padding-right: 1.62rem;
            padding-bottom: 0.9rem;
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
            .picture-select-tip {
              position: relative;
              font-size: 0.6rem;
              color: rgb(168, 168, 168);
            }
          }
          .picker-to {
            position: absolute;
            display: inline-block;
            top: 1.16rem;
            right: 1.4rem;
            font-size: 0.9rem;
            color: rgb(204, 204, 204);
            pointer-events: none;
            z-index: 9;
          }
        }
        .form-item-radio-wrap {
          position: relative;
          .tip {
            position: absolute;
            display: inline-block;
            font-size: 0.9rem;
            color: rgb(68, 68, 68);
            vertical-align: middle;
            z-index: 9;
            margin-left: 0.8rem;
            margin-top: 0.4rem;
            top: 0.68rem;
            transition: all 0.3s ease 0s;
            transform-origin: left center 0;
            transform: scale(1, 1);
            pointer-events: none;
            .form-item-require {
              position: relative;
              display: inline-block;
              margin-right: 0.4rem;
              color: #f12020;
              font-style: normal;
              top: 0.22rem;
            }
          }
          .tip-no-require {
            margin-left: 1.6rem;
          }
          .radio-wrap {
            position: relative;
            height: 3.1rem;
            text-align: right;
            padding-right: 0.8rem;
            input {
              width: 50px;
            }
            .radio-ceil {
              position: relative;
              display: inline-block;
              top: calc((3.1rem - 2rem) / 2);
              height: 2rem;
              line-height: 2rem;
              font-size: 0.8rem;
              padding: 0.1rem 0.8rem 0 1.4rem;
              color: #a0a0a0;
              transition: all 0.3s ease 0s;
            }
            .radio-ceil:nth-of-type(n + 2) {
              margin-left: 0.4rem;
            }
            .radio-ceil::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              margin: auto 0;
              display: inline-block;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              border: 1px solid #a0a0a0;
              pointer-events: none;
            }
            .radio-ceil-select {
              color: #383838;
            }
            .radio-ceil-select::after {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              margin: auto 0;
              display: inline-block;
              width: calc(1rem - 6px);
              height: calc(1rem - 6px);
              border-radius: 50%;
              border: 4px solid #0095E8;
              pointer-events: none;
            }
            .checkbox-ceil-wrap {
              position: relative;
              display: inline-block;
              top: calc((3.1rem - 1.6rem) / 2);
              right: 0.4rem;
              width: 3rem;
              height: 1.6rem;
              border-radius: 50% / 1.6rem;
              font-size: 0.8rem;
              z-index: 1;
              border: 1px solid rgba(189, 189, 189, 0.6);
              box-shadow: inset 0 0 30px rgba(224, 224, 224, 0.2);
              transition: all 0.3s ease 0s;
              .checkbox-point {
                position: absolute;
                display: inline-block;
                top: -1px;
                left: 0;
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 50%;
                z-index: 9;
                background-color: #FFFFFF;
                border: 1px solid rgba(197, 197, 197, 0.6);
                box-shadow: inset 0 0 20px #FFFFFF;
                transition: all 0.3s ease 0s;
                transform: translateX(calc(0% - 1px));
              }
            }
            .is-checked {
              box-shadow: inset 0 0 30px rgb(23, 221, 122);
              .checkbox-point {
                transform: translateX(calc(100% - 5px));
              }
            }
          }
        }
      }
      .form-item-wrap:nth-of-type(n + 2)::before {
        content: '';
        position: absolute;
        left: 0.8rem;
        right: 0.8rem;
        top: 0rem;
        border-top: 1px solid rgba(212, 212, 212, 0.2);
        z-index: 9;
        pointer-events: none;
      }
    }
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
