<template>
  <CommonHeader
    />
  <ErrorMessage
        v-if="message"
  />
  <TalentProgramJoken
    v-bind:nentsuki="nentsuki"
    v-bind:shu="shu"
    v-bind:talent-id="talentId"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentProgramJoken from './components/TalentProgramJoken.vue'

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
    TalentProgramJoken,
  },
  data() {
    return {
      //talentProgramJoken: {},
    }
  },
methods: {
    // onTalentProgramJoken(data) {
    //   this.talentProgramJoken = data
    //   // this.$router.push({ name: 'TalentProgramListBaseForm', params: { nentsuki: this.talentProgramJoken.nentsuki, seibetsu: this.talentProgramJoken.seibetsu, address: this.talentProgramJoken.address, }, })
    // }
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
