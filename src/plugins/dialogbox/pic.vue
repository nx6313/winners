<template>
  <div v-if="isShow" id="dialog-pic-wrap" class="dialog-pic-wrap">
    <div class="pic-shade animated fadeIn" ref="pic-shade" @click="closePic"></div>
    <div class="pic-content animated slideInUp" ref="pic-content">
      <div class="select-pic-item-wrap">
        <div class="select-pic-item" v-for="(select, selectIndex) in selectPicWays" :key="selectIndex" @click="getPicByWay(select.id)">
          <span :style="{ 'color': select.color }">{{select.way}}</span>
        </div>
      </div>
      <div class="select-pic-cancle" @click="closePic">
        <span>取消</span>
      </div>
      <div class="select-way-file-inputs">
        <input v-if="clearShowcamera" id="pic-by-camera" ref="pic-by-camera" type="file" accept="image/*" capture="camcorder" @change="getPic('camera')">
        <input v-if="clearShowphotos" id="pic-by-photos" ref="pic-by-photos" type="file" accept="image/*" @change="getPic('photos')">
      </div>
    </div>
    <div class="pic-crop-wrap close animated" ref="pic-crop-wrap" @touchmove.prevent>
      <div class="crop-content-wrap">
        <img class="crop-target" ref="crop-target" :src="fileBase64" v-if="cropImg !== ''" @touchstart.prevent="cropTargetTouchStart" @touchmove.prevent="cropTargetTouchMove" @touchend.prevent="cropTargetTouchEnd">
        <!-- <div class="crop-target-img" ref="crop-target-img" :style="{ 'background-image': `url(${cropImg})` }"></div> -->
        <div class="crop-area" ref="crop-area"></div>
      </div>
      <div class="preview-wrap" ref="preview-wrap">
        <canvas ref="preview-cvs"></canvas>
      </div>
      <div class="btn-wrap flex-r flex-b">
        <span :style="{ 'width': 'calc((100% - 0.6rem) / 2)', 'background-color': '#6A6A6A' }" @click="closePic">取消</span>
        <span :style="{ 'width': 'calc((100% - 0.6rem) / 2)' }" @click="cropSure">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-pic',
  data () {
    return {
      isShow: true,
      shadeClose: true,
      clearShowcamera: true,
      clearShowphotos: true,
      selectPicWays: [
        {
          id: 'camera',
          way: '拍照',
          color: '#CE0606'
        },
        {
          id: 'photos',
          way: '从相册选取',
          color: '#0E4E96'
        }
      ],
      cropImg: '',
      cropTouchMoveStart: [],
      cropTouchMoveDistance: [],
      cropTouchMoveTo: [0, 0],
      cropTouchMoveInitTrans: [0, 0],
      cropTouchScaleCur: 0.4,
      cropScaleStart: null,
      cropScale: null,
      file: null,
      fileBase64: null,
      cropFile: null,
      callBack: () => {}
    }
  },
  beforeMount () {
    let dialogPic = document.querySelector('#dialog-pic-wrap')
    if (dialogPic && dialogPic.parentNode) {
      dialogPic.parentNode.removeChild(dialogPic)
    }
  },
  methods: {
    closePic () {
      if (this.shadeClose) {
        if (this.$refs['pic-crop-wrap'].classList.contains('open')) {
          this.$refs['pic-shade'].style['animation-duration'] = '0.6s'
          this.$refs['pic-content'].style['animation-duration'] = '0.6s'
          this.$refs['pic-crop-wrap'].classList.remove('bounceInLeft')
          this.$refs['pic-crop-wrap'].classList.add('bounceOutRight')
        }
        this.$refs['pic-shade'].classList.remove('fadeIn')
        this.$refs['pic-content'].classList.remove('slideInUp')
        this.$refs['pic-shade'].classList.add('fadeOut')
        this.$refs['pic-content'].classList.add('slideOutDown')
        if (this.$refs['pic-crop-wrap'].classList.contains('close')) {
          setTimeout(() => {
            this.isShow = false
          }, 210)
        } else {
          setTimeout(() => {
            this.isShow = false
          }, 610)
        }
      }
    },
    getPicByWay (way) {
      this.$refs[`pic-by-${way}`].click()
    },
    getPic (way) {
      this[`clearShow${way}`] = false
      if (way === 'camera') {
        this.file = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(this.file)
        reader.onload = (e) => {
          this.fileBase64 = e.target.result
          this.cropImg = e.target.result

          this.$nextTick(() => {
            this[`clearShow${way}`] = true

            this.$refs['pic-content'].classList.remove('slideInUp')
            this.$refs['pic-content'].classList.add('slideOutDown')

            this.$refs['pic-crop-wrap'].style.display = 'block'
            this.$refs['pic-crop-wrap'].classList.add('bounceInLeft')
            this.$refs['pic-crop-wrap'].classList.remove('close')
            this.$refs['pic-crop-wrap'].classList.add('open')
            setTimeout(() => {
              this.loadCropImg()
            }, 100)
          })
        }
      } else if (way === 'photos') {
        this.file = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(this.file)
        reader.onload = (e) => {
          this.fileBase64 = e.target.result
          this.cropImg = e.target.result

          this.$nextTick(() => {
            this[`clearShow${way}`] = true

            this.$refs['pic-content'].classList.remove('slideInUp')
            this.$refs['pic-content'].classList.add('slideOutDown')

            this.$refs['pic-crop-wrap'].style.display = 'block'
            this.$refs['pic-crop-wrap'].classList.add('bounceInLeft')
            this.$refs['pic-crop-wrap'].classList.remove('close')
            this.$refs['pic-crop-wrap'].classList.add('open')
            setTimeout(() => {
              this.loadCropImg()
            }, 100)
          })
        }
      }
    },
    cropSure () {
      this.callBack(this.cropFile)
      this.closePic()
    },
    cropTargetTouchStart () {
      if (event.touches.length === 1) {
        this.cropTouchMoveStart[0] = event.touches[0].pageX
        this.cropTouchMoveStart[1] = event.touches[0].pageY
      } else if (event.touches.length === 2) {
        let pointOne = event.touches[0]
        let pointTwo = event.touches[1]
        this.cropScaleStart = Math.sqrt(Math.pow(pointOne.pageX - pointTwo.pageX, 2) + Math.pow(pointOne.pageY - pointTwo.pageY, 2)) * 0.006
      }
    },
    cropTargetTouchMove () {
      if (event.touches.length === 1) {
        if (!this.cropTouchMoveStart[0] || !this.cropTouchMoveStart[1]) {
          this.cropTouchMoveStart[0] = event.touches[0].pageX
          this.cropTouchMoveStart[1] = event.touches[0].pageY
        }
        this.cropTouchMoveDistance[0] = (event.touches[0].pageX - this.cropTouchMoveStart[0]) * 0.4
        this.cropTouchMoveDistance[1] = (event.touches[0].pageY - this.cropTouchMoveStart[1]) * 0.4
        this.cropTouchMoveTo[0] = this.cropTouchMoveInitTrans[0] + this.cropTouchMoveDistance[0]
        this.cropTouchMoveTo[1] = this.cropTouchMoveInitTrans[1] + this.cropTouchMoveDistance[1]
        event.target.style['transition-duration'] = '0s'
        event.target.style.transform = `scale(${this.cropTouchScaleCur}, ${this.cropTouchScaleCur}) translate(${this.cropTouchMoveTo[0]}px, ${this.cropTouchMoveTo[1]}px)`
      } else if (event.touches.length === 2) {
        let pointOne = event.touches[0]
        let pointTwo = event.touches[1]
        if (this.cropScaleStart === null) {
          this.cropScaleStart = Math.sqrt(Math.pow(pointOne.pageX - pointTwo.pageX, 2) + Math.pow(pointOne.pageY - pointTwo.pageY, 2)) * 0.006
        }
        this.cropScale = Math.sqrt(Math.pow(pointOne.pageX - pointTwo.pageX, 2) + Math.pow(pointOne.pageY - pointTwo.pageY, 2)) * 0.006 - this.cropScaleStart
        let scaleTo = this.cropTouchScaleCur + this.cropScale
        event.target.style['transition-duration'] = '0s'
        event.target.style.transform = `translate(${this.cropTouchMoveTo[0]}px, ${this.cropTouchMoveTo[1]}px) scale(${scaleTo}, ${scaleTo})`
      }
      this.loadCropImg()
    },
    cropTargetTouchEnd () {
      this.cropTouchMoveStart = []
      this.cropTouchMoveDistance = []
      this.cropTouchMoveInitTrans[0] = this.cropTouchMoveTo[0]
      this.cropTouchMoveInitTrans[1] = this.cropTouchMoveTo[1]
      if (this.cropScale !== null) {
        this.cropTouchScaleCur += this.cropScale
      }
      this.cropScale = null
      if (this.cropTouchScaleCur < 0.4) {
        this.cropTouchScaleCur = 0.4
        event.target.style['transition-duration'] = '0.4s'
        event.target.style.transform = `scale(${this.cropTouchScaleCur}, ${this.cropTouchScaleCur}) translate(${this.cropTouchMoveTo[0]}px, ${this.cropTouchMoveTo[1]}px)`
      }
    },
    loadCropImg () {
      var targetImg = new Image()
      targetImg.src = this.fileBase64
      var cropLeft = this.$refs['crop-area'].offsetLeft
      var cropTop = this.$refs['crop-area'].offsetTop
      var targetWidth = targetImg.naturalWidth
      // var targetHeight = targetImg.naturalHeight
      var cropWidth = this.$refs['crop-area'].clientWidth
      var cropHeight = this.$refs['crop-area'].clientHeight
      var _oX = (targetWidth * 0.9 / cropWidth) * this.cropTouchMoveTo[0] * this.cropTouchScaleCur + cropLeft
      // var _oY = parseInt(-cropTop + this.cropTouchMoveTo[1]) * (targetHeight * 0.9 / cropHeight * 0.28) * this.cropTouchScaleCur
      var _oY = (targetWidth * 0.9 / cropWidth) * this.cropTouchMoveTo[1] * this.cropTouchScaleCur + cropTop
      var _oWidth = cropWidth / this.cropTouchScaleCur
      var _oHeight = cropHeight / this.cropTouchScaleCur

      this.$refs['preview-wrap'].style.width = cropWidth * 0.5 + 'px'
      this.$refs['preview-wrap'].style.height = cropHeight * 0.5 + 'px'
      var outPutCvs = this.$refs['preview-cvs']
      outPutCvs.width = cropWidth
      outPutCvs.height = cropHeight
      var outPutCtx = outPutCvs.getContext('2d')
      outPutCtx.scale(0.5, 0.5)
      outPutCtx.drawImage(targetImg, -_oX, -_oY, _oWidth, _oHeight, 0, 0, cropWidth, cropHeight)
      var outPutData = outPutCvs.toDataURL()
      var cropImgBase64Data = window.atob(outPutData.split(',')[1])
      var ia = new Uint8Array(cropImgBase64Data.length)
      for (let i = 0; i < cropImgBase64Data.length; i++) {
        ia[i] = cropImgBase64Data.charCodeAt(i)
      }
      var blob = new Blob([ia], { type: 'image/png' })
      this.cropFile = blob
    }
  }
}
</script>

<style lang="scss" scoped>
.pic-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
}

.pic-content {
  position: fixed;
  bottom: 0.6rem;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 999999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
  div.select-pic-item-wrap {
    position: relative;
    margin: 0 0.6rem;
    border-radius: 6px;
    overflow: hidden;
    background-color: #ffffff;
    div.select-pic-item {
      position: relative;
      padding: 1rem 0;
      span {
        pointer-events: none;
      }
    }
    div.select-pic-item:nth-of-type(n + 2)::before {
      content: '';
      position: absolute;
      left: 0.6rem;
      right: 0.6rem;
      top: 0;
      height: 0.06rem;
      background: linear-gradient(to right, rgba(158, 158, 158, 0.08) , rgba(158, 158, 158, 0.2), rgba(158, 158, 158, 0.08));
    }
  }
  div.select-pic-cancle {
    position: relative;
    margin: 0.8rem 0.6rem 0;
    background-color: #ffffff;
    color: #0E4E96;
    border-radius: 6px;
    padding: 1rem 0;
  }
  .select-way-file-inputs {
    display: none;
  }
}

.pic-crop-wrap {
  position: fixed;
  left: 5vw;
  top: calc((100vh - 40vh - 12rem - 9.4rem) / 2);
  width: 90vw;
  background-color: #2c2c2c;
  z-index: 999999;
  border-radius: 2px;
  display: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  -vendor-animation-duration: 0.6s;
  animation-duration: 0.6s;
  .crop-content-wrap {
    position: relative;
    height: 60vh;
    margin: 0.4rem;
    overflow: hidden;
    .crop-target {
      position: relative;
      transition: all 0.4s ease 0s;
      transform: scale(0.4, 0.4) translate(0px, 0px);
      transform-origin: 0% 0%;
    }
    .crop-area {
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 0px;
      padding-bottom: 90%;
      border: 1px dashed #ffffff;
      box-shadow: 0 0 0px 10rem rgba(0, 0, 0, 0.4);
      pointer-events: none;
    }
  }
  .preview-wrap {
    position: relative;
    border: 1px solid #696969;
    margin: 0 0 0.4rem 0.4rem;
  }
  .btn-wrap {
    position: relative;
    padding: 0 0.6rem 0.8rem;
    font-size: 0px;
    span {
      position: relative;
      display: inline-block;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      background-color: rgb(53, 116, 189);
      color: #ffffff;
      font-size: 0.8rem;
    }
  }
}
</style>
