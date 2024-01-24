<!-- <template>
  <CommonHeader
    />
  <ErrorMessage
      v-if="message"
      v-bind:prop-message="message"
  />
  <ProgramRefSearchJoken 
      v-bind:prop-program-id-="programId"
      v-bind:prop-program-name-="programName"
      v-on:on-message="receiveMessage"
  />
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import ErrorMessage from '../common/ErrorMessage.vue'
import ProgramRefSearchJoken from './components/ProgramRefSearchJoken.vue'

export default {
  name: 'ProgramRefDialogBaseForm',
  props: {
    programId: {
      type: String,
    },
    programName: {
      type: String,
    },
  },
  components: {
    CommonHeader,
    ErrorMessage,
    ProgramRefSearchJoken,
  },
  data() {
    return {
      searchJoken: {},
      message:'',
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->


<template>
  <div class="modal-container" v-if="isOpen">
    <div class="modal-content">
    <ProgramRefSearchJoken 
        v-bind:prop-program-id-="programId"
        v-bind:prop-program-name-="programName"
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
    isOpen: Boolean,
    programId: {
      type: String,
    },
    programName: {
      type: String,
    },
  },
  components: {
    // CommonHeader,
    // ErrorMessage,
    ProgramRefSearchJoken,
  },
  data() {
    return {
      searchJoken: {},
      message: '',
      returnValue: '',
    }
  },
  methods: {
    reciveSelectProgram(value) {
      console.log('value:' + JSON.stringify(value));
      this.returnValue = value
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
</style>
