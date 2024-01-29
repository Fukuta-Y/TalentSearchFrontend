<template>
  <div>
    <table align="center">
      <tr>
        <td>タレントID： </td>
        <td>
          <Field 
            name="talentId" 
            v-model="talentId"
            size="15"
            label="タレントID"
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
        <td>タレント名： </td>
        <td>
          <Field 
            name="talentName" 
            v-model="talentName"
            label="タレント名"
            maxlength="30"
            size="20"
            placeholder="例：タモリ"
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
          <td style="background-color: greenyellow;">タレントID </td>
          <td style="background-color: greenyellow;">タレント名 </td>
          <td style="background-color: greenyellow;">ジャンルID</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectTalent(item.talentId, item.talentName)">選択</button></td>
          <td><router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: item.talentId } }">{{ item.talentId }}</router-link></td>
          <td>{{ item.talentName }} </td>
          <td>{{ item.genreId }} </td>
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
  name: 'TalentRefSearchJoken',
  props: {
    propTalentId: {
      type: String,
    },
    propTalentName: {
      type: String,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message', 'on-select-talent'],
  data() {
    return {
      talentId: '',
      talentName: '',
      msg: '',
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // Update to 10 items per page
      totalPages: 0,
    }
  },
  async created() {
    this.init();
    if(this.propTalentId && this.propTalentName) {
      this.talentId = this.propTalentId
      this.talentName = this.propTalentName
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
    btnSearch() {
      this.fetchData();
    },
    async fetchData() {
      const url = "http://localhost:8081/api/talentRefBFF?talentId=" + this.talentId +"&talentName=" + this.talentName;
      this.result = await axios.get(url).then(response => (response.data.mTalent));
      this.resultCount = this.result.length; // 件数を更新
      this.totalPages = Math.ceil(this.result.length / this.pageSize);
      if(this.result[0].talentId !== null) {
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
    selectTalent(talentId, talentName) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // talentId と talentName を親コンポーネントに渡す
      this.$emit('on-select-talent', { talentId, talentName });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg)
    },
    init(){
      this.talentId = ''
      this.talentName = ''
      this.countFlg = false
      this.msg = ''
      this.result = {}
    },
    underlineNumber(number) {
      // 数字にアンダーラインをつけるためのスタイルを適用するメソッド
      return `<span class="underlined">${number}</span>`;
    },
  },
}
</script>
<style scoped>
/* ページネーションのための同じスタイルを使用 */
.pagination-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-link {
  text-decoration: none;
  cursor: pointer;
}

.underlined {
  text-decoration: underline;
}
</style>