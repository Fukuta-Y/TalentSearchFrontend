<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loader-overlay"></div>
        <p>データを取得しています...</p>
      </div>
    </div>

    <div v-if="isCount && !isLoading">
      <table align="center">
        <tr>
          <td>出演者：</td>
          <td>{{ this.result[0].talentName }}</td>
        </tr>
        <tr>
          <td>出演者ジャンル： </td>
          <td>{{ this.result[0].shutsuenshaGenre }}</td>
        </tr>
      </table>
      <br>
      <table align="center">
        <tr>
          <td style="text-align: left;">【年月・週】：{{ `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週目` }}</td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
          <td style="text-align: left;">【週・日付】：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
        </tr>
      </table>
      <table class="result-table" align="center" border="1" style="border-collapse: collapse;">
        <tr>
          <td style="background-color: greenyellow;">出演番組 </td>
          <td style="background-color: greenyellow;">放送局（チャンネル） </td>
          <td style="background-color: greenyellow;">オンエア日時</td>
          <td style="background-color: greenyellow;">番組ジャンル</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><router-link :to="{ name: 'ProgramDetail', params: { programId: item.programId, onAirDay: item.onAirDay + ' ' + item.onAirTime.substring(0, 5), nentsuki: this.nentsuki, shu: this.shu } }">{{ item.shutsuenProgram }}</router-link></td>
          <td>{{ item.hosokyokuChannel }} </td>
          <td>{{ item.onAirDay + ' ' + getOnAirDayFormat(item.onAirTime) }}</td>
          <td>{{ item.programGenre }} </td>
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
    <br>
  </div>
</template>

<script>
import { TALENT_SHUKAN_SHUTSUEN_JOHO_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import axios from 'axios'
import msgList from '../../../router/msgList';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import '../../../router/styles/common.css';

export default {
  name: 'TalentProgramJoken',
  props: {
    nentsuki: { type: String },
    shu: { type: String },
    talentId: { type: String },
  },
  components: {
    DataGridViewPaging,
  },
  emits: ['on-message'],
  data() {
    return {
      shuFrom: '',
      shuTo: '',
      msg: '',
      url: '',
      isCount: false,
      isLoading: false, 
      result: [],       
      currentPage: 1,
      maxPageLinks: 100,
      pageSize: 10,
      totalPages: 0,
    }
  },
  async created() {
    this.init();
    
    // バリデーション
    if (this.nentsuki.trim() === '' || this.shu.toString().trim() === '' || this.talentId.trim() === '') {
      this.$emit('on-message', msgList['MSG006']);
      return;
    }
    if (!commonUtils.isValidateDate(this.nentsuki + "01")) {
      this.msg = msgList['MSG003'].replace('{0}', "年月").replace('{1}', "有効な日付の年月（YYYYMM)");
      this.$emit('on-message', this.msg);
      return;
    }
    if (!commonUtils.isValidNumber(Number(this.shu))) {
      this.msg = msgList['MSG003'].replace('{0}', "週").replace('{1}', "数値");
      this.$emit('on-message', this.msg);
      return;
    }
    if (!commonUtils.isValidRange(Number(this.shu), 1, 5)) {
      this.msg = msgList['MSG004'].replace('{0}', "週").replace('{1}', "1").replace('{2}', "5");
      this.$emit('on-message', this.msg);
      return;
    }
    if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
      this.msg = msgList['MSG005'].replace('{0}', "タレントID").replace('{1}', "8文字");
      this.$emit('on-message', this.msg);
      return;
    }

    // データ取得
    await this.fetchData();
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
    async fetchData() {
      // ★取得処理開始：オーバーレイを表示
      this.isLoading = true; 
      this.$emit('on-message', "");

      try {
        this.url = TALENT_SHUKAN_SHUTSUEN_JOHO_URL;
        this.url = this.url.replace('{1}', this.nentsuki)
                           .replace('{2}', this.shu)
                           .replace('{3}', this.talentId);
        
        const response = await axios.get(this.url);
        this.result = response.data.talentShukanShutsuen;

        if(this.result != null && this.result.length > 0 && this.result[0].talentName !== null) {
          this.isCount = true;
          this.totalPages = Math.ceil(this.result.length / this.pageSize);
        } else {
          this.isCount = false;
          this.msg = "対象タレントID（" + this.talentId +"）は【" + this.nentsuki.toString().substring(0, 4) + "年" +  this.nentsuki.toString().substring(4) + "月 " + this.shu + "週】に出演予定がありません。";
          this.$emit('on-message', this.msg);
        }
      } catch (error) {
        console.error(error);
        this.$emit('on-message', "通信エラーが発生しました。");
      } finally {
        // ★処理完了：オーバーレイを隠す
        this.isLoading = false; 
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    },
    getOnAirDayFormat(onAirDay) {
      return onAirDay ? onAirDay.toString().substring(0, 5) : '';
    },
    init(){
      this.shuFrom = '';
      this.shuTo = '';
      this.isCount = false;
      this.isLoading = false;
      this.msg = '';
      this.result = [];
      this.currentPage = 1;
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    }
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
</style>
