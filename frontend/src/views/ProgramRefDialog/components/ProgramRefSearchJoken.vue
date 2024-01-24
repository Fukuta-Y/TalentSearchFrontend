<template>
  <div>
    <table align="center">
      <tr>
        <td>番組ID： </td>
        <td>
          <Field 
            name="programId" 
            v-model="programId"
            size="15"
            label="番組ID"
            maxlength="8"
            placeholder="例：00000001"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /> 
        </td> 
      </tr>
      <tr>
        <td>番組名： </td>
        <td>
          <Field 
            name="programName" 
            v-model="programName"
            label="番組名"
            maxlength="30"
            size="20"
            placeholder="例：ぽかぽか"
          />
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
        <td style="background-color: greenyellow;">番組ID </td>
        <td style="background-color: greenyellow;">番組名 </td>
        <td style="background-color: greenyellow;">チャンネル局ID</td>
        <td style="background-color: greenyellow;">ジャンルID </td>
      </tr>
      <tr v-for="(item, key) in paginatedResult" :key="key">
        <td><button v-on:click="selectProgram(item.programId, item.programName)">選択</button></td>
        <td>{{ item.programId }} </td>
        <td>{{ item.programName }} </td>
        <td>{{ item.channelId }} </td>
        <td>{{ item.genreId }} </td>
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
export default {
  name: 'ProgramRefSearchJoken',
  props: {
    propProgramId: {
      type: String,
    },
    propProgramName: {
      type: String,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message', 'on-select-program'],
  data() {
    return {
      programId: this.propProgramId,
      programName: this.propProgramName,
      msg: '',
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
    }
  },
  async created() {
    this.init();
    if(this.propProgramId && this.propProgramName) {
      this.programId = this.propProgramId
      this.programName = this.propProgramName
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
      const url = "http://localhost:8081/api/programRefBFF?programId=" + this.programId +"&programName=" + this.programName;
      this.result = await axios.get(url).then(response => (response.data.mProgram));
      this.resultCount = this.result.length; // 件数を更新
      if(this.result[0].programId !== null) {
          this.countFlg = true
          this.$emit('on-message', "")
      } else {
          this.msg ="検索結果が0件です。"
          this.$emit('on-message', this.msg)
          this.countFlg = false
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    selectProgram(programId, programName) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // programId と programName を親コンポーネントに渡す
      this.$emit('on-select-program', { programId, programName });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg)
    },
    init(){
      this.programId = ''
      this.programName = ''
      this.countFlg = false
      this.msg = ''
      this.result = {}
    },
  },
}
</script>
<style scoped>
</style>