<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-scroll-wrapper">
      <div class="modal-content dialog-content">
        <ErrorMessage v-if="message" :prop-message="message" />
        
        <OnAirKanriRefSearchJoken 
            :prop-id="propId"
            :prop-on-air-day="propOnAirDay"
            @on-select-id="receiveSelectId"
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
// ... (スクリプト部分は変更なし。vee-validateやconstListは不要なのでコメントアウト等で整理可能です)
import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriRefSearchJoken from './components/OnAirKanriRefSearchJoken.vue'
// import '../../router/styles/common.css'; // 必要であれば復活させてください

export default {
  name: 'OnAirKanriRefDialogBaseForm',
  props: {
    propId: { type: String },
    propOnAirDay: { type: String },
    isOpen: { type: Boolean, required: true },
  },
  components: {
    ErrorMessage,
    OnAirKanriRefSearchJoken,
  },
  emits: ['on-select-id', 'close'],
  data() {
    return { message: '' }
  },
  methods: {
    receiveSelectId(value) {
      this.$emit('on-select-id', value);
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
  overflow: auto; /* 全体のスクロールを許可 */
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
     画面が狭い時や中身が長い時は「左端・上端を優先」してスクロール可能になります */
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
  background-color: #efefef;
  border: 1px solid #767676;
  border-radius: 4px;
}

.rounded-button:hover {
  background-color: #e5e5e5;
}
</style>