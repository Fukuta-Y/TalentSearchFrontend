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
            rules="required"
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
            rules="required"
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
            rules="required"
            v-model="shu"
            label="週"
            maxlength="1"
            size="5"
            placeholder="例：3"
            class="rounded-textbox"
          /> 週目
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
    <br>
    <div style="overflow-y: auto;">
      <table align="center" border="1" style="border-collapse: collapse;" class="result-table" v-if="isCount">
        <tr>
          <td style="background-color: greenyellow;"></td>
          <td style="background-color: greenyellow; width:150px;">年月・週</td>
          <td style="background-color: greenyellow; width:180px;">週の開始日（日曜日）</td>
          <td style="background-color: greenyellow; width:180px;">週の終了日（土曜日）</td>
        </tr>
        <tr v-for="(item, key) in paginatedResult" :key="key">
          <td><button v-on:click="selectNentsukiShu(item.nentsuki, item.shu, item.shuFrom, item.shuTo)" class="rounded-ref-button">選択</button></td>
          <td v-if="isNentsukiShu">
             {{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週` }}
          </td>
          <td v-else>
            <router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { mode: '2', nentsuki: item.nentsuki, shu: item.shu } }">{{ `${String(item.nentsuki).substring(0, 4)}/${String(item.nentsuki).substring(4, 6)} ${item.shu}週目` }}</router-link>
          </td>
          <td>{{ item.shuFrom }} </td>
          <td>{{ item.shuTo }} </td>
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
import { NENTSUKI_SHU_KANRI_REF_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import DataGridViewPaging from '../../common/DataGridViewPaging.vue';
import axios from 'axios'
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'NetsukiShuKanriRefSearchJoken',
  props: {
    propNentsukiShu: {
      type: String,
    },
    isNentsukiShu: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Field,
    ErrorMessage,
    DataGridViewPaging,
  },
  watch: {
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
      result: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      maxPageLinks: 10,
    }
  },
  async created() {
    // 初期化
    this.btnClear();
    if(this.propNentsukiShu) {
      this.nen = this.propNentsukiShu.toString().substring(0, 4);
      this.tsuki = this.propNentsukiShu.toString().substring(4, 6);
      this.shu = this.propNentsukiShu.toString().substring(6, 7);
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
      const startPage = (currentGroup - 1) * this. maxPageLinks + 1;
      const endPage = Math.min(currentGroup * this.maxPageLinks, this.totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
  },
  methods: {
     btnSearch() {
      this.fetchData();
    },
    async fetchData() {
      // ①年が入力されている場合は、月と必須で入力であること。
      if (this.nen.trim() !== '') {
        if (this.tsuki.trim() === '') {
          this.msg = msgList['MSG002'].replace('{0}', "年と月");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ②月が入力されている場合は、年と必須で入力であること。
      if (this.tsuki.trim() !== '') {
        if (this.nen.trim() === '') {
          this.msg = msgList['MSG002'].replace('{0}', "年と月");
          this.$emit('on-message', this.msg);
          return;
        }
      }
      // ③年月がYYYYMM形式であること。
      // ④ 年月がYYYY/MM/01で有効な日付であること。
      if (this.nen.trim() !== '' && this.tsuki.trim() !== '' && !commonUtils.isValidateDate(this.nen + this.tsuki + "01")) {
        this.msg = msgList['MSG003'].replace('{0}', "年月");
        this.msg = this.msg.replace('{1}', "有効な日付の年月（YYYYMM)");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ 週が数値であること。
      if (this.shu.toString().trim() !== '' && !commonUtils.isValidNumber(Number(this.shu))) {
        this.msg = msgList['MSG003'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ 週が1～5の数値のいずれかであること。
      if (this.shu.toString().trim() !== '' && !commonUtils.isValidRange(Number(this.shu), 1, 5)) {
        this.msg = msgList['MSG004'].replace('{0}', "週");
        this.msg = this.msg.replace('{1}', "1");
        this.msg = this.msg.replace('{2}', "5");
        this.$emit('on-message', this.msg);
        return;
      }

      // 年月を0埋め形式へ変換
      if (this.tsuki.trim() !== '') {
        this.nentsuki = this.nen + this.tsuki.padStart(2, '0');
      }
      // 取得処理を開始
      this.url = NENTSUKI_SHU_KANRI_REF_URL;
      this.url = this.url.replace('{1}', this.nentsuki);
      this.url = this.url.replace('{2}', this.shu);
      this.result = await axios.get(this.url).then(response => (response.data.mNentsukiShuKanri));
      if (this.result.length !== 0) {
        this.isCount = true;
        this.$emit('on-message', "");
        this.resultCount = this.result.length; // 件数を更新
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
    selectNentsukiShu(nentsuki, shu, shuFrom, shuTo) {
      // 「選択」ボタンがクリックされたときに呼ばれるメソッド
      // nentsukiとshuとshuFromとshuToを親コンポーネントに渡す
      this.$emit('on-select-nentsuki-shu', { nentsuki, shu, shuFrom, shuTo });
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    init(){
      this.nentsuki = '';
      this.nen = '';
      this.tsuki = '';
      this.shu = '';
      this.isCount = false;
      this.msg = '';
      this.result = {};
    },
  },
}
</script>
<style scoped>
</style>