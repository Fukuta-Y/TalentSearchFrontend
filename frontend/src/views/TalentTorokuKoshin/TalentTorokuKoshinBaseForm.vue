<template>
  <div id="app" class="fixed-viewport-container">
    
    <div class="fixed-layout-inner">
      <SideBar />

      <div class="main-content-area">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />
        
        <TalentTorokuKoshin
          v-bind:prop-talent-id="talentId"
          v-on:on-message="receiveMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentTorokuKoshin from './components/TalentTorokuKoshin.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'TalentTorokuKoshinBaseForm',
  props: {
    talentId: {
      type: String,
    },
  },
  components: {
    ErrorMessage,
    TalentTorokuKoshin,
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
/* --- 全体レイアウト固定設定 --- */

.fixed-viewport-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  /* 横幅が足りない場合にスクロールバーを出す */
  overflow-x: auto;
  overflow-y: auto;
  background-color: white; /* 背景を白で統一 */
}

.fixed-layout-inner {
  display: flex;
  flex: 1;
  /* PCでは画面いっぱいに広がる(100%)。
     ただし、どれだけ画面が小さくなっても1200pxよりは縮まない。 */
  width: 100%; 
  min-width: 1200px; 
  min-height: 100vh;
}

.main-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* 子要素が原因で勝手に縮まないように保護 */
  min-width: 0; 
}

/* --- 共通フォント設定 --- */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
