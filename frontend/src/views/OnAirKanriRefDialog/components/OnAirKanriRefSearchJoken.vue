<template>
  <div class="search-joken-wrapper">
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
          ></Datepicker>
        </td>
      </tr>
      <tr>
        <td colspan="2"><ErrorMessage style="font-size:12px;color:red;" name="shu" /></td>
      </tr>
    </table>

    <br>
    <div class="button-group">
      <button v-on:click="btnSearch()" class="rounded-ref-button">検索</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-ref-button">クリア</button>
    </div>
    <br>

    <div v-if="isCount" class="result-container">
      <div class="table-scroll-container">
        <table align="center" border="1" style="border-collapse: collapse;" class="result-table">
          <thead>
            <tr>
              <th class="header-cell"></th>
              <th class="header-cell" style="width:80px;">ID </th>
              <th class="header-cell" style="width:150px;">オンエア日時</th>
              <th class="header-cell" style="width:80px;">番組ID</th>
              <th class="header-cell" style="width:250px;">番組名</th>
              <th class="header-cell">タレントID</th>
              <th class="header-cell" style="width:250px;">タレント名</th>
              <th class="header-cell" style="width:115px;">年月・週</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in paginatedResult" :key="key">
              <td>
                <button 
                  v-on:click="selectId(item.id, item.onAirDay, item.programId, item.programName, item.talentId, item.talentName, item.nentsuki, item.shu)" 
                  class="rounded-ref-button"
                >選択</button>
              </td>
              <td>{{ item.id }} </td>
              <td>{{ item.onAirDay.toString().substring(0, 16) }} </td>
              <td><router-link :to="{ name: 'ProgramTorokuKoshin', params: { programId: item.programId } }">{{ item.programId }}</router-link></td>
              <td class="text-left">{{ item.programName }} </td>
              <td><router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: item.talentId } }">{{ item.talentId }}</router-link></td>
              <td class="text-left">{{ item.talentName }} </td>
              <td><router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { nentsuki: item.nentsuki, shu: item.shu } }">{{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}</router-link></td>
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
      id: '', onAirDay: '', msg: '', url: '', isCount: false,
      result: [], currentPage: 1, pageSize: 10, totalPages: 0, maxPageLinks: 10,
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
    async btnSearch() { this.currentPage = 1; this.fetchData(true); },
    async fetchData(isValidate) {
      if (isValidate) {
        if (this.id && !commonUtils.isValidMaxLength(this.id, 8)) {
          this.$emit('on-message', msgList['MSG005'].replace('{0}', "ID").replace('{1}', "8文字"));
          return;
        }
        if (this.onAirDay) {
          this.onAirDay = format(new Date(this.onAirDay), 'yyyy-MM-dd HH:mm');
        }
      }
      this.url = ON_AIR_KANRI_REF_URL.replace('{1}', this.id || '').replace('{2}', this.onAirDay || '');
      const response = await axios.get(this.url);
      this.result = response.data.tOnAirKanriRef || [];
      this.isCount = this.result.length > 0;
      if (this.isCount) {
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.$emit('on-message', "");
      } else {
        this.$emit('on-message', msgList['INFO001']);
      }
    },
    changePage(p) { this.currentPage = p; },
    selectId(id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu) {
      this.$emit('on-select-id', { id, onAirDay, programId, programName, talentId, talentName, nentsuki, shu });
    },
    btnClear() { this.init(); this.$emit('on-message', ""); },
    init() { this.id = ''; this.onAirDay = ''; this.isCount = false; this.result = []; }
  }
}
</script>

<style scoped>
.table-scroll-container {
  max-height: 400px; /* ここで高さを制限してスクロールさせる */
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ccc;
  margin: 10px 0;
}
.header-cell {
  background-color: greenyellow;
  position: sticky;
  top: 0;
  z-index: 2;
}
.result-table { width: 100%; border-collapse: collapse; }
.text-left { text-align: left; }
</style>
