<template>
  <div class="main-container">
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-content">
        <div class="loader"></div>
        <p>{{ getTorokuKoshinName }}処理中です...</p>
      </div>
    </div>

    <div v-if="isLoading" class="loading-area">
      <div class="loader"></div>
      <p>データを取得しています...</p>
    </div>

    <div v-show="!isLoading">
      <table align="center">
        <tr>
          <td>ID： </td>
          <td>
            <label>{{ getId() }}</label>
          </td>
          <button v-on:click="btnIdRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
            <label>参照</label>
          </button>
          <OnAirKanriRefDialog 
            v-bind:prop-id="id"
            v-bind:prop-on-air-day="onAirDay"
            :is-open="idRefDialogComponent" 
            @close="btnIdRefDialogClose()" 
            v-on:on-select-id="handleSelectId" 
          />
        </tr><br/>
        <tr v-if="!idRefDialogComponent">
          <td>オンエア日時： </td>
          <td class="date-picker">
            <Datepicker 
              v-model="onAirDay" 
              @input="updateFormattedDate" 
              :style="{ width: '250px' }" 
              class="rounded-datepicker" 
              language="ja" 
              placeholder="例：2023-04-18 11:50"
              :disabled="isSubmitting"
            />
          </td>
        </tr><br/>
        <tr>
            <td>番組ID： </td>
            <td>
              <Field 
                name="programId" 
                v-model="programId"
                size="9"
                label="番組ID"
                maxlength="8"
                :disabled="true" 
              />
            </td>
            <button v-on:click="btnProgramRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
              <label>参照</label>
            </button>
            <ProgramRefDialog 
              v-bind:prop-program-id="programId"
              v-bind:prop-program-name="programName"
              v-bind:is-program-toroku="false"
              :is-open="programRefDialogComponent" 
              @close="btnProgramRefDialogClose()" 
              v-on:on-select-program="handleSelectProgram" 
            />
        </tr><br/>
        <tr>
          <td>番組名： </td>
            <td>
            <label>{{ this.programName }}</label>
          </td>
        </tr><br/>
        <tr>
          <td>タレントID： </td>
          <td>
            <Field 
              name="talentId" 
              v-model="talentId"
              size="9"
              label="タレントID"            
              maxlength="8"
              :disabled="true" 
            /><br/>
          </td>
          <button v-on:click="btnTalentRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
            <label>参照</label>
          </button>
          <TalentRefDialog 
            v-bind:prop-talent-id="talentId"
            v-bind:prop-talent-name="talentName"
            v-bind:is-talent-toroku="false"
            :is-open="talentRefDialogComponent" 
            @close="btnTalentRefDialogClose()" 
            v-on:on-select-talent="handleSelectTalent" 
          />
        </tr><br/>
        <tr>
          <td>タレント名： </td>
            <td>
            <label>{{ this.talentName }}</label>
          </td>
        </tr><br/>
        <tr>
          <td>年月・週： </td>
          <td>
            <Field 
              name="nentsukiShu" 
              v-model="nentsukiShu"
              size="15"
              label="年月・週"
              :disabled="true" 
            />
            </td>
            <button v-on:click="btnNentsukiRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
              <label>参照</label>
            </button>
            <NetsukiShuKanriRefDialog 
              v-bind:prop-nentsuki-shu="propNentsukiShu"
              v-bind:is-nentsuki-shu="false"
              :is-open="nentsukiShuRefDialogComponent" 
              @close="btnNentsukiRefDialogClose()" 
              v-on:on-select-nentsuki-shu="handleSelectNentsuki" 
            />
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
import { ON_AIR_KANRI_INFO_URL } from '../../../router/constList';
import axios from 'axios'
import NetsukiShuKanriRefDialog from '../../NetsukiShuKanriRefDialog/NetsukiShuKanriRefDialogBaseForm.vue';
import OnAirKanriRefDialog from '../../OnAirKanriRefDialog/OnAirKanriRefDialogBaseForm.vue';
import ProgramRefDialog from '../../ProgramRefDialog/ProgramRefDialogBaseForm.vue';
import TalentRefDialog from '../../TalentRefDialog/TalentRefDialogBaseForm.vue';
import Datepicker from '@vuepic/vue-datepicker'
import msgList from '../../../router/msgList';
import '@vuepic/vue-datepicker/dist/main.css'
import '../../../router/styles/common.css';

export default {
  name: 'OnAirKanriTorokuKoshin',
  components: {
    Field,
    Datepicker,
    NetsukiShuKanriRefDialog,
    OnAirKanriRefDialog,
    ProgramRefDialog,
    TalentRefDialog,
  },
  emits: ['on-message'],
  data() {
    return {
      id: '',
      onAirDay: null,
      programId: null,
      programName: '',
      talentId: null,
      talentName: '',
      nentsukiShu: null,
      nen: null,
      tsuki: null,
      shu: null,
      propNentsukiShu: null,
      nentsuki: null,
      msg: '',
      url: '',
      formattedDate: null,
      idRefDialogComponent: false,
      programRefDialogComponent: false,
      talentRefDialogComponent: false,
      nentsukiShuRefDialogComponent: false,
      isLoading: false,    
      isSubmitting: false, 
    };
  },
  computed: {
    getTorokuKoshinName() {
      return this.id === '' ? '登録' : '更新';
    },
  },
  async created() {
    this.btnClear();
  },
  methods: {
    async btnToroku() {
      if (this.onAirDay === null || this.onAirDay === '' ||
          this.programId === null || this.programId === '' || this.programName.trim() === '' ||
          this.talentId === null || this.talentId === '' || this.talentName.trim() === '' ||
          this.nentsukiShu === null) {
        this.$emit('on-message', msgList['MSG007']);
        return;
      }

      if (this.id !== '' && !commonUtils.isValidMaxLength(this.id, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "ID").replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }

      this.isSubmitting = true;
      this.$emit('on-message', "");

      try {
        const dateObject = new Date(this.onAirDay);
        const y = dateObject.getFullYear();
        const m = ('0' + (dateObject.getMonth() + 1)).slice(-2);
        const d = ('0' + dateObject.getDate()).slice(-2);
        const hh = ('0' + dateObject.getHours()).slice(-2);
        const mm = ('0' + dateObject.getMinutes()).slice(-2);
        const ss = ('0' + dateObject.getSeconds()).slice(-2);
        const formattedOnAirDay = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

        this.nen = this.nentsukiShu.toString().slice(0, 4);
        this.tsuki = this.nentsukiShu.toString().slice(5, 7).padStart(2, '0');
        this.shu = this.nentsukiShu.toString().slice(-2, -1);

        const postData = {
          id: this.id !== '' ? this.id : '00000000',
          onAirDay: formattedOnAirDay,
          programId: this.programId,
          talentId: this.talentId,
          nentsuki: this.nen + this.tsuki,
          shu: this.shu,
          deleteFlg: "0",
          torokuDay: "",
          koushinDay: ""
        };

        this.url = ON_AIR_KANRI_INFO_URL;
        await axios.post(this.url, postData);
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error("失敗:", error);
        alert("登録に失敗しました。");
        this.isSubmitting = false; 
      }
    },
    handleSelectId(selectedData) {
      this.$emit('on-message', "");
      this.id = selectedData.id;
      this.onAirDay = selectedData.onAirDay;
      this.programId = selectedData.programId;
      this.programName = selectedData.programName;
      this.talentId = selectedData.talentId;
      this.talentName = selectedData.talentName;
      this.nentsuki = selectedData.nentsuki;
      this.shu = selectedData.shu;
      this.nentsukiShu = `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週`;
    },
    handleSelectProgram(selectedData) {
      this.$emit('on-message', "");
      this.programId = selectedData.programId;
      this.programName = selectedData.programName;
    },
    handleSelectTalent(selectedData) {
      this.$emit('on-message', "");
      this.talentId = selectedData.talentId;
      this.talentName = selectedData.talentName;
    },
    handleSelectNentsuki(selectedData) {
      this.$emit('on-message', "");
      const nen = selectedData.nentsuki.toString().substring(0, 4);
      const tsuki = selectedData.nentsuki.toString().substring(4);
      const shu = selectedData.shu;
      this.propNentsukiShu = nen + tsuki + shu;
      this.nentsukiShu = `${nen}/${tsuki} ${shu}週`;
    },
    getId() {
      return this.id === '' ? '（新規登録）' : this.id;
    },
    updateFormattedDate() {
      if (this.onAirDay) this.formattedDate = format(new Date(this.onAirDay), 'yyyy/MM/dd');
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    btnIdRefDialogOpen() { this.idRefDialogComponent = true; },
    btnIdRefDialogClose() { this.idRefDialogComponent = false; },
    btnProgramRefDialogOpen() { this.programRefDialogComponent = true; },
    btnProgramRefDialogClose() { this.programRefDialogComponent = false; },
    btnTalentRefDialogOpen() { this.talentRefDialogComponent = true; },
    btnTalentRefDialogClose() { this.talentRefDialogComponent = false; },
    btnNentsukiRefDialogOpen() { this.nentsukiShuRefDialogComponent = true; },
    btnNentsukiRefDialogClose() { this.nentsukiShuRefDialogComponent = false; },
    init(){
      this.id = '';
      this.onAirDay = null;
      this.programId = null;
      this.programName = '';
      this.talentId = null;
      this.talentName = '';
      this.nentsukiShu = null;
      this.propNentsukiShu = null;
      this.msg = '';
      this.isLoading = false;
      this.isSubmitting = false;
    },
  },
}
</script>

<style scoped>
/* ★画面全体をロックするオーバーレイ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* 半透明の黒 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 最前面 */
}

/* オーバーレイの中身 */
.loading-content {
  background-color: white;
  padding: 30px 50px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* ぐるぐる本体 */
.loader {
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

.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.rounded-button:disabled, .rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
