<template>
  <div>
    <table align="center">
      <tr>
        <td>番組ID： </td>
        <td>
          <Field 
            name="programId" 
            v-model="programId"
            size="15"
            label="番組ID"
            maxlength="8"
            placeholder="例：00000001"
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
        <td>番組名： </td>
        <td>
          <Field 
            name="programName" 
            v-model="programName"
            label="番組名"
            maxlength="30"
            size="20"
            placeholder="例：ぽかぽか"
            class="rounded-textbox"
          />
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
          <td style="background-color: greenyellow;">番組ID </td>
          <td style="background-color: greenyellow;">番組名 </td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">チャンネル局ID</td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">ジャンルID </td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectProgram(item.programId, item.programName, item.channelKyokuId, item.genreId)" class="rounded-ref-button">選択</button></td>
          <td v-if="isProgramToroku">
            {{ item.programId }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'ProgramTorokuKoshin', params: { programId: item.programId } }">{{ item.programId }}</router-link>
          </td>
          <td>{{ item.programName }} </td>
          <td v-if="isProgramToroku">{{ item.channelKyokuId }} </td>
          <td v-if="isProgramToroku">{{ item.genreId }} </td>
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
import { PROGRAM_REF_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import axios from 'axios'
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'ProgramRefSearchJoken',
  props: {
    propProgramId: { type: String },
    propProgramName: { type: String },
    isProgramToroku: { type: Boolean },
  },
  components: {
    Field,
    ErrorMessage,
    DataGridViewPaging,
  },
  emits: ['on-message', 'on-select-program'],
  data() {
    return {
      programId: '',
      programName: '',
      msg: '',
      isCount: false,
      isLoading: false, 
      result: [],
      url: '',
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      maxPageLinks: 10,
    }
  },
  async created() {
    this.init();
    if(this.propProgramId && this.propProgramName) {
      this.programId = this.propProgramId
      this.programName = this.propProgramName
      // 初期検索時はバリデーションスキップ
      await this.fetchData(false)
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
      if(isValidate) {
        if (this.programId.trim() !== '' && !commonUtils.isValidMaxLength(this.programId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "番組ID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
        if (this.programName.trim() !== '' && !commonUtils.isValidMaxLength(this.programName, 30)) {
          this.msg = msgList['MSG005'].replace('{0}', "番組名").replace('{1}', "30文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ★通信開始
      this.isLoading = true;
      this.$emit('on-message', "");

      try {
        this.url = PROGRAM_REF_URL;
        this.url = this.url.replace('{1}', this.programId);
        this.url = this.url.replace('{2}', this.programName);
        
        const response = await axios.get(this.url);
        this.result = response.data.programInfoRef || [];

        if (this.result.length > 0 && this.result[0].programId !== null) {
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
        // ★通信終了
        this.isLoading = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(false); 
    },
    selectProgram(programId, programName, channelKyokuId, genreId) {
      this.$emit('on-select-program', { programId, programName, channelKyokuId, genreId });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    init(){
      this.programId = '';
      this.programName = '';
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
/* スピナー（ぐるぐる）のデザイン */
.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
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

/* 非活性時のボタン */
.rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
