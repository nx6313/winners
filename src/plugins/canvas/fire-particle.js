export default {
  install: function (Vue, options) {
    var step = 0
    var FireParticle = {
      Particle: function (canvas, ctx, cols, scale) {
        this.pos = {
          x: Math.random() * canvas.width * 0.1 + canvas.width * 0.45,
          y: Math.random() * canvas.height * 0.1 + canvas.height * 0.45
        }
        this.r = 1
        this.speed = 22
        this.hue = [44, 36, 36, 24, 14, 4, 24, 24][Math.floor(Math.random() * 7)]
        this.step = Math.random() * 400
        this.vx = Math.random() * this.speed / 4 - this.speed / 8
        this.vy = Math.random() * this.speed / 4 - this.speed / 8
        this.colIndex = Math.floor(Math.random() * cols.length)
        this.history = []
        this.update = function () {
          if (this.pos === undefined) {
            this.pos = {
              x: Math.random() * canvas.width * 0.1 + canvas.width * 0.45,
              y: Math.random() * canvas.height * 0.1 + canvas.height * 0.45
            }
          }
          if (this.history === undefined) {
            this.history = []
          }
          this.step++
          this.step %= 400
          if (this.history.length > 5) {
            this.history.shift()
          }
          this.pos.x += this.vx
          this.pos.y += this.vy
          this.vx = this.vx * 0.8 + (Math.random() * this.speed * 2 - this.speed) * 0.2
          this.vy = this.vy * 0.8 + (Math.random() * this.speed * 2 - this.speed) * 0.2

          if (this.step > 325 || (this.step > 100 && this.step < 190)) {
            var m = Math.min(canvas.height, canvas.width) * 0.3
            var p = Math.PI * 2 * (step + this.step * 0.01) / 180
            this.vx = (Math.cos(p) * m - this.pos.x + canvas.width / 2) * 0.016 + this.vx * 0.97
            this.vy = (Math.sin(p) * m - this.pos.y + canvas.height / 2) * 0.016 + this.vy * 0.97
          }

          var speed = Math.min(Math.abs(this.vx) + Math.abs(this.vy), 50) / 50
          if (this.history.length > 4) {
            ctx.beginPath()
            ctx.moveTo(this.pos.x, this.pos.y)
            for (var i = this.history.length - 1; i >= 0; i--) {
              ctx.lineTo(this.history[i].x, this.history[i].y)
            }
            ctx.fillStyle = `hsla(${this.hue}, ${99}%, ${speed * 70 + 30}%, ${speed * 0.3 + 0.7})`
            // ctx.strokeStyle = `hsla(${Math.sin(this.step / 300) * 70 + 70}, ${99}%, ${50}%, 0.5)`
            // ctx.fillStyle = cols[this.colIndex]
            // ctx.strokeStyle = cols[this.colIndex]
            ctx.fill()
            ctx.lineWidth = 1
            ctx.lineJoin = 'round'
            ctx.closePath()
            ctx.stroke()
          }
          if (this.pos.x > canvas.width || this.pos.x < 0 || this.pos.y > canvas.height || this.pos.y < 0) {
            delete this.pos
            delete this.history
            return false
          }
          this.history.push({
            x: this.pos.x,
            y: this.pos.y
          })
          return true
        }
      },
      draw: function (particles, canvas, ctx, cols, scale, numParticles) {
        step++
        step %= 180

        if (particles.length < numParticles) {
          particles.push(new this.Particle(canvas, ctx, cols, scale))
        }
        particles = particles.filter(function (p) {
          return p.update()
        })
      }
    }

    Object.defineProperty(Vue.prototype, '$fireParticle', { value: FireParticle })
  }
}
