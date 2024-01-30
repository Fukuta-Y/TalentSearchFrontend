<template>
  <div>
    <table align="center">
      <tr>
        <td>年月： </td>
        <td>
          <Field 
            name="nentsuki" 
            v-model="nentsuki"
            size="11"
            label="年月"
            rules="required"
            maxlength="6"
            placeholder="例：202304"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /> 
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
          />&nbsp;&nbsp;週目
        </td>
        <td style="font-size:11px;color:red;" >※月と週はセットで必須入力</td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="shu" /> 
        </td> 
      </tr>
      <tr>
        <td>タレント名： </td>
        <td>
          <Field 
            name="name" 
            v-model="name"
            label="タレント名"
            size="30"
            maxlength="30"
            placeholder="例：○○太郎"
          />
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
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">【年月・週】：{{ `${String(this.labelNentsuki).substring(0, 4)}/${String(this.labelNentsuki).substring(4, 6)} ${this.labelShu}週目` }}</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td style="text-align: left;">【週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <div style="overflow-y: auto;">
      <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
        <tr>
          <td style="background-color: greenyellow;">タレント名 </td>
          <td style="background-color: greenyellow;">週間出演番組本数 </td>
          <td style="background-color: greenyellow;">出演番組（直近） </td>
          <td style="background-color: greenyellow;">オンエア日時（直近） </td>
        </tr>
        <tr v-for="(item, key) in result" :key="key">
          <td><router-link :to="{ name: 'TalentDetail', params: { nentsuki: this.labelNentsuki, shu: this.labelShu, talentId: item.talentId } }">{{ item.talentName }}</router-link></td>
          <td>{{ item.shukanShutsuenProgramHonsu + "本"}} </td>
          <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.shutsuenProgramIdChokin, onAirDay: item.onAirDayChokin, nentsuki: this.labelNentsuki, shu: this.labelShu } }">{{ item.shutsuenProgramChokin  }}</router-link></td>
          <td>{{ getOnAirDayFormat(item.onAirDayChokin)}} </td>
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
import moment from 'moment';
export default {
  name: 'WeekTalentShutsuenJoken',
  props: {
    propNentsuki: {
      type: String,
    },
    propShu: {
      type: Number,
    },
    propTalentName: {
      type: String,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message'],
  data() {
    return {
      nentsuki: '',
      shu: '',
      labelNentsuki: '',
      labelShu: '',
      name: '',
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
    this.init();
    if(this.propNentsuki && this.propShu && this.propTalentName) {
      this.nentsuki = this.propNentsuki;
      this.shu = this.propShu.toString();
      this.name = this.propTalentName;
      this.fetchData();
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
      // ① 年月、対象週が必須で入力されていること。
      if(this.nentsuki === "" || this.shu  === "") {
        this.msg = "年月、週が必須です。";
        this.$emit('on-message', this.msg);
        return;
      }
      // ②年月がYYYY / MM形式であること。

      // ③週が数値かつ、1～5の数値のいずれかであること。 

      // ④タレントが30桁以内であること。

      this.labelNentsuki = this.nentsuki;
      this.labelShu = this.shu;

      const url = "http://localhost:8081/api/shukanTalentJohoBFF?nentsuki=" + this.nentsuki + "&shu=" + this.shu + "&talentName=" + this.name;
      this.result = await axios.get(url).then(response => (response.data.shukanTalent))
      this.totalPages = Math.ceil(this.result.length / this.pageSize);
      this.resultCount = this.result.length;
      if(this.result[0].talentId !== null) {
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
    getOnAirDayFormat(onAirDay) {
      return moment(onAirDay).format('YYYY-MM-DD HH:mm');
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.nentsuki = '';
      this.shu = '';
      this.name = '';
      this.shuFrom = '';
      this.shuTo = '';
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
