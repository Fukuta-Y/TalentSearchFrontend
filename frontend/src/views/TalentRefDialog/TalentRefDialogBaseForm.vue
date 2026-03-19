<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-scroll-wrapper">
      <div class="modal-content dialog-content">
        <ErrorMessage v-if="message" :prop-message="message" />
        
        <TalentRefSearchJoken 
            :prop-talent-id="propTalentId"
            :prop-talent-name="propTalentName"
            :is-talent-toroku="isTalentToroku"
            @on-select-talent="receiveSelectTalent"
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
import TalentRefSearchJoken from './components/TalentRefSearchJoken.vue'

export default {
  name: 'TalentRefDialogBaseForm',
  props: {
    propTalentId: { type: String },
    propTalentName: { type: String },
    isTalentToroku: { type: Boolean },
    isOpen: { type: Boolean, required: true },
  },
  components: {
    ErrorMessage,
    TalentRefSearchJoken,
  },
  emits: ['on-select-talent', 'close'],
  data() {
    return {
      message: '',
    }
  },
  methods: {
    receiveSelectTalent(value) {
      this.$emit('on-select-talent', value);
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
  overflow: auto !important;
}

/* スクロールラッパー */
.modal-scroll-wrapper {
  display: flex !important;
  min-width: 100% !important;
  min-height: 100% !important;
}

/* ダイアログ本体 */
.modal-content {
  background: white !important;
  padding: 30px !important;
  border-radius: 8px !important;
  margin: auto !important;
  width: 800px !important;
  min-width: 800px !important;
  box-sizing: border-box !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  text-align: center !important;
}

/* ボタンエリアの設定 */
.modal-footer {
  margin-top: 25px !important;
  display: flex !important;
  justify-content: center !important;
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
