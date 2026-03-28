<template>
  <div class="search-joken-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loader-overlay"></div>
        <p>データを取得しています...</p>
      </div>
    </div>

    <table align="center" class="search-form-table">
      <tr>
        <td>ID： </td>
        <td>
          <Field 
            name="id" v-model="id" size="15" label="ID" maxlength="8"
            placeholder="例：10000001" class="rounded-textbox"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"><ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /></td>
      </tr>
      <tr>
        <td>オンエア日時： </td>
        <td class="date-picker">
          <Datepicker 
            v-model="onAirDay" @input="updateFormattedDate" :style="{ width: '250px' }"  
            language="ja" class="rounded-datepicker" placeholder="例：2023-04-18 11:50"
            :disabled="isLoading"
          ></Datepicker>
        </td>
      </tr>
      <tr>
        <td colspan="2"><ErrorMessage style="font-size:12px;color:red;" name="shu" /></td>
      </tr>
    </table>

    <br>
    <div class="button-group">
      <button v-on:click="btnSearch()" class="rounded-ref-button" :disabled="isLoading">検索</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-ref-button" :disabled="isLoading">クリア</button>
    </div>
    <br>

    <div v-if="isCount && !isLoading" class="result-container">
      <div class="table-scroll-container">
        <table align="center" border="1" class="result-table">
          <thead>
            <tr>
              <th class="header-cell"></th>
              <th class="header-cell min-w-80">ID</th>
              <th class="header-cell min-w-200">オンエア日時</th>
              <th class="header-cell min-w-80">番組ID</th>
              <th class="header-cell min-w-200">番組名</th>
              <th class="header-cell min-w-100">タレントID</th>
              <th class="header-cell min-w-200">タレント名</th>
              <th class="header-cell min-w-120">年月・週</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in paginatedResult" :key="key">
              <td class="text-center">
                <button 
                  v-on:click="selectId(item.id, item.onAirDay, item.programId, item.programName, item.talentId, item.talentName, item.nentsuki, item.shu)" 
                  class="rounded-ref-button"
                >選択</button>
              </td>
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.onAirDay.toString().substring(0, 16) }}</td>
              <td class="text-center"><router-link :to="{ name: 'ProgramTorokuKoshin', params: { programId: item.programId } }">{{ item.programId }}</router-link></td>
              <td class="text-left">{{ item.programName }}</td>
              <td class="text-center"><router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: item.talentId } }">{{ item.talentId }}</router-link></td>
              <td class="text-left">{{ item.talentName }}</td>
              <td class="text-center">
                <router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { nentsuki: item.nentsuki, shu: item.shu } }">
                  {{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DataGridViewPaging
        :currentPage="currentPage" :totalPages="totalPages"
        :totalPageLinks="totalPageLinks" :changePage="changePage"
      />
    </div>
  </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate'
import { format } from 'date-fns';
import { ON_AIR_KANRI_REF_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import axios from 'axios'
import Datepicker from '@vuepic/vue-datepicker'
import msgList from '../../../router/msgList';
import '@vuepic/vue-datepicker/dist/main.css'
import '../../../router/styles/common.css';

export default {
  name: 'OnAirKanriRefSearchJoken',
  props: {
    propId: { type: String },
    propOnAirDay: { type: [Date, String] },
  },
  components: { Field, Datepicker, ErrorMessage, DataGridViewPaging },
  emits: ['on-message', 'on-select-id'],
  data() {
    return {
      id: '', 
      onAirDay: '', 
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
    // propsがある場合の初期表示時検索
    if (this.propId || this.propOnAirDay) {
      this.id = this.propId || '';
      this.onAirDay = this.propOnAirDay || '';
      await this.fetchData(false);
    }
  },
  computed: {
    paginatedResult() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.result.slice(startIndex, startIndex + this.pageSize);
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
      this.currentPage = 1; 
      await this.fetchData(true); 
    },
    async fetchData(isValidate) {
      if (isValidate) {
        if (this.id && !commonUtils.isValidMaxLength(this.id, 8)) {
          this.$emit('on-message', msgList['MSG005'].replace('{0}', "ID").replace('{1}', "8文字"));
          return;
        }
      }

      // ★通信開始
      this.isLoading = true;
      this.$emit('on-message', "");

      try {
        let searchDate = '';
        if (this.onAirDay) {
          searchDate = format(new Date(this.onAirDay), 'yyyy-MM-dd HH:mm');
        }

        this.url = ON_AIR_KANRI_REF_URL.replace('{1}', this.id || '').replace('{2}', searchDate);
        
        const response = await axios.get(this.url);
        this.result = response.data.tOnAirKanriRef || [];
        this.isCount = this.result.length > 0;
        
        if (this.isCount) {
          this.totalPages = Math.ceil(this.result.length / this.pageSize);
        } else {
          this.$emit('on-message', msgList['INFO001']);
        }
      } catch (error) {
        console.error("Search error", error);
        this.$emit('on-message', "通信エラーが発生しました。");
      } finally {
        // ★通信終了
        this.isLoading = false;
      }
    },
    changePage(p) { this.currentPage = p; },
    selectId(id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu) {
      this.$emit('on-select-id', { id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu });
    },
    updateFormattedDate() {},
    btnClear() { this.init(); this.$emit('on-message', ""); },
    init() { 
      this.id = ''; 
      this.onAirDay = ''; 
      this.isCount = false; 
      this.isLoading = false;
      this.result = []; 
      this.currentPage = 1;
    }
  }
}
</script>

<style scoped>
/* ★共通オーバーレイ設定 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
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

/* 非活性ボタン */
.rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}

.table-scroll-container {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ccc;
  margin: 10px 0;
  background-color: #fff;
}

.result-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
}

.header-cell {
  background-color: #adff2f;
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px;
  border: 1px solid #ccc;
  white-space: nowrap;
}

.result-table td {
  padding: 8px;
  border: 1px solid #ccc;
  white-space: nowrap;
}

.text-left { text-align: left; }
.text-center { text-align: center; }

.min-w-80 { min-width: 80px; }
.min-w-100 { min-width: 100px; }
.min-w-120 { min-width: 120px; }
.min-w-200 { min-width: 200px; }
</style>
