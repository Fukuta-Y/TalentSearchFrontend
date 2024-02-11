<template>
  <div id="app" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1;">
      <!-- サイドバー -->
      <SideBar />
      <!-- メインメニュータイトルブロックとコンテンツ -->
      <div style="flex: 1; display: flex; flex-direction: column; padding: 20px;">
          <ErrorMessage
              v-if="message"
              v-bind:prop-message="message"
          />
          <WeekTalentShutsuenJoken 
            v-on:on-message="receiveMessage"
          />
        </div>
    </div>
  </div>
</template>
<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import WeekTalentShutsuenJoken from './components/WeekTalentShutsuenJoken.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'WeekTalentShutsuenBaseForm',
  props: {
  },
  components: {
    ErrorMessage,
    WeekTalentShutsuenJoken,
    SideBar,
  },
  data() {
    return {
      searchJoken: {},
      message:'',
    }
  },
methods: {
    receiveMessage(value) {
      this.message = value
    },
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
