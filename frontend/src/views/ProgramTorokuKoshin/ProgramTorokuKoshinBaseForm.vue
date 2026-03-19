<template>
  <div id="app" class="fixed-viewport-container">
    
    <div class="fixed-layout-inner">
      <SideBar />

      <div class="main-content-area">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />
        
        <ProgramTorokuKoshin
          v-bind:prop-program-id="programId"
          v-on:on-message="receiveMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramTorokuKoshin from './components/ProgramTorokuKoshin.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'ProgramTorokuKoshinBaseForm',
  props: {
    programId: {
      type: String,
    },
  },
  components: {
    ErrorMessage,
    ProgramTorokuKoshin,
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
  /* 横幅が足りない場合にブラウザのスクロールバーを出す */
  overflow-x: auto;
  overflow-y: auto;
  background-color: white;
}

.fixed-layout-inner {
  display: flex;
  flex: 1;
  /* 画面いっぱいに広がるが、1200pxよりは縮まない */
  width: 100%; 
  min-width: 1200px; 
  min-height: 100vh;
}

.main-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* 子要素の影響でこのエリアが勝手に縮むのを防ぐ */
  min-width: 0; 
}

/* --- 共通フォント設定 --- */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* 不要な余白を削除 */
  margin: 0;
}
</style>
