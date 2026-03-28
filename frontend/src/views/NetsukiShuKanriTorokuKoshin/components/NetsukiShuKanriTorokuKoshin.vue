<template>
  <div>
    <div v-if="isLoading || isSubmitting" class="loading-overlay">
      <div class="loading-content">
        <div class="loader-overlay"></div>
        <p v-if="isLoading">データを取得しています...</p>
        <p v-else>{{ getTorokuKoshinName }}処理中です...</p>
      </div>
    </div>

    <div v-show="!isLoading">
      <table align="center">
        <tr>
          <td>年月： </td>
          <td>
            <Field 
              name="nen" 
              v-model="nen"
              size="9"
              label="年"
              maxlength="4"
              placeholder="例：2023"
              class="rounded-textbox"
            /> 年
          </td>
          <td>
            <Field 
              name="tsuki" 
              v-model="tsuki"
              size="6"
              label="月"
              maxlength="2"
              placeholder="例：04"
              class="rounded-textbox"
            />月
            <button v-on:click="btnNentsukiRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
              <label>参照</label>
            </button>
            <NetsukiShuKanriRefDialog 
              v-bind:prop-nentsuki-shu="nentsukiShu"
              v-bind:is-nentsuki-shu="true"
              :is-open="nentsukiShuRefDialogComponent" 
              @close="btnNentsukiRefDialogClose()" 
              v-on:on-select-nentsuki-shu="handleSelectNentsuki" 
            />
          </td>
        </tr><br/>
        <tr>
          <td>週： </td>
          <td>
            <Field 
              name="shu" 
              v-model="shu"
              label="週"
              maxlength="1"
              size="5"
              placeholder="例：3"
              class="rounded-textbox"
            /> 週目
          </td>
        </tr><br/>
        <tr v-if="!nentsukiShuRefDialogComponent">
          <td>週の開始日（日曜日）： </td>
          <td class="date-picker">
            <Datepicker 
              v-model="shuFrom" 
              @input="updateFormattedDate" 
              :style="{ width: '200px' }" 
              class="rounded-datepicker" 
              language="ja" 
              placeholder="例：2024-02-04" 
              :format="customDateFormat"
              :disabled="isSubmitting"
            />
          </td>
        </tr><br/>
        <tr v-if="!nentsukiShuRefDialogComponent">
          <td>週の終了日（土曜日）： </td>
          <td class="date-picker">
            <Datepicker 
              v-model="shuTo" 
              @input="updateFormattedDate" 
              :style="{ width: '200px' }" 
              class="rounded-datepicker" 
              language="ja" 
              placeholder="例：2024-02-10" 
              :format="customDateFormat"
              :disabled="isSubmitting"
            />
          </td>
        </tr>
      </table>

      <br/>
      <br/>
      <div>
        <button v-on:click="btnToroku()" class="rounded-button" :disabled="isSubmitting">
          <label>{{ getTorokuKoshinName }}</label>
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button v-on:click="btnClear()" class="rounded-button" :disabled="isSubmitting">
          クリア
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field } from 'vee-validate'
import { format } from 'date-fns';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import { NENTSUKI_SHU_KANRI_REF_URL, NENTSUKI_SHUKANRI_URL } from '../../../router/constList';
import axios from 'axios'
import NetsukiShuKanriRefDialog from '../../NetsukiShuKanriRefDialog/NetsukiShuKanriRefDialogBaseForm.vue'
import Datepicker from '@vuepic/vue-datepicker'
import msgList from '../../../router/msgList';
import '@vuepic/vue-datepicker/dist/main.css'
import '../../../router/styles/common.css';

export default {
  name: 'NetsukiShuKanriTorokuKoshin',
  props: {
    propNentsuki: { type: String },
    propShu: { type: Number },
  },
  computed: {
    getTorokuKoshinName() {
      return (this.propNentsuki === undefined || this.propNentsuki === '') ? '登録' : '更新';
    },
  },
  components: {
    Field,
    Datepicker,
    NetsukiShuKanriRefDialog,
  },
  emits: ['on-message'],
  data() {
    return {
      nen: null,
      tsuki: null,
      nentsuki: null,
      shu: null,
      nentsukiShu: null,
      shuFrom: null, 
      shuTo: null,
      url: '',
      formattedDate: null,
      nentsukiShuRefDialogComponent: false,
      targetFromNentsuki: '',
      targetToNentsuki: '',
      customDateFormat: 'yyyy-MM-dd',
      isLoading: false,    
      isSubmitting: false, 
    };
  },
  async created() {
    this.init();
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      if (this.propNentsuki && this.propShu) {
        // ★初期読込オーバーレイ表示
        this.isLoading = true;
        this.$emit('on-message', '');

        try {
          this.nen = this.propNentsuki.toString().substring(0, 4);
          this.tsuki = this.propNentsuki.toString().substring(4);
          this.shu = this.propShu;

          this.url = NENTSUKI_SHU_KANRI_REF_URL;
          this.url = this.url.replace("{1}", this.propNentsuki).replace("{2}", this.propShu);
          
          const response = await axios.get(this.url);
          const result = response.data.mNentsukiShuKanri[0];
          
          if (result && result.nentsuki !== null) {
            this.nen = result.nentsuki.toString().substring(0, 4);
            this.tsuki = result.nentsuki.toString().substring(4);
            this.shu = result.shu;
            this.shuFrom = result.shuFrom.toString();
            this.shuTo = result.shuTo.toString();
          }
        } catch (error) {
          console.error(error);
          this.$emit('on-message', "データの取得に失敗しました。");
        } finally {
          this.isLoading = false;
        }
      }
    },
    async btnToroku() {
      // バリデーション
      if (this.nen == null || this.tsuki == null || this.shu === null || 
          this.shuFrom == null || this.shuTo === null) {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      this.tsuki = this.tsuki.toString().padStart(2, '0');
      if (!commonUtils.isValidateDate(this.nen + this.tsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月").replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }

      // ★送信オーバーレイ表示
      this.isSubmitting = true;
      this.$emit('on-message', "");

      try {
        const formatDateForSubmit = (date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const postData = {
          nentsuki: this.nen + this.tsuki,
          shu: this.shu,
          shuFrom: formatDateForSubmit(this.shuFrom),
          shuTo: formatDateForSubmit(this.shuTo),
          torokuDay: "",
          koushinDay: ""
        };

        this.url = NENTSUKI_SHUKANRI_URL;
        await axios.post(this.url, postData);
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error("失敗:", error);
        alert("登録に失敗しました。");
        this.isSubmitting = false; 
      }
    },
    handleSelectNentsuki(selectedData) {
      this.$emit('on-message', '');
      this.nen = selectedData.nentsuki.toString().substring(0, 4);
      this.tsuki = selectedData.nentsuki.toString().substring(4);
      this.shu = selectedData.shu;
      this.shuFrom = selectedData.shuFrom.toString()
      this.shuTo = selectedData.shuTo.toString()
      this.nentsukiShu = this.nen + this.tsuki + this.shu;
    },
    updateFormattedDate() {
      if (this.selectedDate) this.formattedDate = format(this.selectedDate, 'yyyy/MM/dd');
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    btnNentsukiRefDialogOpen() { this.nentsukiShuRefDialogComponent = true; },
    btnNentsukiRefDialogClose() { this.nentsukiShuRefDialogComponent = false; },
    init(){
      this.nen = null;
      this.tsuki = null;
      this.shu = null;
      this.shuFrom = null;
      this.shuTo = null;
      this.msg = '';
      this.nentsukiShu = null;
      this.isLoading = false;
      this.isSubmitting = false;
    },
  },
}
</script>

<style scoped>
/* 共通オーバーレイ設定 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 30px 50px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.loader-overlay {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rounded-button:disabled, .rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
