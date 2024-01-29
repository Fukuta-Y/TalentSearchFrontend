<template>
  <div id="app" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1;">
      <!-- サイドバー -->
      <SideBar />

      <!-- メインメニュータイトルブロックとコンテンツ -->
      <div style="flex: 1; display: flex; flex-direction: column; padding: 20px;">
          <CommonHeader
            />
          <ErrorMessage
              v-if="message"
              v-bind:prop-message="message"
          />
          <ProgramDetailJoken
            v-bind:program-id="programId"
            v-bind:on-air-day="onAirDay"
            v-bind:nentsuki="nentsuki"
            v-bind:shu="shu"
          />
        </div>
    </div>
  </div>
</template>
<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramDetailJoken from './components/ProgramDetailJoken.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'ProgramDetailBaseForm',
  props: {
    programId: {
      type: String,
    },
    onAirDay: {
      type: String,
    },
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    ProgramDetailJoken,
    SideBar,
  },
  data() {
    return {
    }
  },
methods: {
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
