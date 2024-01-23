<template>
    <div v-if="mode === '1'"><router-link :to="{ name: 'OnAirKanriTorokuKoshin', params: { mode: '2' } }">更新モード</router-link></div>
    <div v-if="mode !== '1'" ><router-link :to="{ name: 'OnAirKanriTorokuKoshin', params: { mode: '1' } }">新規登録モード</router-link></div>
    <table align="center">
       <tr>
          <td>ID： </td>
          <td v-if="mode !== '2'">
             <label>{{ getOnAirKanriId() }}</label>
          </td>
          <td v-if="mode !== '1'">
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
              <Datepicker v-model="shuFrom" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja"></Datepicker>
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
          <button v-on:click="btnRefDialog()">
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
          <button v-on:click="btnRefDialog()">
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
                <select id="genreDropdown" v-model="jyunjyo" class="custom-select">
                  <option value="" disabled style="display: none;"></option>
                  <option v-for="genre in this.genreInfo" :key="genre.jyunjyo" :value="genre.jyunjyo">
                    {{ genre.jyunjyo }}
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
  mounted() {
    console.log('this.mode:' + this.mode)
  },
  methods: {
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
    // 参照ボタン
    btnRefDialog() {
      // ダイアログができたら作成
    },
    // 登録・更新ボタン
    async btnToroku() {
      // 全項目入力済みでない場合は止める
      if (this.nen == null || this.tsuki === null || this.shu === null || this.shuFrom === null || this.shuTo === null) {
        this.msg = "全項目入力必須"
        this.$emit('on-message', this.msg)
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