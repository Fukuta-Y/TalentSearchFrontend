<template>
  <div>
    <table align="center">
        <tr>
          <td>年月： </td>
          <td>
            <Field 
              name="nen" 
              v-model="nen"
              size="9"
              label="対象年"
              rules="required"
              maxlength="4"
              placeholder="例：2023"
            /> 年
          </td>
          <td>
            <Field 
              name="tsuki" 
              v-model="tsuki"
              size="6"
              label="対象月"
              rules="required"
              maxlength="2"
              placeholder="例：4"
            />月
          </td>
        </tr>
        <tr>
          <td>週： </td>
          <td>
            <Field 
              name="shu" 
              rules="required"
              v-model="shu"
              label="週"
              maxlength="1"
              size="5"
              placeholder="例：3"
            /> 週目
          </td>
        </tr>
        <tr>
           <td>週の開始日（日曜日）： </td>
           <td class="date-picker">
              <Datepicker v-model="shuFrom" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
          </td>
        </tr>
        <tr>
          <td>週の終了日（土曜日）： </td>
          <td class="date-picker">
            <Datepicker v-model="shuTo" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
          </td>
        </tr>
    </table>
    </div>
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
  name: 'NetsukiShuKanriTorokuKoshin',
  props: {
    talentId: {
      type: String,
    },
  },
  computed: {
    // ラベルの木切り替え
    getTorokuKoshinName() {
      // this.talentIdが空文字の場合とそうでない場合でラベルを変更
      return this.talentId === undefined ? '登録' : '更新';
    },
  },
  components: {
    Field,
    Datepicker,
  },
  emits: ['on-message'],
  data() {
    return {
      nen: null,
      tsuki: null,
      shu: null,
      shuFrom: null, 
      shuTo: null,
      formattedDate: null,
    };
  },
  watch: {
    selectedDate: function (newDate) {
      // 日付をフォーマットして表示用の変数にセット
      this.formattedDate = this.formatDate(newDate);
    },
  },
  methods: {
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
    // 登録・更新ボタン
    async btnToroku() {
      // 全項目入力済みでない場合は止める
      if (this.nen == null || this.tsuki === null || this.shu === null || this.shuFrom === null || this.shuTo === null) {
        this.msg = "全項目入力必須"
        this.$emit('on-message', this.msg)
        return;
      }

      // FROMをyyyy-mm-ddに形式変換
      const fromDate = new Date(this.shuFrom);
      const fromYear = fromDate.getFullYear();
      const fromMonth = String(fromDate.getMonth() + 1).padStart(2, "0");
      const fromDay = String(fromDate.getDate()).padStart(2, "0");
      const fromData = `${fromYear}-${fromMonth}-${fromDay}`;
      // TOをyyyy-mm-ddに形式変換
      const toDate = new Date(this.shuTo);
      const toYear = toDate.getFullYear();
      const toMonth = String(toDate.getMonth() + 1).padStart(2, "0");
      const toDay = String(toDate.getDate()).padStart(2, "0");
      const toData = `${toYear}-${toMonth}-${toDay}`;

      // データオブジェクトを作成
      const postData = {
        nentsuki: this.nen + this.tsuki.toString().padStart(2, '0'),
        shu: this.shu,
        shuFrom: fromData,
        shuTo: toData,
        torokuDay: "",
        koushinDay: ""
      };

      // 年月週管理登録・更新BFF（登録・更新モード共通）
      const nentsukiShuKanriUrl = "http://localhost:8081/api/nentsukiShuKanriBFF";

      // POSTリクエストを行う
      axios.post(nentsukiShuKanriUrl, postData).then(response => {
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
      this.nen = null
      this.tsuki = null
      this.shu = null
      this.shuFrom = null
      this.shuTo = null
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