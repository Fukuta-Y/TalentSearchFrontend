<template>
  <div>
    <table align="center">
      <tr>
        <td>番組名： </td>
        <td v-if="countFlg">{{ this.result[0].programName }}</td>
      </tr>
      <tr>
        <td>オンエア日時： </td>
        <td v-if="countFlg">{{ this.onAirDay }}</td>
      </tr>
      <tr>
        <td>番組ジャンル： </td>
        <td v-if="countFlg">{{ this.result[0].programGenre }}</td>
      </tr>
    </table>
    <br>
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">【年月・週】：{{ `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週目` }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">タレント名 </td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'TalentDetail', params: { nentsuki: this.nentsuki, shu: this.shu, talentId: item.talentId }}">{{ item.talentName }}</router-link></td>
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
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import msgList from '../../../router/msgList';

export default {
  name: 'ProgramDetailJoken',
  props: {
    programId: {
      type: String,
    },
    onAirDay: {
      type: String,
    },
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    }
  },
  emits: ['on-message'],
  data() {
    return {
      msg: '',
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
    // ① 前画面からのパラメータは番組ID、オンエア日、年月、週は必須で入力されていること。
    if (this.programId.trim() === '' || this.onAirDay.trim() === '' || this.nentsuki.trim() === '' || this.shu.trim() === '') {
      this.$emit('on-message', msgList['MSG006']);
      return;
    }
    // ② 年月がYYYYMM形式であること。
    // ③ 年月がYYYY/MM/01で有効な日付であること。
    if (!this.isValidateDate(this.nentsuki + "01")) {
      this.msg = msgList['MSG003'].replace('{0}', "年月");
      this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
      this.$emit('on-message', this.msg);
      return;
    }
    // ④ 週が数値であること。
    if (!this.isValidNumber(Number(this.shu))) {
      this.msg = msgList['MSG003'].replace('{0}', "週");
      this.msg = this.msg.replace('{1}', "数値");
      this.$emit('on-message', this.msg);
      return;
    }
    // ⑤ 週が1～5の数値のいずれかであること。
    if (!this.isValidRange(Number(this.shu), 1, 5)) {
      this.msg = msgList['MSG004'].replace('{0}', "週");
      this.msg = this.msg.replace('{1}', "1");
      this.msg = this.msg.replace('{2}', "5");
      this.$emit('on-message', this.msg);
      return;
    }

    // ⑥ オンエア日がYYYY-MM-DD HH:MM形式であること。
    if (!this.isCheckDateTime(this.onAirDay)){
      this.msg = msgList['MSG003'].replace('{0}', "オンエア日時");
      this.msg = this.msg.replace('{1}', "YYYY-MM-DD HH:MM");
      this.$emit('on-message', this.msg);
      return;
    }

    // ⑦ 番組IDが8桁以内であること。
    if (!this.isValidMaxLength(this.programId, 8)) {
      this.msg = msgList['MSG005'].replace('{0}', "番組ID");
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
      const url = "http://localhost:8081/api/programShutsuenBFF?programId=" + this.programId + "&onAirDay=" + this.onAirDay +"&nentsuki=" + this.nentsuki + "&shu=" + this.shu;
      this.result = await axios.get(url).then(response => (response.data.programShutsuen));
      if (this.result != '' && this.result[0].programName !== null) {
        this.countFlg = true;
        this.$emit('on-message', "");
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.resultCount = this.result.length;
      } else {
        this.msg = "対象番組ID（" + this.programId + "）は【" + this.nentsuki.toString().substring(0, 4) + "年" + this.nentsuki.toString().substring(4) + "月 " + this.shu + "週】に放送予定がありません。";
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
      this.countFlg = false;
      this.msg = '';
      this.result= { };
    },
    isValidDate(dateString) {
      return isNaN(Date.parse(dateString));
    },
    isValidateDate(dateString) {
      // 有効日付チェック
      const parsedDate = parseISO(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
      return isValid(parsedDate);
    },
    isValidNumber(value) {
      // 数値であるかどうかをチェック
      return typeof value === 'number';
    },
    isValidRange(value) {
      // 1から5の範囲内にあるかどうかをチェック
      return value >= 1 && value <= 5;
    },
    isValidMaxLength(value, maxLength) {
      // 文字列の長さが【maxLength】文字以内であるかどうかをチェック
      return value.length <= maxLength;
    },
    isCheckDateTime(onAirDay) {
      // 日時の正規表現パターン
      const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

      // 入力された日時がパターンに一致するかどうかを確認
      if (!dateTimePattern.test(onAirDay)) {
        return false; // パターンに一致しない場合は無効な日時
      }

      // 日付の妥当性を検証
      const inputDate = new Date(onAirDay);
      return !isNaN(inputDate.getTime()); // インスタンスが有効な日時であるかどうか
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
