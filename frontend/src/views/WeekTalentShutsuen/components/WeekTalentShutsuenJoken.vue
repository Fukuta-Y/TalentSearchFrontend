<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loader-overlay"></div>
        <p>データを取得しています...</p>
      </div>
    </div>

    <table align="center">
      <tr>
        <td>年月： </td>
        <td>
          <Field 
            name="nentsuki" 
            v-model="nentsuki"
            size="11"
            label="年月"
            maxlength="6"
            placeholder="例：202304"
            class="rounded-textbox"
          />
        </td>
      </tr><br/>
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
            v-model="shu"
            label="週"
            maxlength="1"
            size="5"
            placeholder="例：3"
            class="rounded-textbox"
          />&nbsp;&nbsp;週目
        </td>
        <td style="font-size:12px;color:red;" >※月と週はセットで必須入力</td>
      </tr><br/>
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
      <button v-on:click="btnSearch()" class="rounded-button" :disabled="isLoading">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-button" :disabled="isLoading">
        クリア
      </button>
    </div>

    <br>
    <div v-if="isCount && !isLoading">
      <table align="center">
        <tr>
          <td style="text-align: left;">【年月・週】：{{ `${String(this.labelNentsuki).substring(0, 4)}/${String(this.labelNentsuki).substring(4, 6)} ${this.labelShu}週目` }}</td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
          <td style="text-align: left;">【週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
        </tr>
      </table>
      <div style="overflow-y: auto;">
        <table class="result-table" align="center" border="1" style="border-collapse: collapse;">
          <tr>
            <td style="background-color: greenyellow;">タレント名 </td>
            <td style="background-color: greenyellow;">週間出演番組本数 </td>
            <td style="background-color: greenyellow;">出演番組（直近） </td>
            <td style="background-color: greenyellow;">オンエア日時（直近） </td>
          </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
            <td><router-link :to="{ name: 'TalentDetail', params: { nentsuki: this.labelNentsuki, shu: this.labelShu, talentId: item.talentId } }">{{ item.talentName }}</router-link></td>
            <td>{{ item.shukanShutsuenProgramHonsu + "本"}} </td>
            <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.shutsuenProgramIdChokin, onAirDay: getOnAirDayFormat(item.onAirDayChokin), nentsuki: this.labelNentsuki, shu: this.labelShu } }">{{ item.shutsuenProgramChokin  }}</router-link></td>
            <td>{{ getOnAirDayFormat(item.onAirDayChokin)}} </td>
          </tr>
        </table>
        <div>
          <DataGridViewPaging
            :currentPage="currentPage"
            :totalPages="totalPages"
            :totalPageLinks="totalPageLinks"
            :changePage="changePage"
          />
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
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import msgList from '../../../router/msgList';
import axios from 'axios'
import moment from 'moment';
import '../../../router/styles/common.css';

export default {
  name: 'WeekTalentShutsuenJoken',
  components: {
    Field,
    ErrorMessage,
    DataGridViewPaging,
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
      isLoading: false, 
      result: [],
      currentPage: 1,
      maxPageLinks: 100,
      pageSize: 10, 
      totalPages: 0,
      url: '',
    }
  },
  async created() {
    this.btnClear();
  },
  computed: {
    paginatedResult() {
      if (!this.result || !Array.isArray(this.result)) return [];
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.result.slice(startIndex, endIndex);
    },
    totalPageLinks() {
      const currentGroup = Math.ceil(this.currentPage / this.maxPageLinks);
      const startPage = (currentGroup - 1) * this.maxPageLinks + 1;
      const endPage = Math.min(currentGroup * this.maxPageLinks, this.totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
  },
  methods: {
    async btnSearch() {
      await this.fetchData();
    },
    async fetchData() {
      // バリデーションチェック
      if (this.nentsuki.trim() === '' || this.shu.toString().trim() === '') {
        this.msg = msgList['MSG002'].replace('{0}', "年月と週");
        this.$emit('on-message', this.msg);
        return;
      }
      if (!commonUtils.isValidateDate(this.nentsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月");
        this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }
      if(!commonUtils.isValidNumber(Number(this.shu))){
        this.msg = msgList['MSG003'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }
      if (!commonUtils.isValidRange(Number(this.shu), 1, 5)) {
        this.msg = msgList['MSG004'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "1");
        this.msg = this.msg.replace('{2}', "5");
        this.$emit('on-message', this.msg);
        return;
      }
      if (this.talentName !== '' && !commonUtils.isValidMaxLength(this.talentName, 30)){
        this.msg = msgList['MSG005'].replace('{0}', "タレント名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ★通信開始：オーバーレイを表示
      this.isLoading = true;
      this.$emit('on-message', "");

      try {
        this.url = SHUKAN_TALENT_JOHO_URL;
        this.url = this.url.replace('{1}', this.nentsuki);
        this.url = this.url.replace('{2}', this.shu);
        this.url = this.url.replace('{3}', this.talentName);
        
        const response = await axios.get(this.url);
        const fetchedData = response.data.shukanTalent;

        if (fetchedData && fetchedData.length > 0 && fetchedData[0].talentId != null) {
          this.result = fetchedData;
          this.isCount = true;
          this.totalPages = Math.ceil(this.result.length / this.pageSize);
          this.currentPage = 1;
          this.labelNentsuki = this.nentsuki;
          this.labelShu = this.shu;
        } else {
          this.isCount = false;
          this.result = [];
          this.msg = msgList['INFO001'];
          this.$emit('on-message', this.msg);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        this.$emit('on-message', "通信エラーが発生しました。");
      } finally {
        // ★通信終了：オーバーレイを消す
        this.isLoading = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    },
    getOnAirDayFormat(onAirDay) {
      return moment(onAirDay).format('YYYY-MM-DD HH:mm');
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    init(){
      this.nentsuki = '';
      this.shu = '';
      this.talentName = '';
      this.shuFrom = '';
      this.shuTo = '';
      this.isCount = false;
      this.isLoading = false;
      this.msg = '';
      this.result = [];
      this.currentPage = 1;
    },
  },
}
</script>

<style scoped>
/* ★登録画面等と共通のオーバーレイ設定 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* 半透明背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 30px 50px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.loader-overlay {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 非活性時のボタン */
.rounded-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
