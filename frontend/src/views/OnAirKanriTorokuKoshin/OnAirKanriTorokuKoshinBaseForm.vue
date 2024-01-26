<template>
  <CommonHeader
  />
  <ErrorMessage
    v-if="message"
    v-bind:prop-message="message"
  />
  <OnAirKanriTorokuKoshin
    v-bind:prop-id="id"
    v-bind:mode="mode"
    v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriTorokuKoshin from './components/OnAirKanriTorokuKoshin.vue'

export default {
  name: 'OnAirKanriTorokuKoshinBaseForm',
  props: {
    id: {
      type: String,
    },
    mode: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    OnAirKanriTorokuKoshin,
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
<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 背景に透明度を追加 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.dialog-content {
  width: 60%;
  /* 任意の幅を指定してください */
  height: 70%;
  /* 任意の幅を指定してください */
  margin: 0 auto;
}</style>