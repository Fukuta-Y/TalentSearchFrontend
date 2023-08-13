<template>
  <CommonHeader
    />
  <ErrorMessage
  />
  <SearchJoken 
      v-bind:prop-nentsuki="nentsuki"
      v-bind:prop-shu="shu"
      v-bind:prop-talent-name="talentName"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
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
    ErrorMessage,
    SearchJoken,
  },
  data() {
    return {
      searchJoken: {},
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
