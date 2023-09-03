<template>
  <CommonHeader
    />
  <HeaderMessage
      v-if="message"
      v-bind:prop-message="message"
  />
  <SearchJoken 
      v-bind:prop-nentsuki="nentsuki"
      v-bind:prop-shu="shu"
      v-bind:prop-talent-name="talentName"
      v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import HeaderMessage from '../common/HeaderMessage.vue'
import SearchJoken from './components/SearchJoken.vue'

export default {
  name: 'WeekTalentShutsuenBaseForm',
  props: {
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    },
    talentName: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    HeaderMessage,
    SearchJoken,
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
