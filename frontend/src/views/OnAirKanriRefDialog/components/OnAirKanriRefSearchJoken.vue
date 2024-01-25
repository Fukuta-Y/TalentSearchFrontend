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
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /> 
        </td> 
      </tr>
      <tr>
        <td>オンエア日： </td>
        <td class="date-picker">
          <Datepicker v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }"  language="ja" placeholder="例：2023-04-18 11:50:00"></Datepicker>
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
      <button v-on:click="btnSearch()">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()">
        クリア
      </button>
    </div>
    <br>
    <br>
    <div style="overflow-y: auto;">
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;"></td>
        <td style="background-color: greenyellow;">ID </td>
        <td style="background-color: greenyellow;width:170px;">オンエア日</td>
        <td style="background-color: greenyellow;">番組ID</td>
        <td style="background-color: greenyellow; width:130px;">番組名</td>
        <td style="background-color: greenyellow;">タレントID</td>
        <td style="background-color: greenyellow; width:130px;">タレント名</td>
        <td style="background-color: greenyellow; width:70px;">年月</td>
        <td style="background-color: greenyellow; width:45px;">週</td>
      </tr>
      <tr v-for="(item, key) in paginatedResult" :key="key">
        <td><button v-on:click="selectId(item.id, item.onAirDay, item.programId, item.programName, item.talentId, item.talentName, item.nentsuki, item.shu)">選択</button></td>
        <td>{{ item.id }} </td>
        <td>{{ item.onAirDay }} </td>
        <td>{{ item.programId }} </td>
        <td>{{ item.programName }} </td>
        <td>{{ item.talentId }} </td>
        <td>{{ item.talentName }} </td>
        <td>{{ item.nentsuki }} </td>
        <td>{{ item.shu }} </td>
      </tr>
    </table>
    <div>
      <button v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)">
        {{ pageNumber }}
      </button>
    </div>
    </div>
    <br>
  </div>
</template>
<script>
import { Field, ErrorMessage } from 'vee-validate'
import axios from 'axios'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns';
export default {
  name: 'OnAirKanriRefSearchJoken',
  props: {
    propId: {
      type: String,
    },
    propOnAirDay: {
      type: String,
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
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
      formattedDate: null,
    }
  },
  async created() {
    this.init();
    if(this.propId && this.propOnAirDay) {
      this.id = this.propId
      this.onAirDay = this.propOnAirDay
      this.btnSearch()
    }
  },
  computed: {
    paginatedResult() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.result.slice(startIndex, endIndex);
    },
  },
  methods: {
    async btnSearch() {
      if (this.onAirDay !== '') {
        const dateObject = new Date(this.onAirDay);
        const year = dateObject.getFullYear();
        const month = `0${dateObject.getMonth() + 1}`.slice(-2);
        const day = `0${dateObject.getDate()}`.slice(-2);
        const hours = `0${dateObject.getHours()}`.slice(-2);
        const minutes = `0${dateObject.getMinutes()}`.slice(-2);
        const seconds = `0${dateObject.getSeconds()}`.slice(-2);
        this.onAirDay = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      const url = "http://localhost:8081/api/onAirKanriRefBFF?id=" + this.id +"&onAirDay=" + this.onAirDay;
      this.result = await axios.get(url).then(response => (response.data.tOnAirKanriRef));
      this.resultCount = this.result.length; // 件数を更新
      if(this.result[0].id !== null) {
          this.countFlg = true
          this.$emit('on-message', "")
      } else {
          this.msg ="検索結果が0件です。"
          this.$emit('on-message', this.msg)
          this.countFlg = false
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
    selectId(id, onAirDay, programId, programName, talentId,talentName, nentsuki, shu) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // idとonAirDayとprogramIdとtalentIdとnentsukiとshuを親コンポーネントに渡す
      this.$emit('on-select-id', { id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg)
    },
    init(){
      this.id = '',
      this.onAirDay = '',
      this.countFlg = false
      this.msg = ''
      this.result = {}
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