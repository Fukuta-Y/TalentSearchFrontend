<template>
  <div>
    <table align="center">
      <tr>
        <td>出演者：</td>
        <td v-if="countFlg">{{ this.result[0].talentName }}</td>
      </tr>
      <tr>
        <td>出演者ジャンル： </td>
        <td v-if="countFlg">{{ this.result[0].shutsuenshaGenre }}</td>
      </tr>
    </table>
    <br>
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">【年月・週】：{{ `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週目` }}</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td style="text-align: left;">【週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">出演番組 </td>
        <td style="background-color: greenyellow;">放送局（チャンネル） </td>
        <td style="background-color: greenyellow;">オンエア日時</td>
        <td style="background-color: greenyellow;">放送時間</td>
        <td style="background-color: greenyellow;">番組ジャンル</td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.programId, onAirDay: item.onAirDay + ' ' + item.onAirTime.substring(0, 5), nentsuki: this.nentsuki, shu: this.shu } }">{{ item.shutsuenProgram }}</router-link></td>
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
import msgList from '../../../router/msgList';
import { TALENT_SHUKAN_SHUTSUEN_JOHO_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';

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
  emits: ['on-message'],
  data() {
    return {
      shuFrom: '',
      shuTo: '',
      msg: '',
      url: '',
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
    }
  },
  async created() {
    // 初期化
    this.btnClear();
    // ① 前画面からのパラメータは年月、週、タレントIDは必須で入力されていること。
    if (this.nentsuki.trim() === '' || this.shu.toString().trim() === '' || this.talentId.trim() === '') {
      this.$emit('on-message', msgList['MSG006']);
      return;
    }
    // ② 年月がYYYYMM形式であること。
    // ③ 年月がYYYY/MM/01で有効な日付であること。
    if (!commonUtils.isValidateDate(this.nentsuki + "01")) {
      this.msg = msgList['MSG003'].replace('{0}', "年月");
      this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
      this.$emit('on-message', this.msg);
      return;
    }
    // ④ 週が数値であること。
    if (!commonUtils.isValidNumber(Number(this.shu))) {
      this.msg = msgList['MSG003'].replace('{0}', "週");
      this.msg = this.msg.replace('{1}', "数値");
      this.$emit('on-message', this.msg);
      return;
    }
    // ⑤ 週が1～5の数値のいずれかであること。
    if (!commonUtils.isValidRange(Number(this.shu), 1, 5)) {
      this.msg = msgList['MSG004'].replace('{0}', "週");
      this.msg = this.msg.replace('{1}', "1");
      this.msg = this.msg.replace('{2}', "5");
      this.$emit('on-message', this.msg);
      return;
    }
    // ⑥ タレントIDが8桁以内であること。
    if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
      this.msg = msgList['MSG005'].replace('{0}', "タレントID");
      this.msg = this.msg.replace('{1}', "8文字");
      this.$emit('on-message', this.msg);
      return;
    }

    // 前画面からの値で検索処理を行う。
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
      // 取得処理を開始
      this.url = TALENT_SHUKAN_SHUTSUEN_JOHO_URL;
      this.url = this.url.replace('{1}', this.nentsuki);
      this.url = this.url.replace('{2}', this.shu);
      this.url = this.url.replace('{3}', this.talentId);
      this.result = await axios.get(this.url).then(response => (response.data.talentShukanShutsuen));
      if(this.result != null && this.result[0].talentName !== null) {
        this.countFlg = true;
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.resultCount = this.result.length;
      } else {
        this.msg = "対象タレントID（" + this.talentId +"）は【" + this.nentsuki.toString().substring(0, 4) + "年" +  this.nentsuki.toString().substring(4) + "月 " + this.shu + "週】に出演予定がありません。";
        this.countFlg = false;
        this.$emit('on-message', this.msg);
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
      this.$emit('on-message', this.msg);
    },
    init(){
      this.shuFrom = '';
      this.shuTo = '';
      this.countFlg = false;
      this.msg = '';
      this.result= { };
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
