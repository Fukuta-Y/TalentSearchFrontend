<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
    <NetsukiShuKanriRefSearchJoken 
        v-bind:prop-nen="propNen"
        v-bind:prop-tsuki="propTsuki"
        v-bind:prop-shu="propShu"
        v-on:on-select-nentsuki-shu="receiveSelectNentsukiShu"
        v-on:on-message="receiveMessage"
      />
      <button @click="closeDialog">閉じる</button>
    </div>
  </div>
</template>

<script>
// import CommonHeader from '../common/CommonHeader.vue'
// import ErrorMessage from '../common/ErrorMessage.vue'
import NetsukiShuKanriRefSearchJoken from './components/NetsukiShuKanriRefSearchJoken.vue'
export default {
  name: 'NetsukiShuKanriRefDialogBaseForm',
  props: {
    propNen: {
      type: String,
    },
    propTsuki: {
      type: String,
    },
    propShu: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    // CommonHeader,
    // ErrorMessage,
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
  width: 55%; /* 任意の幅を指定してください */
  height: 60%; /* 任意の幅を指定してください */
  margin: 0 auto;
}
</style>
