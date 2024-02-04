<template>
  <div class="modal-container dialog-overlay" v-if="isOpen">
    <div class="modal-content dialog-content">
      <ErrorMessage v-if="message" v-bind:prop-message="message" />
      <OnAirKanriRefSearchJoken 
          v-bind:prop-id="propId"
          v-bind:prop-on-air-day="propOnAirDay"
          v-on:on-select-id="receiveSelectId"
          v-on:on-message="receiveMessage"
        />
      <button v-on:click="closeDialog()" class="rounded-button">閉じる</button>
    </div>
  </div>
</template>
<script>
import ErrorMessage from '../common/ErrorMessage.vue'
import OnAirKanriRefSearchJoken from './components/OnAirKanriRefSearchJoken.vue'
import '../../router/styles/common.css';

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
    ErrorMessage,
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
</style>
