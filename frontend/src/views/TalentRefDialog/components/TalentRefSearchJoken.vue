<template>
  <div>
    <table align="center">
      <tr>
        <td>タレントID： </td>
        <td>
          <Field 
            name="talentId" 
            v-model="talentId"
            size="15"
            label="タレントID"
            maxlength="8"
            placeholder="例：10000001"
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
        <td>タレント名： </td>
        <td>
          <Field 
            name="talentName" 
            v-model="talentName"
            label="タレント名"
            maxlength="30"
            size="20"
            placeholder="例：タモリ"
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
    <div class="button-group">
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
    <div style="overflow-y: auto;" v-if="isCount && !isLoading">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table">
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow;">タレントID </td>
          <td style="background-color: greenyellow;">タレント名 </td>
          <td style="background-color: greenyellow;" v-if="isTalentToroku">ジャンルID</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectTalent(item.talentId, item.talentName, item.genreId)" class="rounded-ref-button">選択</button></td>
          <td v-if="isTalentToroku">
              {{ item.talentId }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: item.talentId } }">{{ item.talentId }}</router-link>
          </td>
          <td>{{ item.talentName }} </td>
          <td v-if="isTalentToroku">{{ item.genreId }} </td>
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
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import { TALENT_REF_URL } from '../../../router/constList';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import axios from 'axios'
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'TalentRefSearchJoken',
  props: {
    propTalentId: { type: String },
    propTalentName: { type: String },
    isTalentToroku: { type: Boolean, required: true },
  },
  components: {
    Field,
    ErrorMessage,
    DataGridViewPaging,
  },
  emits: ['on-message', 'on-select-talent'],
  data() {
    return {
      talentId: '',
      talentName: '',
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
    if(this.propTalentId && this.propTalentName) {
      this.talentId = this.propTalentId;
      this.talentName = this.propTalentName;
      // 第1引数(isValidate)にfalseを渡して初期検索
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
        if (this.talentId.trim() !== '' && !commonUtils.isValidMaxLength(this.talentId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "タレントID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
        if (this.talentName.trim() !== '' && !commonUtils.isValidMaxLength(this.talentName, 30)) {
          this.msg = msgList['MSG005'].replace('{0}', "タレント名").replace('{1}', "30文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ★通信開始
      this.isLoading = true;
      this.$emit('on-message', "");

      try {
        this.url = TALENT_REF_URL;
        this.url = this.url.replace('{1}', this.talentId);
        this.url = this.url.replace('{2}', this.talentName);
        
        const response = await axios.get(this.url);
        this.result = response.data.mTalent || [];

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
        // ★通信終了
        this.isLoading = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(false); 
    },
    selectTalent(talentId, talentName, genreId) {
      this.$emit('on-select-talent', { talentId, talentName, genreId });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', '');
    },
    init(){
      this.talentId = '';
      this.talentName = '';
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
