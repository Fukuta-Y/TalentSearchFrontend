<template>
  <table align="center">
      <tr>
        <td>ID： </td>
        <td>
          <label>{{ getId() }}</label>
        </td>
        <button v-on:click="btnIdRefDialogOpen()">
          <label>参照</label>
        </button>
        <OnAirKanriRefDialog 
          v-bind:prop-id="id"
          v-bind:prop-on-air-day="onAirDay"
          :is-open="idRefDialogComponent" 
          @close="btnIdRefDialogClose()" 
          v-on:on-select-id="handleSelectId" 
        />
      </tr>
      <tr>
        <td>オンエア日： </td>
        <td class="date-picker">
          <Datepicker v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }" language="ja" v-show="mode === '1' || !idRefDialogComponent"></Datepicker>
        </td>
      </tr>
      <tr>
          <td>番組ID： </td>
          <td>
            <Field 
              name="programId" 
              v-model="programId"
              size="9"
              label="番組ID"
              rules="required"
              maxlength="8"
              :disabled="true" 
            />
          </td>
          <button v-on:click="btnProgramRefDialogOpen()">
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
      </tr>
      <tr>
        <td>番組名： </td>
          <td>
          <label>{{ this.programName }}</label>
        </td>
      </tr>
      <tr>
        <td>タレントID： </td>
        <td>
          <Field 
            name="talentId" 
            v-model="talentId"
            size="9"
            label="タレントID"
            rules="required"
            maxlength="8"
            :disabled="true" 
          />
        </td>
        <button v-on:click="btnTalentRefDialogOpen()">
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
      </tr>
      <tr>
        <td>タレント名： </td>
          <td>
          <label>{{ this.talentName }}</label>
        </td>
      </tr>
      <tr>
        <td>対象年月・週： </td>
        <td>
          <Field 
            name="nentsukiShu" 
            v-model="nentsukiShu"
            size="15"
            label="対象年月・週"
            rules="required"
            :disabled="true" 
          />
          </td>
          <button v-on:click="btnNentsukiRefDialogOpen()">
            <label>参照</label>
          </button>
          <NetsukiShuKanriRefDialog 
            v-bind:prop-nentsuki-shu-="nentsukiShu"
            :is-open="nentsukiShuRefDialogComponent" 
            @close="btnNentsukiRefDialogClose()" 
            v-on:on-select-nentsuki-shu="handleSelectNentsuki" 
          />
      </tr>
    </table>
    <br/>
    <br/>
    <div>
      <button v-on:click="btnToroku()">
        <label>{{ getTorokuKoshinName }}</label>
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()">
        クリア
      </button>
  </div>
</template>

<script>
import { Field } from 'vee-validate'
import axios from 'axios'
import NetsukiShuKanriRefDialog from '../../NetsukiShuKanriRefDialog/NetsukiShuKanriRefDialogBaseForm.vue';
import OnAirKanriRefDialog from '../../OnAirKanriRefDialog/OnAirKanriRefDialogBaseForm.vue';
import ProgramRefDialog from '../../ProgramRefDialog/ProgramRefDialogBaseForm.vue';
import TalentRefDialog from '../../TalentRefDialog/TalentRefDialogBaseForm.vue';
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';

export default {
  name: 'OnAirKanriTorokuKoshin',
  props: {
    propId: {
      type: String,
    },
    mode: {
      type: String,
    },
  },
  computed: {
      // ラベルの木切り替え
    getTorokuKoshinName() {
      // this.modeが1の時は新規登録/2の時は更新モード
      return this.mode === '1' ? '登録' : '更新';
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
      id: this.propId,
      onAirDay: null,
      programId: null,
      programName: null,
      talentId: null,
      talentName: null,
      nentsukiShu: null,
      nentsuki: null,
      shu: null,
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
  async mounted() {
    // APIからデータを取得するメソッドを呼び出す
    this.fetchData();
  },
  methods: {
    // IDの参照時の戻り
    handleSelectId(selectedData) {
      this.id = selectedData.id
      this.onAirDay = selectedData.onAirDay
      this.programId = selectedData.programId
      this.programName = selectedData.programName
      this.talentId = selectedData.talentId
      this.talentName = selectedData.talentName
      this.nentsuki = selectedData.nentsuki
      this.shu = selectedData.shu
      this.nentsukiShu = `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週`;
    },
    // 番組IDの参照時の戻り
    handleSelectProgram(selectedData) {
      this.programId =  selectedData.programId
      this.programName = selectedData.programName
    },
    // タレントIDの参照時の戻り
    handleSelectTalent(selectedData) {
      this.talentId = selectedData.talentId
      this.talentName = selectedData.talentName
    },
    // 年月週の参照時の戻り
    handleSelectNentsuki(selectedData) {
      this.nen = selectedData.nentsuki.toString().substring(0, 4);
      this.tsuki = selectedData.nentsuki.toString().substring(4);
      this.shu = selectedData.shu
      this.shuFrom = selectedData.shuFrom
      this.shuTo = selectedData.shuTo
      this.nentsukiShu = `${this.nen}/${this.tsuki} ${this.shu}週`;
    },
     getId() {
      // this.idが空文字の場合とそうでない場合でラベルを変更
      return this.id === '' ? '（新規登録）' : this.id;
    },
    // 初期表示時
    async fetchData() {
      // 更新時の場合
      if (this.id !== '') {
        // 番組情報BFF（更新時のみ）※
        const onAirKanriUrl  = "http://localhost:8081/api/onAirKanriRefBFF?id=" + this.propId + "&onAirDay=";
        const onAirKanri = await axios.get(onAirKanriUrl).then(response => (response.data.tOnAirKanriRef[0]))
        if (onAirKanri.id !== '') {
          this.id = onAirKanri.id;
          this.onAirDay = onAirKanri.onAirDay;
          this.programId = onAirKanri.programId;
          this.programName = onAirKanri.programName;
          this.talentId = onAirKanri.talentId;
          this.talentName = onAirKanri.talentName;
          this.netuski = onAirKanri.netuski;
          this.shu = onAirKanri.shu;
          this.nentsukiShu = `${String(onAirKanri.nentsuki).substring(0, 4)}/${String(onAirKanri.nentsuki).substring(4, 6)} ${onAirKanri.shu}週`;
        }
      }
      // 年月週管理マスタ検索BFF
      const nentsukiShuKanriUrl = "http://localhost:8081/api/nentsukiShuKanriBFF";
      this.nentsukiShuKanriTmp = await axios.get(nentsukiShuKanriUrl).then(response => response.data.mNentsukiShuKanri);
      this.nentsukiShuKanriTmp = this.nentsukiShuKanriTmp.map(item => ({ nentsuki: item.nentsuki, shu: item.shu }));
       // nentsukiの前の４文字を○年、後ろの２文字を△月、shuを□週として結合
      this.nentsukiShuKanri =  this.nentsukiShuKanriTmp.map(item => {
        const year = String(item.nentsuki).substring(0, 4);
        const month = String(item.nentsuki).substring(4, 6);
        const week = item.shu;
        return `${year}/${month} ${week}週`;
      });
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
      // 全項目入力済みでない場合は止める
      if (this.onAirDay === null || this.programId === null || this.talentId === null || this.nentsukiShu === null) {
        this.msg = "全項目入力必須"
        this.$emit('on-message', this.msg)
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
        id: this.mode != '1' ? this.id : '00000000',
        onAirDay: this.onAirDay,
        programId: this.programId,
        talentId: this.talentId,
        nentsuki: this.nentsukiShu.toString().slice(0, 4) + this.nentsukiShu.toString().slice(5, 7),
        shu: this.nentsukiShu.toString().slice(-2, -1),
        deleteFlg: "0",
        torokuDay: "",
        koushinDay: ""
      };
      console.log('data:' + JSON.stringify(postData));
      // 年月週管理登録・更新BFF（登録・更新モード共通）
      const onAirKanriInfoUrl = "http://localhost:8081/api/onAirKanriInfoBFF";

      // POSTリクエストを行う
      axios.post(onAirKanriInfoUrl, postData).then(response => {
          console.log("成功時の戻り値:" + JSON.stringify(response.data));
          this.$router.push({ name: 'main', })
        })
        .catch(error => {
          // エラー時の処理
          console.log("失敗パラメータ:" + JSON.stringify(postData));
          alert("登録失敗しました！", error);
        });
    },
    // 初期化
    init(){
      this.id = null
      this.onAirDay = null
      this.programId = null
      this.programName = null
      this.talentId = null
      this.talentName = null
      this.nentsukiShu = null
    },
  },
}
</script>
<style scoped>
.custom-select {
  width: 150px;
  /* 任意の幅を指定してください */
  padding: 2px;
  /* 適切なパディングを指定してください */
  box-sizing: border-box;
}
/* 最低限のstyle */
.date-picker {
  margin: 60px auto 0;
  width: 60%;
}
</style>