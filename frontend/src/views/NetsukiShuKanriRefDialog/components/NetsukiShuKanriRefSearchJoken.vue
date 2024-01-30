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
        </td>
        <td style="font-size:11px;color:red;" >※年と月は入力時はセットで必須入力</td>
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
          <td style="background-color: greenyellow; width:150px;">年月・週</td>
          <td style="background-color: greenyellow; width:180px;">週の開始日（日曜日）</td>
          <td style="background-color: greenyellow; width:180px;">週の終了日（土曜日）</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectNentsukiShu(item.nentsuki, item.shu, item.shuFrom.toString().substring(0, 8), item.shuTo.toString().substring(0, 8))">選択</button></td>
          <td v-if="isNentsukiShu">
             {{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { mode: '2', nentsuki: item.nentsuki, shu: item.shu } }">{{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週目` }}</router-link>
          </td>
          <td>{{ item.shuFrom }} </td>
          <td>{{ item.shuTo }} </td>
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
  name: 'NetsukiShuKanriRefSearchJoken',
  props: {
    propNentsukiShu: {
      type: String,
    },
    isNentsukiShu: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  watch: {
  },
  emits: ['on-message', 'on-select-nentsuki-shu'],
  data() {
    return {
      nen: '',
      tsuki: '',
      shu: '',
      nentsuki: '',
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
    if(this.propNentsukiShu) {
      this.nen = this.propNentsukiShu.toString().substring(0, 4);
      this.tsuki = this.propNentsukiShu.toString().substring(4, 6);
      this.shu = this.propNentsukiShu.toString().substring(6, 7);
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
      if (this.tsuki !== '') {
        this.nentsuki = this.nen + this.tsuki.padStart(2, '0');
      }
      const url = "http://localhost:8081/api/nentsukiShuKanrRefBFF?nentsuki=" + this.nentsuki + "&shu=" + this.shu;
      this.result = await axios.get(url).then(response => (response.data.mNentsukiShuKanri));
      this.resultCount = this.result.length; // 件数を更新
      this.totalPages = Math.ceil(this.result.length / this.pageSize);
      this.resultCount = this.result.length;
      if(this.result[0].nentsuki !== null) {
        this.countFlg = true;
        this.$emit('on-message', "");
      } else {
        this.msg ="検索結果が0件です。";
        this.$emit('on-message', this.msg);
        this.countFlg = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    selectNentsukiShu(nentsuki, shu, shuFrom, shuTo) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // nentsukiとshuとshuFromとshuToを親コンポーネントに渡す
      this.$emit('on-select-nentsuki-shu', { nentsuki, shu, shuFrom, shuTo });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.nentsuki = '';
      this.nen = '';
      this.tsuki = '';
      this.shu = '';
      this.countFlg = false;
      this.msg = '';
      this.result = {};
    },
    underlineNumber(number) {
      // 数字にアンダーラインをつけるためのスタイルを適用するメソッド
      return `<span class="underlined">${number}</span>`;
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