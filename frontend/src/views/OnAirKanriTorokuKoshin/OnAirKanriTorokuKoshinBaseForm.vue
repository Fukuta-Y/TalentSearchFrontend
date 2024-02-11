<template>
  <div id="app" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1;">
      <!-- サイドバー -->
      <SideBar />

      <!-- メインメニュータイトルブロックとコンテンツ -->
      <div style="flex: 1; display: flex; flex-direction: column; padding: 20px;">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />
        <OnAirKanriTorokuKoshin
          v-on:on-message="receiveMessage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriTorokuKoshin from './components/OnAirKanriTorokuKoshin.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'OnAirKanriTorokuKoshinBaseForm',
  props: {
  },
  components: {
    ErrorMessage,
    OnAirKanriTorokuKoshin,
    SideBar,
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
  height: 90%;
  /* 任意の幅を指定してください */
  margin: 0 auto;
}</style>