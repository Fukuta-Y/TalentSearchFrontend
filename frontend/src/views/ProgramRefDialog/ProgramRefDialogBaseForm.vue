<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
    <ErrorMessage v-if="message" v-bind:prop-message="message" />
    <ProgramRefSearchJoken 
        v-bind:prop-program-id="propProgramId"
        v-bind:prop-program-name="propProgramName"
        v-bind:is-program-toroku="isProgramToroku"
        v-on:on-select-program="reciveSelectProgram"
        v-on:on-message="receiveMessage"
      />
     <button v-on:click="closeDialog()" class="rounded-button">閉じる</button>
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
      searchJoken: {},
      message: '',
    }
  },
  methods: {
    reciveSelectProgram(value) {
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
  width: 40%; /* 任意の幅を指定してください */
  height: 70%; /* 任意の幅を指定してください */
  margin: 0 auto;
}
</style>
