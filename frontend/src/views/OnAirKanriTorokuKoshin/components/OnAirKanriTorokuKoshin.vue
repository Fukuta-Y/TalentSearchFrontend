<template>
  <table align="center">
      <tr>
        <td>ID： </td>
        <td>
          <label>{{ getId() }}</label>
        </td>
        <button v-on:click="btnIdRefDialogOpen()" class="rounded-ref-button">
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
        <td class="date-picker" v-show="!idRefDialogComponent">
          <Datepicker v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }" class="rounded-datepicker" language="ja" placeholder="例：2023-04-18 11:50"></Datepicker>
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
          <button v-on:click="btnProgramRefDialogOpen()" class="rounded-ref-button">
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
        <button v-on:click="btnTalentRefDialogOpen()" class="rounded-ref-button">
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
          <button v-on:click="btnNentsukiRefDialogOpen()" class="rounded-ref-button">
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
      <button v-on:click="btnToroku()" class="rounded-button">
        <label>{{ getTorokuKoshinName }}</label>
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()" class="rounded-button">
        クリア
      </button>
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
  props: {
  },
  computed: {
      // ラベルの木切り替え
    getTorokuKoshinName() {
      return this.id === '' ? '登録' : '更新';
    },
  },
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
      id: null,
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
      nentsukiShuKanri: [],
      idRefDialogComponent: false,
      programRefDialogComponent: false,
      talentRefDialogComponent: false,
      nentsukiShuRefDialogComponent: false,
    };
  },
  watch: {
    selectedDate: function (newDate) {
      // 日付をフォーマットして表示用の変数にセット
      this.formattedDate = this.formatDate(newDate);
    },
  },
  async created() {
      // 初期化
      this.btnClear();
      // 前画面からの値で検索処理を行う。
  },
  methods: {
    // IDの参照時の戻り
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
    // 番組IDの参照時の戻り
    handleSelectProgram(selectedData) {
      this.$emit('on-message', "");
      this.programId =  selectedData.programId;
      this.programName = selectedData.programName;
    },
    // タレントIDの参照時の戻り
    handleSelectTalent(selectedData) {
      this.$emit('on-message', "");
      this.talentId = selectedData.talentId;
      this.talentName = selectedData.talentName;
    },
    // 年月週の参照時の戻り
    handleSelectNentsuki(selectedData) {
      this.$emit('on-message', "");
      this.nen = selectedData.nentsuki.toString().substring(0, 4);
      this.tsuki = selectedData.nentsuki.toString().substring(4);
      this.shu = selectedData.shu;
      this.shuFrom = selectedData.shuFrom;
      this.shuTo = selectedData.shuTo;
      this.propNentsukiShu = this.nen + this.tsuki + this.shu;
      this.nentsukiShu = `${this.nen}/${this.tsuki} ${this.shu}週`;
    },
     getId() {
      // this.idが空文字の場合とそうでない場合でラベルを変更
      return this.id === '' ? '（新規登録）' : this.id;
    },
    updateFormattedDate() {
      this.formattedDate = this.formatDate(this.selectedDate);
    },
    formatDate(date) {
      return format(date, 'yyyy/MM/dd');
    },
    // 初期化ボタン
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    // ID参照ボタン
    btnIdRefDialogOpen() {
      // ダイアログができたら作成
      this.idRefDialogComponent = true;
    },
    // ID参照ボタン
    btnIdRefDialogClose() {
      // ダイアログができたら作成
      this.idRefDialogComponent = false;
    },
    // 番組参照ボタン
    btnProgramRefDialogOpen() {
      // ダイアログができたら作成
      this.programRefDialogComponent = true;
    },
    // 番組参照ボタン
    btnProgramRefDialogClose() {
      // ダイアログができたら作成
      this.programRefDialogComponent = false;
    },
    // タレント参照ボタン
    btnTalentRefDialogOpen() {
      // ダイアログができたら作成
      this.talentRefDialogComponent = true;
    },
    // タレント参照ボタン
    btnTalentRefDialogClose() {
      // ダイアログができたら作成
      this.talentRefDialogComponent = false;
    },
    // 年月週参照ボタン
    btnNentsukiRefDialogOpen() {
      // ダイアログができたら作成
      this.nentsukiShuRefDialogComponent = true;
    },
    // 年月週参照ボタン
    btnNentsukiRefDialogClose() {
      // ダイアログができたら作成
      this.nentsukiShuRefDialogComponent = false;
    },
    // 登録・更新ボタン
    async btnToroku() {
      this.fetchData();
    },
    // 更新系処理
    async fetchData() {
      // ① 全項目が必須で入力されていること。
      if (this.onAirDay === '' ||
          this.programId === '' || this.programName.trim() === '' ||
          this.talentId === '' || this.talentName.trim() === '' ||
          this.nentsukiShu === null) {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      // ② IDが8桁以内であること。
      if (!commonUtils.isValidMaxLength(this.id, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "ID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      
      // ③ オンエア日がYYYY-MM-DD HH:MM形式であること。
      if (this.onAirDay !== '') {
        const dateObject = new Date(this.onAirDay);
        const year = dateObject.getFullYear();
        const month = `0${dateObject.getMonth() + 1}`.slice(-2);
        const day = `0${dateObject.getDate()}`.slice(-2);
        const hours = `0${dateObject.getHours()}`.slice(-2);
        const minutes = `0${dateObject.getMinutes()}`.slice(-2);
        this.onAirDay = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      if (!commonUtils.isCheckDateTime(this.onAirDay)) {
        this.msg = msgList['MSG003'].replace('{0}', "オンエア日時");
        this.msg = this.msg.replace('{1}', "YYYY-MM-DD HH:MM");
        this.$emit('on-message', this.msg);
        return;
      }

      // ④ 番組IDが8桁以内であること。
      if (!commonUtils.isValidMaxLength(this.programId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組ID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ 番組名が30桁以内であること。
      if (!commonUtils.isValidMaxLength(this.programName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ タレントIDが8桁以内であること。
      if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレントID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑦ タレント名が30桁以内であること。
      if (!commonUtils.isValidMaxLength(this.talentName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレント名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // 年月・週チェック
      // ⑧ 年月がYYYY/MM/01で有効な日付であること。
      this.nen =  this.nentsukiShu.toString().slice(0, 4);
      this.tsuki = this.nentsukiShu.toString().slice(5, 7).padStart(2, '0')
      this.shu = this.nentsukiShu.toString().slice(-2, -1)

      if (!commonUtils.isValidateDate(this.nen + this.tsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月");
        this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑨ 週が数値であること。
      if (this.shu !== '' && !commonUtils.isValidNumber(Number(this.shu))) {
        this.msg = msgList['MSG003'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // 10.週が1～5の数値のいずれかであること。
      if (this.shu !== '' && !commonUtils.isValidRange(Number(this.shu), 1, 5)) {
        this.msg = msgList['MSG004'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "1");
        this.msg = this.msg.replace('{2}', "5");
        this.$emit('on-message', this.msg);
        return;
      }

      // Dateオブジェクトを作成
      const dateObject = new Date(this.onAirDay);

      // 年月日時分秒の各部分を取得
      const year = dateObject.getFullYear();
      const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
      const day = ('0' + dateObject.getDate()).slice(-2);
      const hours = ('0' + dateObject.getHours()).slice(-2);
      const minutes = ('0' + dateObject.getMinutes()).slice(-2);
      const seconds = ('0' + dateObject.getSeconds()).slice(-2);

      // フォーマットされた日付文字列を返す
      this.onAirDay = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      // データオブジェクトを作成
      const postData = {
        id: this.id != '' ? this.id : '00000000',
        onAirDay: this.onAirDay,
        programId: this.programId,
        talentId: this.talentId,
        nentsuki: this.nen + this.tsuki,
        shu: this.shu,
        deleteFlg: "0",
        torokuDay: "",
        koushinDay: ""
      };

      // 年月週管理登録・更新BFF（登録・更新モード共通）
      this.url = ON_AIR_KANRI_INFO_URL;
      // POSTリクエストを行う
      axios.post(this.url, postData).then(response => {
          console.log("成功時の戻り値:" + JSON.stringify(response.data));
          this.$router.push({ name: 'main', });
        })
        .catch(error => {
          // エラー時の処理
          console.log("失敗パラメータ:" + JSON.stringify(postData));
          alert("登録失敗しました！", error);
        });
    },
    // 初期化
    init(){
      this.id = '';
      this.onAirDay = null;
      this.programId = null;
      this.programName = '',
      this.talentId = null;
      this.talentName = '',
      this.nentsukiShu = null;
      this.propNentsukiShu = null;
      this.msg = '';
    },
  },
}
</script>
<style scoped>
</style>