<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-scroll-wrapper">
      <div class="modal-content dialog-content">
        <ErrorMessage v-if="message" :prop-message="message" />
        
        <ProgramRefSearchJoken 
            :prop-program-id="propProgramId"
            :prop-program-name="propProgramName"
            :is-program-toroku="isProgramToroku"
            @on-select-program="receiveSelectProgram"
            @on-message="receiveMessage"
          />

        <div class="modal-footer">
          <button @click="closeDialog" class="rounded-button">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramRefSearchJoken from './components/ProgramRefSearchJoken.vue'
import '../../router/styles/common.css';

export default {
  name: 'ProgramRefDialogBaseForm',
  props: {
    propProgramId: {
      type: String,
    },
    propProgramName: {
      type: String,
    },
    isProgramToroku: {
      type: Boolean,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    ErrorMessage,
    ProgramRefSearchJoken,
  },
  emits: ['on-select-program', 'close'],
  data() {
    return {
      message: '',
    }
  },
  methods: {
    receiveSelectProgram(value) {
      this.$emit('on-select-program', value);
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
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 1000 !important;
  overflow: auto !important; /* 全体のスクロールを許可 */
}

/* スクロールラッパー */
.modal-scroll-wrapper {
  display: flex !important; /* Flexboxを使用 */
  min-width: 100% !important;
  min-height: 100% !important;
}

/* ダイアログ本体 */
.modal-content {
  background: white !important;
  padding: 30px !important;
  border-radius: 8px !important;
  
  /* 重要：margin: auto により、画面が広い時は「上下左右中央」に、
     画面が狭い時や中身が長い時は「左端・上端を優先」してスクロール可能になります */
  margin: auto !important;

  /* 横幅を 800px に完全固定 */
  width: 800px !important;
  min-width: 800px !important;
  
  box-sizing: border-box !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  
  /* ダイアログ内の要素を中央寄せにする設定 */
  text-align: center !important;
}

/* ボタンエリアの設定 */
.modal-footer {
  margin-top: 25px !important;
  display: flex !important;
  justify-content: center !important; /* ボタンを中央に */
}

/* 閉じるボタン：指定色 #A0A0A0 で固定 */
.rounded-button {
  /* ライブラリ等の干渉をリセット */
  appearance: none !important;
  -webkit-appearance: none !important;
  background-image: none !important;

  /* 背景色を #A0A0A0 に強制固定 */
  background-color: #A0A0A0 !important;
  border: 1px solid #767676 !important;
  border-radius: 4px !important;
  color: #333333 !important;

  padding: 8px 30px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  font-size: 14px !important;
}
</style>