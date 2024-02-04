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
      <button v-on:click="btnSearch()" class="rounded-ref-button">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()" class="rounded-ref-button">
        クリア
      </button>
    </div>
    <br>
    <br>
    <div style="overflow-y: auto;">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table" v-if="isCount">
        <!-- テーブルのヘッダー部分 -->
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow;">番組ID </td>
          <td style="background-color: greenyellow;">番組名 </td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">チャンネル局ID</td>
          <td style="background-color: greenyellow;" v-if="isProgramToroku">ジャンルID </td>
        </tr>
        <!-- ページごとに表示されるアイテムを反復処理 -->
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
      <div v-if="isCount">
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

export default {
  name: 'ProgramRefSearchJoken',
  props: {
    propProgramId: {
      type: String,
    },
    propProgramName: {
      type: String,
    },
    isProgramToroku: {
      type: Boolean,
    },
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
      result: [],
      url: '',
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
      maxPageLinks: 10,
    }
  },
  async created() {
    // 初期化
    this.btnClear();
    if(this.propProgramId && this.propProgramName) {
      this.programId = this.propProgramId
      this.programName = this.propProgramName
      this.btnSearch()
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
      const currentGroup = Math.ceil(this.currentPage / this.maxPageLinks);
      const startPage = (currentGroup - 1) * this.maxPageLinks + 1;
      const endPage = Math.min(currentGroup * this.maxPageLinks, this.totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
  },
  methods: {
    async btnSearch() {
      this.fetchData();
    },
    async fetchData() {
      // ① 番組IDが入力されている場合は、番組IDが8桁以内であること。
      if (this.programId.trim() !== '' && !commonUtils.isValidMaxLength(this.programId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組ID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // ② 番組名が入力されている場合は、番組名が30桁以内であること。
      if (this.programName.trim() !== '' && !commonUtils.isValidMaxLength(this.programName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // 取得処理を開始
      this.url = PROGRAM_REF_URL;
      this.url = this.url.replace('{1}', this.programId);
      this.url = this.url.replace('{2}', this.programName);
      this.result = await axios.get(this.url).then(response => (response.data.programInfoRef));
      if (this.result != null && this.result[0].programId !== null) {
        this.isCount = true;
        this.$emit('on-message', "");
        this.totalPages = Math.ceil(this.result.length / this.pageSize);
        this.resultCount = this.result.length;
      } else {
        this.msg = msgList['INFO001'];
        this.$emit('on-message', this.msg);
        this.isCount = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData(); // ページ変更時にデータを再取得するなどの処理を追加
    },
    selectProgram(programId, programName, channelKyokuId, genreId) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // programId と programName と channelKyokuId と genreId  を親コンポーネントに渡す
      this.$emit('on-select-program', { programId, programName, channelKyokuId, genreId });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.programId = '';
      this.programName = '';
      this.isCount = false;
      this.msg = '';
      this.result = [];
    },
  },
}
</script>
<style scoped>
</style>
