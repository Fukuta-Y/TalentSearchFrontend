<template>
  <CommonHeader
    />
  <HeaderMessage
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
import HeaderMessage from '../common/HeaderMessage.vue'
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
    HeaderMessage,
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
