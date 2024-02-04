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
            class="rounded-textbox"
          />&nbsp;&nbsp;週目
        </td>
        <td style="font-size:12px;color:red;" >※月と週はセットで必須入力</td>
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
            name="talentName" 
            v-model="talentName"
            label="タレント名"
            size="30"
            maxlength="30"
            placeholder="例：○○太郎"
            class="rounded-textbox"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage name="talentName" />
        </td> 
      </tr>
    </table>
    <br>
    <div>
      <button v-on:click="btnSearch()" class="rounded-button">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-button">
        クリア
      </button>
    </div>
    <br>
    <br>
    <table align="center" v-if="isCount">
      <tr>
        <td style="text-align: left;">【年月・週】：{{ `${String(this.labelNentsuki).substring(0, 4)}/${String(this.labelNentsuki).substring(4, 6)} ${this.labelShu}週目` }}</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td style="text-align: left;">【週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <div style="overflow-y: auto;">
      <table class="result-table" align="center" border="1" style="border-collapse: collapse;" v-if="isCount">
        <tr>
          <td style="background-color: greenyellow;">タレント名 </td>
          <td style="background-color: greenyellow;">週間出演番組本数 </td>
          <td style="background-color: greenyellow;">出演番組（直近） </td>
          <td style="background-color: greenyellow;">オンエア日時（直近） </td>
        </tr>
        <tr v-for="(item, key) in result" :key="key">
          <td><router-link :to="{ name: 'TalentDetail', params: { nentsuki: this.labelNentsuki, shu: this.labelShu, talentId: item.talentId } }">{{ item.talentName }}</router-link></td>
          <td>{{ item.shukanShutsuenProgramHonsu + "本"}} </td>
          <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.shutsuenProgramIdChokin, onAirDay: getOnAirDayFormat(item.onAirDayChokin), nentsuki: this.labelNentsuki, shu: this.labelShu } }">{{ item.shutsuenProgramChokin  }}</router-link></td>
          <td>{{ getOnAirDayFormat(item.onAirDayChokin)}} </td>
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
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import { SHUKAN_TALENT_JOHO_URL } from '../../../router/constList';
import msgList from '../../../router/msgList';
import axios from 'axios'
import moment from 'moment';
import '../../../router/styles/common.css';

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
    mode: {
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
      talentName: '',
      shuFrom: '',
      shuTo: '',
      msg: '',
      isCount: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
      url: '',
    }
  },
  async created() {
    // 初期化
    this.btnClear();
    //（初期表示時【値が渡されている来ている場合のみ】）
    if (this.mode === '2') {
      this.nentsuki = this.propNentsuki;
      this.shu = this.propShu;
      this.talentName = this.propTalentName;
      // ① 前画面からのパラメータは年月は必須で入力されていること。
      if (this.nentsuki.trim() === '' || this.shu.toString().trim() === '') {
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
      // ⑥ タレント名が設定されている場合は、30桁以内であること。
      if (this.talentName.trim() !== '' && !commonUtils.isValidMaxLength(this.talentName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレント名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // 前画面からの値で検索処理を行う。
      this.fetchData(false);

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
      this.fetchData(true);
    },
    async fetchData(isValCheck) {
      // バリデーションチェックが必要な場合
      if (isValCheck) {
        // ① 年月、週が必須で入力されていること。
        if (this.nentsuki.trim() === '' || this.shu.toString().trim() === '') {
          this.msg = msgList['MSG002'].replace('{0}', "年月と週");
          this.$emit('on-message', this.msg);
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
        if(!commonUtils.isValidNumber(Number(this.shu))){
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
        // ⑥ タレント名が設定されている場合は、30桁以内であること。
        if (this.talentName.trim() !== '' && !commonUtils.isValidMaxLength(this.talentName, 30)){
          this.msg = msgList['MSG005'].replace('{0}', "タレント名");
          this.msg = this.msg.replace('{1}', "30文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }
      // 取得処理を開始
      this.url = SHUKAN_TALENT_JOHO_URL;
      this.url = this.url.replace('{1}', this.nentsuki);
      this.url = this.url.replace('{2}', this.shu);
      this.url = this.url.replace('{3}', this.talentName);
      this.result = await axios.get(this.url).then(response => (response.data.shukanTalent))
      if (this.result != null && this.result[0].talentId !== null) {
        this.isCount = true;
        this.$emit('on-message', "");
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.resultCount = this.result.length;
      } else {
        this.msg =  msgList['INFO001'];
        this.$emit('on-message', this.msg);
        this.isCount = false;
      }
      // 検索結果のラベルの内容に設定
      this.labelNentsuki = this.nentsuki;
      this.labelShu = this.shu;
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(false); // ページ変更時にデータを再取得するなどの処理を追加
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
      this.talentName = '';
      this.shuFrom = '';
      this.shuTo = '';
      this.isCount = false;
      this.msg = '';
      this.result = {};
    },
  },
}
</script>
<style scoped>
</style>
