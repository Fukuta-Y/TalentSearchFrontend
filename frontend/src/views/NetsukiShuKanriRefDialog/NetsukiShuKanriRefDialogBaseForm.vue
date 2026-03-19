<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-scroll-wrapper">
      <div class="modal-content dialog-content">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />
        
        <NetsukiShuKanriRefSearchJoken 
            v-bind:prop-nentsuki-shu="propNentsukiShu"
            v-bind:is-nentsuki-shu="isNentsukiShu"
            v-on:on-select-nentsuki-shu="receiveSelectNentsukiShu"
            v-on:on-message="receiveMessage"
          />

        <div class="modal-footer">
          <button v-on:click="closeDialog" class="rounded-button">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import NetsukiShuKanriRefSearchJoken from './components/NetsukiShuKanriRefSearchJoken.vue'
import '../../router/styles/common.css';

export default {
  name: 'NetsukiShuKanriRefDialogBaseForm',
  props: {
    propNentsukiShu: { type: String },
    isNentsukiShu: { type: Boolean },
    isOpen: { type: Boolean, required: true },
  },
  components: {
    ErrorMessage,
    NetsukiShuKanriRefSearchJoken,
  },
  emits: ['on-select-nentsuki-shu', 'close'],
  data() {
    return {
      searchJoken: {},
      message: '',
    }
  },
  methods: {
    receiveSelectNentsukiShu(value) {
      this.$emit('on-select-nentsuki-shu', value);
      this.$emit('close');
    },
    closeDialog() {
      this.$emit('close');
    },
    receiveMessage(value) {
      this.message = value
    },
  },
};
</script>

<style scoped>
/* モーダル背景 */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: auto; /* スクロールを許可 */
}

/* スクロールラッパー */
.modal-scroll-wrapper {
  display: flex; /* Flexboxを使用 */
  min-width: 100%;
  min-height: 100%;
}

/* ダイアログ本体 */
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  
  /* 重要：margin: auto を使うことで、
     画面が広い時は「上下左右中央」に、
     画面が狭い時は「左端・上端を優先」してスクロール可能になります。 */
  margin: auto;

  /* 横幅を 800px に完全固定 */
  width: 800px;
  min-width: 800px;
  
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  
  /* ダイアログ内の要素を中央寄せにする設定 */
  text-align: center;
}

/* ボタンエリアの設定 */
.modal-footer {
  margin-top: 25px;
  display: flex;
  justify-content: center; /* ボタンを中央に */
}

.rounded-button {
  padding: 8px 30px;
  cursor: pointer;
}
</style>
