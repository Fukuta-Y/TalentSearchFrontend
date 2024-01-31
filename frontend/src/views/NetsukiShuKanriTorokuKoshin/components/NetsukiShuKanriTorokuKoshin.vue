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
import { NENTSUKI_SHUKANRI_GET_URL, NENTSUKI_SHUKANRI_URL } from '../../../router/constList';

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
    };
  },
  watch: {
    selectedDate: function (newDate) {
      // 日付をフォーマットして表示用の変数にセット
      this.formattedDate = this.formatDate(newDate);
    },
  },
  async created() {
    this.init();
    this.$emit('on-message', this.msg);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // 更新時の場合
      if (this.mode !== '1' && this.propNentsuki !== '' && this.propShu != '')  {
        // 取得処理を開始
        this.url = NENTSUKI_SHUKANRI_GET_URL;
        this.url = this.url.replace("{1}", this.propNentsuki);
        this.url = this.url.replace("{2}", this.propShu);
        const result = await axios.get(this.url).then(response => (response.data.mNentsukiShuKanri[0]));
        if (result && result.nentsuki !== null) {
          this.nen = result.nentsuki.toString().substring(0, 4);
          this.tsuki = result.nentsuki.toString().substring(4);
          this.shu = result.shu;
          this.shuFrom = result.shuFrom.toString().substring(0, 8);
          this.shuTo = result.shuTo.toString().substring(0, 8);
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

      //① 全項目が必須で入力されていること。
      if (this.nen == null || this.tsuki == null || this.shu === null || 
          this.shuFrom == null || this.shuTo === null) {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      // ② 年月がYYYYMM形式であること。
      // ③ 年月がYYYY/MM/01で有効な日付であること。
      this.tsuki = this.tsuki.toString().padStart(2, '0')
      if (!this.isValidateDate(this.nen + this.tsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月");
        this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }

      // ④ 週が数値であること。
      if (this.shu !== '' && !this.isValidNumber(Number(this.shu))) {
        this.msg = msgList['MSG003'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ 週が1～5の数値のいずれかであること。
      if (this.shu !== '' && !this.isValidRange(Number(this.shu), 1, 5)) {
        this.msg = msgList['MSG004'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "1");
        this.msg = this.msg.replace('{2}', "5");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ 週の開始日（日曜日）がYYYY - MM - DD HH: MM形式であること。
      if (this.shuFrom !== '') {
        const dateObject = new Date(this.shuFrom);
        const year = dateObject.getFullYear();
        const month = `0${dateObject.getMonth() + 1}`.slice(-2);
        const day = `0${dateObject.getDate()}`.slice(-2);
        const hours = `0${dateObject.getHours()}`.slice(-2);
        const minutes = `0${dateObject.getMinutes()}`.slice(-2);
        this.shuFrom = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      if (!this.isCheckDateTime(this.shuFrom)) {
        this.msg = msgList['MSG003'].replace('{0}', "週の開始日（日曜日）");
        this.msg = this.msg.replace('{1}', "YYYY/MM/DD HH:MM");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑦ 週の終了日（土曜日）がYYYY - MM - DD HH: MM形式であること。
      if (this.shuTo !== '') {
        const dateObject = new Date(this.shuTo);
        const year = dateObject.getFullYear();
        const month = `0${dateObject.getMonth() + 1}`.slice(-2);
        const day = `0${dateObject.getDate()}`.slice(-2);
        const hours = `0${dateObject.getHours()}`.slice(-2);
        const minutes = `0${dateObject.getMinutes()}`.slice(-2);
        this.shuTo = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      if (!this.isCheckDateTime(this.shuTo)) {
        this.msg = msgList['MSG003'].replace('{0}', "週の終了日（土曜日）");
        this.msg = this.msg.replace('{1}', "YYYY/MM/DD HH:MM");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑧週の開始日（日曜日）と週の終了日（土曜日）を比較して以下であること。
      // ・週の開始日（日曜日）より週の終了日（土曜日）の方が日付が後であること。
      const dateFrom = new Date(this.shuFrom).getTime();
      const dateTo = new Date(this.shuTo).getTime();
      if(dateFrom > dateTo) {
        this.msg = msgList['MSG008'].replace('{0}', "週の終了日（土曜日）");
        this.msg = this.msg.replace('{1}', "週の開始日（日曜日）");
        this.$emit('on-message', this.msg);
        return;
      }
      // 週の開始日（日曜日）と週の終了日（土曜日）の日付間隔が6日間であること。
      if (this.isDateDifferenceDays(dateTo, dateFrom) !== 6) {
        this.msg = msgList['MSG009'].replace('{0}', "週の開始日（日曜日）");
        this.msg = this.msg.replace('{1}', "週の終了日（土曜日）");
        this.msg = this.msg.replace('{2}', "6日間");
        this.$emit('on-message', this.msg);
        return;
      }

      // 年月の変換処理
      const targetNentsuki = this.nen + "-" + this.tsuki;
      const targetFromDay = this.shuFrom.toString().substring(8, 10);
      const targetToDay = this.shuTo.toString().substring(8, 10);

      // 週の開始日が25日以降でない、かつ週の終了日が6日以内でない場合は、
      // 週の開始日、週の終了日ともに、チェックする年月は入力した年月とする。
      if(Number(targetFromDay) < 25 && Number(targetToDay) > 6) {

        // ⑥週の開始日（日曜日）のYYYY / MMの内容が年月と合致すること。
        if (targetNentsuki !== this.shuFrom.substring(0, 7)) {
          this.msg = msgList['MSG010'].replace('{0}', "週の開始日（日曜日）");
          this.$emit('on-message', this.msg);
          return;
        }

        // ⑦週の終了日（土曜日）のYYYY/MMの内容が年月と合致すること。
        // →MSG010（週の終了日（土曜日））
        if (targetNentsuki !== this.shuTo.substring(0, 7)) {
          this.msg = msgList['MSG010'].replace('{0}', "週の終了日（土曜日）");
          this.$emit('on-message', this.msg);
          return;
        }

      } else {

        // 週の終了日が1-6日未満の場合は、週の開始日の年月チェックする時は、チェックする年月は入力した年月とする。
        // 週の終了日の年月チェックする時は、チェックする年月は入力した年月の翌月とする。
        if (targetToDay <= 6) {
          // 1ヶ月進める
          const originalDate = new Date(this.nen + "-" + this.tsuki + "-01");
          originalDate.setMonth(originalDate.getMonth() + 1);
          // フォーマットされた結果を取得
          const formattedResult = originalDate.toISOString().slice(0, 7);
          // 1ヶ月先の年月
          this.targetToNentsuki = formattedResult

          // ⑥週の開始日（日曜日）のYYYY / MMの内容が年月と合致すること。
          if (targetNentsuki !== this.shuFrom.substring(0, 7)) {
            this.msg = msgList['MSG010'].replace('{0}', "週の開始日（日曜日）");
            this.$emit('on-message', this.msg);
            return;
          }

          // ⑦週の終了日（土曜日）のYYYY/MMの内容が年月と合致すること。
          // →MSG010（週の終了日（土曜日））
          if (this.targetToNentsuki !== this.shuTo.substring(0, 7)) {
            this.msg = msgList['MSG010'].replace('{0}', "週の終了日（土曜日）");
            this.$emit('on-message', this.msg);
            return;
          }

        // ※週の開始日が25-31日未満の場合は、週の開始日の年月チェックする時は、チェックする年月は入力した前月とする。
        // 週の終了日の年月チェック時は、チェックする年月は入力した年月とする。
        } else if (targetFromDay >= 25) {

            // 1ヶ月戻す
            const originalDate = new Date(this.nen + "-" + this.tsuki + "-01");
            originalDate.setMonth(originalDate.getMonth() - 1);
            // フォーマットされた結果を取得
            const formattedResult = originalDate.toISOString().slice(0, 7);
            // 1ヶ月前の年月
            this.targetFromNentsuki = formattedResult

            // ⑥週の開始日（日曜日）のYYYY / MMの内容が年月と合致すること。
            if (this.targetFromNentsuki !== this.shuFrom.substring(0, 7)) {
              this.msg = msgList['MSG010'].replace('{0}', "週の開始日（日曜日）");
              this.$emit('on-message', this.msg);
              return;
            }

            // ⑦週の終了日（土曜日）のYYYY/MMの内容が年月と合致すること。
            // →MSG010（週の終了日（土曜日））
            if (targetNentsuki !== this.shuTo.substring(0, 7)) {
              this.msg = msgList['MSG010'].replace('{0}', "週の終了日（土曜日）");
              this.$emit('on-message', this.msg);
              return;
            }
        }
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
        nentsuki: this.nen + this.tsuki,
        shu: this.shu,
        shuFrom: fromData,
        shuTo: toData,
        torokuDay: "",
        koushinDay: ""
      };

      // 年月週管理登録・更新BFF（登録・更新モード共通）
      this.url = NENTSUKI_SHUKANRI_URL;
      axios.post(this.url, postData).then(response => {
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
    isValidRange(value) {
      // 1から5の範囲内にあるかどうかをチェック
      return value >= 1 && value <= 5;
    },
    isCheckDateTime(targetDate) {
      // 日時の正規表現パターン
      const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

      // 入力された日時がパターンに一致するかどうかを確認
      if (!dateTimePattern.test(targetDate)) {
        return false; // パターンに一致しない場合は無効な日時
      }

      // 日付の妥当性を検証
      const inputDate = new Date(targetDate);
      return !isNaN(inputDate.getTime()); // インスタンスが有効な日時であるかどうか
    },
    isDateDifferenceDays(targerDate1, targetDate2) {
      const differenceInMilliseconds = Math.abs(targerDate1 - targetDate2);
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      return differenceInDays;
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