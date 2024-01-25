<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
    <ProgramRefSearchJoken 
        v-bind:prop-program-id="propProgramId"
        v-bind:prop-program-name="propProgramName"
        v-on:on-select-program="reciveSelectProgram"
        v-on:on-message="receiveMessage"
      />
      <button @click="closeDialog">閉じる</button>
    </div>
  </div>
</template>

<script>
// import CommonHeader from '../common/CommonHeader.vue'
// import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramRefSearchJoken from './components/ProgramRefSearchJoken.vue'
export default {
  props: {
    propProgramId: {
      type: String,
    },
    propProgramName: {
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
