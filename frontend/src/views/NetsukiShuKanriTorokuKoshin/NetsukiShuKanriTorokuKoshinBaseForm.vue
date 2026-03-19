<template>
  <div id="app" class="fixed-viewport-container">
    
    <div class="fixed-layout-inner">
      
      <SideBar />

      <div class="main-content-area">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />
        
        <NetsukiShuKanriTorokuKoshin
          v-bind:prop-nentsuki="nentsuki"
          v-bind:prop-shu="shu"
          v-on:on-message="receiveMessage"
        />
      </div>

    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import NetsukiShuKanriTorokuKoshin from './components/NetsukiShuKanriTorokuKoshin.vue'
import SideBar from '../common/SideBar.vue';

export default {
  name: 'NetsukiShuKanriTorokuKoshinBaseForm',
  props: {
    nentsuki: {
      type: String,
    },
    shu: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ErrorMessage,
    NetsukiShuKanriTorokuKoshin,
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

<style>
/* --- 全体レイアウト固定設定 --- */

/* 画面全体のスクロール制御 */
/* 内部のレイアウト設定 */
.fixed-layout-inner {
  display: flex;
  flex: 1;

  /* 【ここを修正】 */
  /* PCでは画面いっぱいに広がる(100%)。
     ただし、どれだけ画面が小さくなっても1200pxよりは縮まない。
     これでレイアウト崩れを防ぎつつ、広々と表示できます。 */
  width: 100%; 
  min-width: 1200px; 

  min-height: 100vh;
  background-color: white;
}

/* 背景コンテナも白にしておくと、
   1200px以下の時にスクロールした先も真っ白で綺麗です */
.fixed-viewport-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-x: auto;
  overflow-y: auto;
  background-color: white; 
}

/* メインコンテンツエリアの調整 */
.main-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* 子要素が原因で勝手に縮まないように保護 */
  min-width: 0; 
}

/* --- 既存のスタイルと共通パーツ --- */

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* モーダル背景（前回の回答内容を統合） */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto; 
}

/* モーダルコンテンツも固定幅 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 800px; 
  min-width: 800px; 
  margin: auto;
  box-sizing: border-box;
}

.rounded-button {
  margin-top: 15px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
