<template>
  <CommonHeader
    />
  <ErrorMessage
      v-if="message"
      v-bind:prop-message="message"
  />
  <ProgramRefSearchJoken 
      v-bind:prop-program-id-="programId"
      v-bind:prop-program-name-="programName"
      v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramRefSearchJoken from './components/ProgramRefSearchJoken.vue'

export default {
  name: 'ProgramRefDialogBaseForm',
  props: {
    programId: {
      type: String,
    },
    programName: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    ProgramRefSearchJoken,
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
