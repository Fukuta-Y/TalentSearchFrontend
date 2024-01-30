<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
    <ErrorMessage v-if="message" v-bind:prop-message="message" />
    <TalentRefSearchJoken 
        v-bind:prop-talent-id="propTalentId"
        v-bind:prop-talent-name="propTalentName"
        v-bind:is-talent-toroku="isTalentToroku"
        v-on:on-select-talent="reciveSelectTalent"
        v-on:on-message="receiveMessage"
      />
      <button @click="closeDialog">閉じる</button>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import TalentRefSearchJoken from './components/TalentRefSearchJoken.vue'
export default {
  props: {
    propTalentId: {
      type: String,
    },
    propTalentName: {
      type: String,
    },
    isTalentToroku: {
      type: Boolean,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    ErrorMessage,
    TalentRefSearchJoken,
  },
  emits: ['on-select-talent', 'close'],
  data() {
    return {
      searchJoken: {},
      message: '',
    }
  },
  methods: {
    reciveSelectTalent(value) {
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
