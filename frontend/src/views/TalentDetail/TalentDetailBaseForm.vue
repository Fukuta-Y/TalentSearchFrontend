
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
          <TalentDetailJoken
            v-bind:nentsuki="nentsuki"
            v-bind:shu="shu"
            v-bind:talent-id="talentId"
            v-on:on-message="receiveMessage"
          />
        </div>
    </div>
  </div>
</template>
<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentDetailJoken from './components/TalentDetailJoken.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'TalentProgramJokenBaseForm',
  props: {
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    },
    talentId: {
      type: String,
    },
  },
  components: {
    ErrorMessage,
    TalentDetailJoken,
    SideBar,
  },
  data() {
    return {
       message: '',
    }
  },
  methods: {
    receiveMessage(value) {
      this.message = value;
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
