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
            maxlength="4"
            placeholder="例：2023"
            class="rounded-textbox"
          /> 年
        </td>
        <td>
          <Field 
            name="tsuki" 
            v-model="tsuki"
            size="6"
            label="月"
            maxlength="2"
            placeholder="例：04"
            class="rounded-textbox"
          />月
        </td>
        <td style="font-size:11px;color:red;" >※年と月は入力時はセットで必須入力</td>
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
          /> 週
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
      <button v-on:click="btnSearch()" class="rounded-ref-button" :disabled="isLoading">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-ref-button" :disabled="isLoading">
        クリア
      </button>
    </div>

    <div v-if="isLoading" class="loading-area">
      <div class="loader"></div>
      <p>データを取得しています...</p>
    </div>

    <br>
    <br>
    <div style="overflow-y: auto;" v-if="isCount && !isLoading">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table">
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow; width:150px;">年月・週</td>
          <td v-if="isNentsukiShu" style="background-color: greenyellow; width:180px;">週の開始日（日曜日）</td>
          <td v-if="isNentsukiShu" style="background-color: greenyellow; width:180px;">週の終了日（土曜日）</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectNentsukiShu(item.nentsuki, item.shu, item.shuFrom, item.shuTo)" class="rounded-ref-button">選択</button></td>
          <td v-if="isNentsukiShu">
             {{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { nentsuki: item.nentsuki, shu: item.shu } }">{{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}</router-link>
          </td>
          <td v-if="isNentsukiShu">{{ item.shuFrom }} </td>
          <td v-if="isNentsukiShu">{{ item.shuTo }} </td>
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
import { Field, ErrorMessage } from 'vee-validate'
import { NENTSUKI_SHU_KANRI_REF_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import axios from 'axios'
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'NetsukiShuKanriRefSearchJoken',
  props: {
    propNentsukiShu: { type: String },
    isNentsukiShu: { type: Boolean, required: true },
  },
  components: {
    Field,
    ErrorMessage,
    DataGridViewPaging,
  },
  emits: ['on-message', 'on-select-nentsuki-shu'],
  data() {
    return {
      nen: '',
      tsuki: '',
      shu: '',
      nentsuki: '',
      msg: '',
      url: '',
      isCount: false,
      isLoading: false,
      result: [], 
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      maxPageLinks: 10,
    }
  },
  async created() {
    this.init();
    if(this.propNentsukiShu) {
      const p = this.propNentsukiShu.toString();
      this.nen = p.substring(0, 4);
      this.tsuki = p.substring(4, 6);
      this.shu = p.substring(6, 7);
      await this.fetchData(false);
    }
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
      await this.fetchData(true);
    },
    async fetchData(isValidate) {
      if (isValidate) {
        if (this.nen.trim() !== '' && this.tsuki.trim() === '') {
          this.$emit('on-message', msgList['MSG002'].replace('{0}', "年と月"));
          return;
        }
        if (this.tsuki.trim() !== '' && this.nen.trim() === '') {
          this.$emit('on-message', msgList['MSG002'].replace('{0}', "年と月"));
          return;
        }
        if (this.nen.trim() !== '' && this.tsuki.trim() !== '' && !commonUtils.isValidateDate(this.nen + this.tsuki + "01")) {
          this.msg = msgList['MSG003'].replace('{0}', "年月").replace('{1}', "有効な日付の年月（YYYYMM)");
          this.$emit('on-message', this.msg);
          return;
        }
        if (this.shu.toString().trim() !== '' && !commonUtils.isValidNumber(Number(this.shu))) {
          this.msg = msgList['MSG003'].replace('{0}', "週").replace('{1}', "数値");
          this.$emit('on-message', this.msg);
          return;
        }
        if (this.shu.toString().trim() !== '' && !commonUtils.isValidRange(Number(this.shu), 1, 5)) {
          this.msg = msgList['MSG004'].replace('{0}', "週").replace('{1}', "1").replace('{2}', "5");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      this.isLoading = true;
      this.$emit('on-message', "");

      try {
        if (this.tsuki.trim() !== '') {
          this.nentsuki = this.nen + this.tsuki.padStart(2, '0');
        } else {
          this.nentsuki = '';
        }

        this.url = NENTSUKI_SHU_KANRI_REF_URL;
        this.url = this.url.replace('{1}', this.nentsuki).replace('{2}', this.shu);
        
        const response = await axios.get(this.url);
        this.result = response.data.mNentsukiShuKanri || [];

        if (this.result.length !== 0) {
          this.isCount = true;
          this.totalPages = Math.ceil(this.result.length / this.pageSize);
        } else {
          this.isCount = false;
          this.result = [];
          this.$emit('on-message', msgList['INFO001']);
        }
      } catch (error) {
        console.error(error);
        this.$emit('on-message', "通信エラーが発生しました。");
      } finally {
        this.isLoading = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(false);
    },
    selectNentsukiShu(nentsuki, shu, shuFrom, shuTo) {
      this.$emit('on-select-nentsuki-shu', { nentsuki, shu, shuFrom, shuTo });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    init(){
      this.nentsuki = '';
      this.nen = '';
      this.tsuki = '';
      this.shu = '';
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
.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
