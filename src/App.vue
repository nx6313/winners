<template>
  <div id="app">
    <router-view class="router-view-wrap"/>
    <comm-footer></comm-footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: {
    'comm-footer': Footer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #202020;
  font-size: 1rem;
  font-family: FZLTHJW, 'Avenir', Helvetica, Arial, sans-serif;
}

.router-view-wrap {
  height: calc(100vh - 3.6rem);
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
