<template>
  <CommonHeader
    />
  <ErrorMessage
        v-if="message"
  />
  <TalentDetailJoken
    v-bind:nentsuki="nentsuki"
    v-bind:shu="shu"
    v-bind:talent-id="talentId"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentDetailJoken from './components/TalentDetailJoken.vue'

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
    CommonHeader,
    ErrorMessage,
    TalentDetailJoken,
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
