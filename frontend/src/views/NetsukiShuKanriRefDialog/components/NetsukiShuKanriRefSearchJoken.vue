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
            label="対象年"
            rules="required"
            maxlength="4"
            placeholder="例：2023"
          /> 年
        </td>
        <td>
          <Field 
            name="tsuki" 
            v-model="tsuki"
            size="6"
            label="対象月"
            rules="required"
            maxlength="2"
            placeholder="例：4"
          />月
        </td>
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
      <button v-on:click="btnSearch()">
        検索
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()">
        クリア
      </button>
    </div>
    <br>
    <br>
    <div style="overflow-y: auto;">
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;"></td>
        <td style="background-color: greenyellow; width:80px;">年月</td>
        <td style="background-color: greenyellow; width:50px;">週</td>
        <td style="background-color: greenyellow; width:180px;">週の開始日（日曜日）</td>
        <td style="background-color: greenyellow; width:180px;">週の終了日（土曜日）</td>
      </tr>
      <tr v-for="(item, key) in paginatedResult" :key="key">
        <td><button v-on:click="selectNentsukiShu(item.nentsuki, item.shu, item.shuFrom, item.shuTo)">選択</button></td>
        <td>{{ item.nentsuki }} </td>
        <td>{{ item.shu }} </td>
        <td>{{ item.shuFrom }} </td>
        <td>{{ item.shuTo }} </td>
      </tr>
    </table>
    <div>
      <button v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)">
        {{ pageNumber }}
      </button>
    </div>
    </div>
    <br>
  </div>
</template>
<script>
import { Field, ErrorMessage } from 'vee-validate'
import axios from 'axios'
export default {
  name: 'NetsukiShuKanriRefSearchJoken',
  props: {
    propNen: {
      type: String,
    },
    propTsuki: {
      type: String,
    },
    propShu: {
      type: String,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  watch: {
    selectedDate: function (newDate) {
      // 日付をフォーマットして表示用の変数にセット
      this.formattedDate = this.formatDate(newDate);
    },
  },
  emits: ['on-message', 'on-select-nentsuki-shu'],
  data() {
    return {
      nen: '',
      tsuki: '',
      shu: '',
      msg: '',
      countFlg: false,
      result: {},
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
      totalPages: 0,
      formattedDate: null,
    }
  },
  async created() {
    this.init();
    if(this.propNen && this.propTsuki && this.propShu) {
      this.nen = this.propNen
      this.tsuki = this.propTsuki
      this.shu = this.propShu.toString()
      this.btnSearch()
    }
  },
  computed: {
    paginatedResult() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.result.slice(startIndex, endIndex);
    },
  },
  methods: {
    async btnSearch() {
      const url = "http://localhost:8081/api/nentsukiShuKanrRefBFF?nentsuki=" + this.nen + this.tsuki + "&shu=" + this.shu;
      this.result = await axios.get(url).then(response => (response.data.mNentsukiShuKanri));
      this.resultCount = this.result.length; // 件数を更新
      if(this.result[0].nentsuki !== null) {
          this.countFlg = true
          this.$emit('on-message', "")
      } else {
          this.msg ="検索結果が0件です。"
          this.$emit('on-message', this.msg)
          this.countFlg = false
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
      this.$emit('on-message', this.msg)
    },
    init(){
      this.nen = '',
      this.tsuki = '',
      this.shu = '',
      this.countFlg = false
      this.msg = ''
      this.result = {}
    },
  },
}
</script>
<style scoped>
.custom-select {
  width: 150px;
  /* 任意の幅を指定してください */
  padding: 2px;
  /* 適切なパディングを指定してください */
  box-sizing: border-box;
}

/* 最低限のstyle */
.date-picker {
  margin: 60px auto 0;
  width: 60%;
}
</style>