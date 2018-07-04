<template>
  <div v-if="isShow" id="cvs-fire-wrap" class="cvs-fire-wrap">
    <canvas ref="fire-cvs"></canvas>
  </div>
</template>

<script>
export default {
  name: 'cvs-fire',
  data () {
    return {
      isShow: true,
      canvas: null,
      ctx: null,
      scale: 3,
      numParticles: 100,
      bg: [2, 2, 2],
      cols: ['#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff9900', '#ffffff', '#990000'],
      particles: []
    }
  },
  beforeMount () {
    let cvsFire = document.querySelector('#cvs-fire-wrap')
    if (cvsFire && cvsFire.parentNode) {
      cvsFire.parentNode.removeChild(cvsFire)
    }
  },
  mounted () {
    this.canvas = this.$refs['fire-cvs']
    this.ctx = this.canvas.getContext('2d')

    this.setup()
    window.addEventListener('resize', this.setup)
    window.requestAnimationFrame(this.animate)

    this.particles.push(new this.$fireParticle.Particle(this.canvas, this.ctx, this.cols, this.scale))
  },
  methods: {
    setup () {
      this.canvas.width = window.innerWidth * this.scale
      this.canvas.height = window.innerHeight * this.scale
      this.ctx.scale(1, 1)
      this.ctx.beginPath()
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = `rgba(${this.bg[0]}, ${this.bg[1]}, ${this.bg[2]}, ${1})`
      this.ctx.fill()
    },
    animate () {
      this.fade(0.34)
      this.$fireParticle.draw(this.particles, this.canvas, this.ctx, this.cols, this.scale, this.numParticles)
      window.requestAnimationFrame(() => {
        this.animate()
      })
    },
    fade (amt) {
      this.ctx.beginPath()
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = `rgba(${this.bg[0]}, ${this.bg[1]}, ${this.bg[2]}, ${amt})`
      this.ctx.fill()
    }
  }
}
</script>

<style scoped>
#cvs-fire-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

#cvs-fire-wrap > canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
