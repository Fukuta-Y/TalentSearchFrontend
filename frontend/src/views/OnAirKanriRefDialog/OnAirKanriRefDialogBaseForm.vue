<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
    <OnAirKanriRefSearchJoken 
        v-bind:prop-id="propId"
        v-bind:prop-on-air-day="propOnAirDay"
        v-on:on-select-id="receiveSelectId"
        v-on:on-message="receiveMessage"
      />
      <button @click="closeDialog">閉じる</button>
    </div>
  </div>
</template>

<script>
// import CommonHeader from '../common/CommonHeader.vue'
// import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriRefSearchJoken from './components/OnAirKanriRefSearchJoken.vue'
export default {
  name: 'OnAirKanriRefDialogBaseForm',
  props: {
    propId: {
      type: String,
    },
    propOnAirDay: {
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
    OnAirKanriRefSearchJoken,
  },
  emits: ['on-select-id', 'close'],
  data() {
    return {
      searchJoken: {},
      message: '',
    }
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
