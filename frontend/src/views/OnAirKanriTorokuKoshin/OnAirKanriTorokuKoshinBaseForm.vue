<template>
  <div id="app" class="fixed-viewport-container">
    <div class="fixed-layout-inner">
      <SideBar />
      <div class="main-content-area">
        <ErrorMessage v-if="message" :prop-message="message" />
        <OnAirKanriTorokuKoshin @on-message="receiveMessage" />
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriTorokuKoshin from './components/OnAirKanriTorokuKoshin.vue'
import SideBar from '../common/SideBar.vue'

export default {
  name: 'OnAirKanriTorokuKoshinBaseForm',
  components: { ErrorMessage, OnAirKanriTorokuKoshin, SideBar },
  data() { return { message: '' } },
  methods: { receiveMessage(val) { this.message = val; } }
}
</script>

<style scoped>
.fixed-viewport-container {
  display: flex; flex-direction: column; height: 100vh; width: 100vw;
  overflow: auto; background-color: white;
}
.fixed-layout-inner {
  display: flex; flex: 1; width: 100%; min-width: 1200px; min-height: 100vh;
}
.main-content-area { flex: 1; display: flex; flex-direction: column; padding: 20px; min-width: 0; }
</style>
