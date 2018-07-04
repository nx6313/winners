export default {
  install: function (Vue, options) {
    // 指令 - 数值增长效果
    Vue.directive('num-scroll', {
      update: function (el, binding) {
        var number = binding.value.number
        var precision = binding.value.precision
        if (Number(el.innerHTML) !== number) {
          var scrollNum = Number(el.innerHTML || 0)
          el.innerHTML = scrollNum
          var numberTimer = () => {
            if (scrollNum < number) {
              scrollNum += precision >= 2 ? 0.01 : (precision === 1 ? 0.01 : 1)
              el.innerHTML = scrollNum
              window.requestAnimationFrame(() => {
                numberTimer()
              })
            } else if (scrollNum > number) {
              scrollNum -= precision >= 2 ? 0.01 : (precision === 1 ? 0.01 : 1)
              el.innerHTML = scrollNum
              window.requestAnimationFrame(() => {
                numberTimer()
              })
            } else {
              scrollNum = number
              el.innerHTML = scrollNum
            }
          }
          numberTimer()
          window.requestAnimationFrame(numberTimer)
        }
      }
    })
  }
}
