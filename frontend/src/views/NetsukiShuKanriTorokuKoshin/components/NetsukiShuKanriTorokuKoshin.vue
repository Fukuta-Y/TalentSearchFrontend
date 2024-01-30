<template>
    <table align="center">
      <tr>
          <td>年月： </td>
          <td>
            <Field 
              name="nen" 
              v-model="nen"
              size="9"
              label="年"
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
              label="月"
              rules="required"
              maxlength="2"
              placeholder="例：04"
            />月
          <button v-on:click="btnNentsukiRefDialogOpen()">
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
        <tr v-if="!nentsukiShuRefDialogComponent">
          <td>週の開始日（日曜日）： </td>
          <td class="date-picker">
            <Datepicker v-model="shuFrom" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
          </td>
        </tr>
        <tr v-if="!nentsukiShuRefDialogComponent">
          <td>週の終了日（土曜日）： </td>
          <td class="date-picker">
            <Datepicker v-model="shuTo" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
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
import NetsukiShuKanriRefDialog from '../../NetsukiShuKanriRefDialog/NetsukiShuKanriRefDialogBaseForm.vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import msgList from '../../../router/msgList';

export default {
  name: 'NetsukiShuKanriTorokuKoshin',
  props: {
    mode: {
      type: String,
    },
    propNentsuki: {
      type: String,
    },
    propShu: {
      type: Number,
    },
  },
  computed: {
      // ラベルの木切り替え
    getTorokuKoshinName() {
      return this.nen === null && this.nen === null ? '登録' : '更新';
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
      shu: null,
      nentsukiShu: null,
      shuFrom: null, 
      shuTo: null,
      formattedDate: null,
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
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // 更新時の場合
      if (this.mode !== '1' && this.propNentsuki !== '' && this.propShu != '')  {
        const url = "http://localhost:8081/api/nentsukiShuKanrRefBFF?nentsuki=" + this.propNentsuki + "&shu=" + this.propShu;
        const result = await axios.get(url).then(response => (response.data.mNentsukiShuKanri[0]));
        if (result && result.nentsuki !== null) {
          this.nen = result.nentsuki.toString().substring(0, 4);
          this.tsuki = result.nentsuki.toString().substring(4);
          this.shu = result.shu;
          this.shuFrom = result.shuFrom;
          this.shuTo = result.shuTo;
        }
      }
    },
    // 年月週の参照時の戻り
    handleSelectNentsuki(selectedData) {
      this.$emit('on-message', '');
      this.nen = selectedData.nentsuki.toString().substring(0, 4);
      this.tsuki = selectedData.nentsuki.toString().substring(4);
      this.shu = selectedData.shu;
      this.shuFrom = selectedData.shuFrom.toString().substring(0, 8);
      this.shuTo = selectedData.shuTo.toString().substring(0, 8);
      this.nentsukiShu = this.nen + this.tsuki + this.shu;
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
      if (this.nen == null || this.tsuki === null || this.shu === null || this.shuFrom === null || this.shuTo === null) {
        this.msg = "全項目入力必須";
        this.$emit('on-message', this.msg);
        return;
      }

      // ①年が入力されている場合は、月と必須で入力であること。
      if (this.nen.trim() !== '') {
        if (this.tsuki.trim() === '') {
          this.msg = msgList['MSG002'].replace('{0}', "年と月");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ②月が入力されている場合は、年と必須で入力であること。
      if (this.tsuki.trim() !== '') {
        if (this.nen.trim() === '') {
          this.msg = msgList['MSG002'].replace('{0}', "年と月");
          this.$emit('on-message', this.msg);
          return;
        }
      }
      // ③年月がYYYYMM形式であること。
      // ④ 年月がYYYY/MM/01で有効な日付であること。
      if (this.nen.trim() !== '' && this.tsuki.trim() !== '' && !this.isValidateDate(this.nen + this.tsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月");
        this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ 週が数値であること。
      if (this.shu.trim() !== '' && !this.isValidNumber(Number(this.shu))) {
        this.msg = msgList['MSG003'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ 週が1～5の数値のいずれかであること。
      if (this.shu.trim() !== '' && !this.isValidRange(Number(this.shu), 1, 5)) {
        this.msg = msgList['MSG004'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "1");
        this.msg = this.msg.replace('{2}', "5");
        this.$emit('on-message', this.msg);
        return;
      }

      // FROMとTOをyyyy-mm-ddに形式変換
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fromData = formatDate(new Date(this.shuFrom));
      const toData = formatDate(new Date(this.shuTo));

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
      this.nen = null;
      this.tsuki = null;
      this.shu = null;
      this.shuFrom = null;
      this.shuTo = null;
      this.msg = '';
    },
    isValidDate(dateString) {
      return isNaN(Date.parse(dateString));
    },
    isValidateDate(dateString) {
      // 有効日付チェック
      const parsedDate = parseISO(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
      return isValid(parsedDate);
    },
    isValidNumber(value) {
      // 数値であるかどうかをチェック
      return typeof value === 'number';
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