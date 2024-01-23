<template>
  <CommonHeader
  />
  <ErrorMessage
    v-if="message"
    v-bind:prop-message="message"
  />
  <NetsukiShuKanriTorokuKoshin
    v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import NetsukiShuKanriTorokuKoshin from './components/NetsukiShuKanriTorokuKoshin.vue'

export default {
  name: 'NetsukiShuKanriTorokuKoshinBaseForm',
  props: {
    talentId: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    NetsukiShuKanriTorokuKoshin,
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
