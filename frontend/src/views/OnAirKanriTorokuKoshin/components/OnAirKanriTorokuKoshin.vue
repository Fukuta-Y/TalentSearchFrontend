<template>
    <div v-if="mode === '1'"><router-link :to="{ name: 'OnAirKanriTorokuKoshin', params: { mode: '2' } }">【更新】</router-link></div>
    <div v-if="mode !== '1'" ><router-link :to="{ name: 'OnAirKanriTorokuKoshin', params: { mode: '1' } }">【新規登録】</router-link></div>
    <table align="center">
       <tr>
          <td>ID： </td>
          <td v-if="mode === '1'">
              <label>{{ getOnAirKanriId() }}</label>
          </td>
          <td v-else>
            <Field 
              name="id" 
              v-model="id"
              size="9"
              label="ID"
              rules="required"
              maxlength="8"
              :disabled="true" 
            />
            </td>
        <button v-on:click="btnRefDialog()" v-if="mode !== '1'">
        <label>参照</label>
        </button>
        </tr>
        <tr>
           <td>オンエア日： </td>
           <td class="date-picker">
              <Datepicker v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
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
          <button v-on:click="btnProgramRefDialog()">
            <label>参照</label>
          </button>
        </tr>
        <tr>
          <td>番組名： </td>
            <td>
            <label>{{ getProgramName }}</label>
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
          <button v-on:click="btnTalentRefDialog()">
            <label>参照</label>
          </button>
        </tr>
        <tr>
          <td>タレント名： </td>
            <td>
            <label>{{ getTalentName }}</label>
          </td>
        </tr>
        <tr>
          <td>対象年月・週： </td>
          <td>
            <div>
                <select id="nentsukiShuDropDownList" v-model="nentsukiShu" class="custom-select">
                  <option value="" disabled style="display: none;"></option>
                  <option v-for="nentsukiShu in this.nentsukiShuKanri" :key="nentsukiShu" :value="nentsukiShu">
                    {{ nentsukiShu }}
                  </option>
                </select>
            </div>
          </td>
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

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';

export default {
  name: 'OnAirKanriTorokuKoshin',
  props: {
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
    getProgramName() {
      // TODO
      return 'NEWニューヨーク'
    },
    getTalentName() {
      // TODO
      return '香取慎吾'
    },
  },
  components: {
    Field,
    Datepicker,
  },
  emits: ['on-message'],
  data() {
    return {
      id: '', //TOOD
      onAirDay: null,
      programId: '00000002', //TOOD
      talentId: '00000003',  //TOOD
      nentsukiShu: null,
      nentsuki: null,
      shu: null,
      formattedDate: null,
      nentsukiShuKanri: [],
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
    if(this.mode !== '1') {
      this.getOnAirInfo(); // TODO（更新モードの時だけ）
    }
  },
  methods: {
     getId() {
      // this.idが空文字の場合とそうでない場合でラベルを変更
      return this.id === undefined ? '（新規登録）' : this.id;
    },
    // IDの参照後
    async getOnAirInfo() {
      // オンエア管理情報BFF（更新時のみ）
      const onAirKanriInfoUrl = "http://localhost:8081/api/onAirKanriInfoBFF/" + this.id;
      const onAirKanriInfo = await axios.get(onAirKanriInfoUrl).then(response => response.data.tOnAirKanri[0]);
      if (onAirKanriInfo.id !== null) {
        this.id = onAirKanriInfo.id
        this.onAirDay = onAirKanriInfo.onAirDay
        this.programId = onAirKanriInfo.programId
        this.talentId = onAirKanriInfo.talentId
        this.nentsuki = onAirKanriInfo.nentsuki
        this.shu = onAirKanriInfo.shu
        this.nentsukiShu = `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週`;
      }
    },
    // 初期表示時
    async fetchData() {
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
    getOnAirKanriId() {
      // this.modeが空文字の場合とそうでない場合でラベルを変更
      return this.mode === '1' ? '（新規登録）' : '';
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
    // 番組参照ボタン
    btnProgramRefDialog() {
      // ダイアログができたら作成
    },
    // タレント参照ボタン
    btnTalentRefDialog() {
      // ダイアログができたら作成
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
        id: this.id !== undefined && this.id != null ? this.id : '00000000',
        onAirDay: this.onAirDay,
        programId: this.programId,
        talentId: this.talentId,
        nentsuki: this.nentsukiShu.toString().slice(0, 4) + this.nentsukiShu.toString().slice(5, 7),
        shu: this.nentsukiShu.toString().slice(-2, -1),
        deleteFlg: "0",
        torokuDay: "",
        koushinDay: ""
      };
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
      this.talentId = null
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