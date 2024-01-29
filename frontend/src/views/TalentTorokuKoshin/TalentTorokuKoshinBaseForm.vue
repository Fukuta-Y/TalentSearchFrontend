<template>
  <CommonHeader
  />
  <ErrorMessage
    v-if="message"
    v-bind:prop-message="message"
  />
  <TalentTorokuKoshin
    v-bind:prop-talent-id="talentId"
    v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentTorokuKoshin from './components/TalentTorokuKoshin.vue'

export default {
  name: 'TalentTorokuKoshinBaseForm',
  props: {
    talentId: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    TalentTorokuKoshin,
  },
  data() {
    return {
      message: '',
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
