<template>
  <div>
    <table align="center">
      <tr>
        <td>ID： </td>
        <td>
          <Field 
            name="id" 
            v-model="id"
            size="15"
            label="ID"
            maxlength="8"
            placeholder="例：10000001"
            class="rounded-textbox"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /> 
        </td> 
      </tr>
      <tr>
        <td>オンエア日時： </td>
        <td class="date-picker">
          <Datepicker v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja" class="rounded-datepicker" placeholder="例：2023-04-18 11:50"></Datepicker>
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="shu" /> 
        </td> 
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage name="name" />
        </td> 
      </tr>
    </table>
    <br>
    <div>
      <button v-on:click="btnSearch()" class="rounded-ref-button">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()" class="rounded-ref-button">
        クリア
      </button>
    </div>
    <br>
    <div style="overflow-y: auto;">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table" v-if="isCount">
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow;width:80px;">ID </td>
          <td style="background-color: greenyellow;width:160px;">オンエア日時</td>
          <td style="background-color: greenyellow;width:80px;">番組ID</td>
          <td style="background-color: greenyellow; width:130px;">番組名</td>
          <td style="background-color: greenyellow;">タレントID</td>
          <td style="background-color: greenyellow; width:150px;">タレント名</td>
          <td style="background-color: greenyellow; width:115px;">年月・週</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectId(item.id, item.onAirDay, item.programId, item.programName, item.talentId, item.talentName, item.nentsuki, item.shu)">選択</button></td>
          <td>{{ item.id }} </td>
          <td>{{ item.onAirDay.toString().substring(0, 16) }} </td>
          <td><router-link :to="{ name: 'ProgramTorokuKoshin', params: { programId: item.programId } }">{{ item.programId }}</router-link></td>
          <td>{{ item.programName }} </td>
          <td><router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: item.talentId } }">{{ item.talentId }}</router-link></td>
          <td>{{ item.talentName }} </td>
          <td><router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { mode: '2', nentsuki: item.nentsuki, shu: item.shu } }">{{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}</router-link></td>
        </tr>
      </table>
      <div v-if="isCount">
        <div class="pagination-container">
          <a  v-on:click="changePage(1)" :disabled="currentPage === 1" class="pagination-link">最初</a>
          <a
            v-for="pageNumber in totalPageLinks"
            :key="pageNumber"
             v-on:click="pageNumber !== '...' ? changePage(pageNumber) : null"
            class="pagination-link"
          >
            <span v-if="pageNumber !== '...'">
              <span class="underlined">{{ pageNumber }}</span>
            </span>
            <span v-else>...</span>
          </a>
          <a  v-on:click="changePage(totalPages)" :disabled="currentPage === totalPages" class="pagination-link">最後</a>
        </div>
      </div>
    </div>
    <br>
  </div>
</template>
<script>
import { Field, ErrorMessage } from 'vee-validate'
import { format } from 'date-fns';
import { ON_AIR_KANRI_REF_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import axios from 'axios'
import Datepicker from '@vuepic/vue-datepicker'
import msgList from '../../../router/msgList';
import '@vuepic/vue-datepicker/dist/main.css'
import '../../../router/styles/common.css';

export default {
  name: 'OnAirKanriRefSearchJoken',
  props: {
    propId: {
      type: String,
    },
    propOnAirDay: {
      type: Date,
    },
  },
  components: {
    Field,
    Datepicker,
    ErrorMessage,
  },
  watch: {
    selectedDate: function (newDate) {
      // 日付をフォーマットして表示用の変数にセット
      this.formattedDate = this.formatDate(newDate);
    },
  },
  emits: ['on-message', 'on-select-id'],
  data() {
    return {
      id: '',
      onAirDay: '',
      msg: '',
      url: '',
      isCount: false,
      result: {},
      formattedDate: null,
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
    }
  },
  async created() {
    this.init();
    if(this.propId && this.propOnAirDay) {
      this.id = this.propId
      this.onAirDay = this.propOnAirDay
      this.fetchData()
    }
  },
  computed: {
    paginatedResult() {
      // ページングされた結果を返すように変更
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.result.slice(startIndex, endIndex);
    },
    totalPageLinks() {
      const maxPageLinks = 10;
      const currentGroup = Math.ceil(this.currentPage / maxPageLinks);
      const startPage = (currentGroup - 1) * maxPageLinks + 1;
      const endPage = Math.min(currentGroup * maxPageLinks, this.totalPages);

      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
  },
  methods: {
    async btnSearch() {
      this.fetchData();
    },
    async fetchData() {
      // ① IDが入力されている場合は、IDが8桁以内であること。
      if (this.id !== '' && !commonUtils.isValidMaxLength(this.id, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "ID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // ② オンエア日が入力されている場合は、オンエア日がYYYY-MM-DD HH:MM形式であること。
      if (this.onAirDay !== '') {
        const dateObject = new Date(this.onAirDay);
        const year = dateObject.getFullYear();
        const month = `0${dateObject.getMonth() + 1}`.slice(-2);
        const day = `0${dateObject.getDate()}`.slice(-2);
        const hours = `0${dateObject.getHours()}`.slice(-2);
        const minutes = `0${dateObject.getMinutes()}`.slice(-2);
        this.onAirDay = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      if (this.onAirDay !== '' && !commonUtils.isCheckDateTime(this.onAirDay)) {
        this.msg = msgList['MSG003'].replace('{0}', "オンエア日時");
        this.msg = this.msg.replace('{1}', "YYYY-MM-DD HH:MM");
        this.$emit('on-message', this.msg);
        return;
      }
      this.url = ON_AIR_KANRI_REF_URL;
      this.url = this.url.replace('{1}', this.id);
      this.url = this.url.replace('{2}', this.onAirDay);
      this.result = await axios.get(this.url).then(response => (response.data.tOnAirKanriRef));
      if (this.result.length !== 0) {
        this.isCount = true;
        this.$emit('on-message', "");
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.resultCount = this.result.length;
      } else {
        this.msg = msgList['INFO001'];
        this.$emit('on-message', this.msg);
        this.isCount = false;
      }
    },
    updateFormattedDate() {
      this.formattedDate = this.formatDate(this.selectedDate);
    },
    formatDate(date) {
      return format(date, 'yyyy/MM/dd');
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    selectId(id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // idとonAirDayとprogramIdとtalentIdとtalentNameとnentsukiとshuを親コンポーネントに渡す
      this.$emit('on-select-id', { id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.id = '';
      this.onAirDay = '';
      this.isCount = false;
      this.msg = '';
      this.result = {};
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
.pagination-container {
  display: flex;
  gap: 8px;
  justify-content: center; /* 画面中央に寄せる */
}

.pagination-link {
  text-decoration: none;
  cursor: pointer;
}

.underlined {
  text-decoration: underline;
}
</style>