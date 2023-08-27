<template>
  <CommonHeader
  />
  <ErrorMessage
        v-if="message"
  />
  <ProgramShutsuenJoken
    v-bind:program-id="programId"
    v-bind:onair-day="onairDay"
    v-bind:nentsuki="nentsuki"
    v-bind:shu="shu"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramShutsuenJoken from './components/ProgramShutsuenJoken.vue'

export default {
  name: 'ProgramShutenJokenBaseForm',
  props: {
    programId: {
      type: String,
    },
    onairDay: {
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
    ProgramShutsuenJoken,
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
