<template>
  <div>
    <table align="center" v-if="countFlg">
      <tr>
        <td>出演者： </td>
        <td>{{ this.result[0].talentName }}</td>
      </tr>
      <tr>
        <td>出演者ジャンル： </td>
        <td>{{ this.result[0].shutsuenshaGenre }}</td>
      </tr>
    </table>
    <br>
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">【対象年月・週】：{{ `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週目` }}</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td style="text-align: left;">【対象週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">出演番組 </td>
        <td style="background-color: greenyellow;">放送局（チャンネル） </td>
        <td style="background-color: greenyellow;">オンエア日</td>
        <td style="background-color: greenyellow;">放送時間</td>
        <td style="background-color: greenyellow;">番組ジャンル</td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.programId, onAirDay: item.onAirDay + ' ' + item.onAirTime, nentsuki: this.nentsuki, shu: this.shu } }">{{ item.shutsuenProgram }}</router-link></td>
        <td>{{ item.hosokyokuChannel }} </td>
        <td>{{ item.onAirDay }} </td>
        <td>{{ getOnAirDayFormat(item.onAirTime) }} </td>
        <td>{{ item.programGenre }} </td>
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
    <br>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TalentProgramJoken',
  props: {
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    },
    talentId: {
      type: String,
    },
  },
  data() {
    return {
      shuFrom: '',
      shuTo: '',
      msg: '',
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
    }
  },
  async created() {
    this.fetchData();
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
    async fetchData() {
      const url = "http://localhost:8081/api/talentShukanShutsuenJohoBFF?nentsuki=" + this.nentsuki + "&shu=" + this.shu + "&talentId=" + this.talentId;
      this.result = await axios.get(url).then(response => (response.data.talentShukanShutsuen));
      this.totalPages = Math.ceil(this.result.length / this.pageSize);
      this.resultCount = this.result.length;
      if(this.result[0].talentName !== null) {
          this.countFlg = true
      } else {
          this.msg = "対象タレント（" + this.talentId +"）は【" + this.nentsuki.toString().substring(0, 4) + "年" +  this.nentsuki.toString().substring(4) + "月 " + this.shu + "週】に出演予定がありません。";
          this.countFlg = false
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    getOnAirDayFormat(onAirDay) {
      return onAirDay.toString().substring(0, 5);
    },
    btnClear() {
      this.init();
    },
    init(){
      this.shuFrom = ''
      this.shuTo = ''
      this.countFlg = false
      this.msg = ''
      this.result= { }
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
  justify-content: center;
  /* 画面中央に寄せる */
}

.pagination-link {
  text-decoration: none;
  cursor: pointer;
}

.underlined {
  text-decoration: underline;
}
</style>
