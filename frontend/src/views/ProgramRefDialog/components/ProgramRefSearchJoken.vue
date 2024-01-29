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
        <!-- テーブルのヘッダー部分 -->
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow;">番組ID </td>
          <td style="background-color: greenyellow;">番組名 </td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">チャンネル局ID</td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">ジャンルID </td>
        </tr>
        <!-- ページごとに表示されるアイテムを反復処理 -->
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectProgram(item.programId, item.programName, item.channelId, item.genreId)">選択</button></td>
          <td v-if="isProgramToroku">
            {{ item.programId }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'ProgramTorokuKoshin', params: { programId: item.programId } }">{{ item.programId }}</router-link>
          </td>
          <td>{{ item.programName }} </td>
          <td v-if="isProgramToroku">{{ item.channelId }} </td>
          <td v-if="isProgramToroku">{{ item.genreId }} </td>
        </tr>
      </table>
      <div v-if="countFlg">
        <div class="pagination-container">
          <a @click="changePage(1)" :disabled="currentPage === 1" class="pagination-link">最初</a>
          <a
            v-for="pageNumber in totalPageLinks"
            :key="pageNumber"
            @click="pageNumber !== '...' ? changePage(pageNumber) : null"
            class="pagination-link"
          >
            <span v-if="pageNumber !== '...'">
              <span class="underlined">{{ pageNumber }}</span>
            </span>
            <span v-else>...</span>
          </a>
          <a @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="pagination-link">最後</a>
        </div>
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
    isProgramToroku: {
      type: Boolean,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message', 'on-select-program'],
  data() {
    return {
      programId: '',
      programName: '',
      msg: '',
      countFlg: false,
      result: [],
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
      const url = "http://localhost:8081/api/programRefBFF?programId=" + this.programId +"&programName=" + this.programName;
      this.result = await axios.get(url).then(response => (response.data.mProgram));
      this.totalPages = Math.ceil(this.result.length / this.pageSize);
      this.resultCount = this.result.length;
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
    selectProgram(programId, programName, channelId, genreId) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // programId と programName と channelId と genreId  を親コンポーネントに渡す
      this.$emit('on-select-program', { programId, programName, channelId, genreId });
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
      this.result = []
    },
    underlineNumber(number) {
      // 数字にアンダーラインをつけるためのスタイルを適用するメソッド
      return `<span class="underlined">${number}</span>`;
    },
  },
}
</script>
<style scoped>
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
