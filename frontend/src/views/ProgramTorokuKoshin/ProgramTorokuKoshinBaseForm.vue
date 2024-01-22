<template>
  <CommonHeader
  />
  <ErrorMessage
    v-if="message"
  />
  <ProgramTorokuKoshin
    v-bind:program-id="programId"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramTorokuKoshin from './components/ProgramTorokuKoshin.vue'

export default {
  name: 'ProgramTorokuKoshinBaseForm',
  props: {
    programId: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    ProgramTorokuKoshin,
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
