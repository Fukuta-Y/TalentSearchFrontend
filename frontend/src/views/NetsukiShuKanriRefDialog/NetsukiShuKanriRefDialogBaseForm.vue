<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
      <ErrorMessage v-if="message" v-bind:prop-message="message" />
      <NetsukiShuKanriRefSearchJoken 
          v-bind:prop-nentsuki-shu="propNentsukiShu"
          v-bind:is-nentsuki-shu="isNentsukiShu"
          v-on:on-select-nentsuki-shu="receiveSelectNentsukiShu"
          v-on:on-message="receiveMessage"
        />
      <button v-on:click="closeDialog()" class="rounded-button">閉じる</button>
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
    propNentsukiShu: {
      type: String,
    },
    isNentsukiShu: {
      type: Boolean,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
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
  height: 68%; /* 任意の幅を指定してください */
  margin: 0 auto;
}
</style>
