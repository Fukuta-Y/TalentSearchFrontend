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
    <div>
      <button v-on:click="btnSearch()" class="rounded-ref-button">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button v-on:click="btnClear()" class="rounded-ref-button">
        クリア
      </button>
    </div>
    <br>
    <div style="overflow-y: auto;">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table" v-if="isCount">
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
      <div v-if="isCount">
        <div class="pagination-container">
          <a v-on:click="changePage(1)" :disabled="currentPage === 1" class="pagination-link">最初</a>
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
          <a v-on:click="changePage(totalPages)" :disabled="currentPage === totalPages" class="pagination-link">最後</a>
        </div>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate'
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import { TALENT_REF_URL } from '../../../router/constList';
import axios from 'axios'
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'TalentRefSearchJoken',
  props: {
    propTalentId: {
      type: String,
    },
    propTalentName: {
      type: String,
    },
    isTalentToroku: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message', 'on-select-talent'],
  data() {
    return {
      talentId: '',
      talentName: '',
      msg: '',
      url: '',
      isCount: false,
      result: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
    }
  },
  async created() {
    // 初期化
    this.btnClear();
    if(this.propTalentId && this.propTalentName) {
      this.talentId = this.propTalentId;
      this.talentName = this.propTalentName;
      this.btnSearch();
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
    btnSearch() {
      this.fetchData();
    },
    async fetchData() {
      // ① タレントIDが入力されている場合は、タレントIDが8桁以内であること。
      if (this.talentId.trim() !== '' && !commonUtils.isValidMaxLength(this.talentId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレントID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // ② タレント名が入力されている場合は、タレント名が30桁以内であること。
      if (this.talentName.trim() !== '' && !commonUtils.isValidMaxLength(this.talentName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレント名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // 取得処理を開始
      this.url = TALENT_REF_URL;
      this.url = this.url.replace('{1}', this.talentId);
      this.url = this.url.replace('{2}', this.talentName);
      this.result = await axios.get(this.url).then(response => (response.data.mTalent));
      if (this.result.length !== 0) {
        this.isCount = true;
        this.$emit('on-message', "");
        this.resultCount = this.result.length; // 件数を更新
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
      } else {
        this.msg = msgList['INFO001'];
        this.$emit('on-message', this.msg)
        this.isCount = false
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    selectTalent(talentId, talentName, genreId) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // talentIdとtalentNameとgenreIdを親コンポーネントに渡す
      this.$emit('on-select-talent', { talentId, talentName, genreId });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.talentId = '';
      this.talentName = '';
      this.isCount = false;
      this.msg = '';
      this.result = {};
    },
  },
}
</script>
<style scoped>
</style>