<template>
  <div>
    <table align="center">
      <tr>
        <td>対象年月： </td>
        <td><input type="text" v-model="nentsuki" size="11" placeholder="例：202304"></td>
        <td>対象週： </td>
        <td><input type="text" v-model="shu" size="5" placeholder="例：3"></td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">※月と週はセットで必須入力</font></td>
      </tr>
      <tr>
        <td>タレント名： </td>
        <td><input type="text" v-model="name" size="30" placeholder="○○太郎"></td>
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
    <table align="center" v-if="countFlg === true">
      <tr>
        <td style="text-align: left;">対象週：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg===true">
      <tr>
        <td style="background-color: greenyellow;">タレント名 </td>
        <td style="background-color: greenyellow;">週間出演番組本数 </td>
        <td style="background-color: greenyellow;">出演番組（直近） </td>
        <td style="background-color: greenyellow;">オンエア日（直近） </td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ path: 'xxxx', query: { talentId: item.talentId }}">{{ item.talentName }}</router-link></td>
        <td>{{ item.shukanShutsuenProgramHonsu }} </td>
        <td>{{ item.shutsuenProgramChokin }} </td>
        <td>{{ item.onAirDayChokin }} </td>
      </tr>
    </table>
    <br>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SearchJoken',
  props: {
  },
  data() {
    return {
      nentsuki: '',
      shu: '',
      name: '',
      shuFrom: '',
      shuTo: '',
      countFlg: false,
      result: {}
    }
  },
  mount() {
    this.init();
  },
  methods: {
    async btnSearch() {

      // ① 対象年月、対象週が必須で入力されていること。        
      // ②対象年月がYYYY / MM形式であること。        
      // ③対象週が数値かつ、1～5の数値のいずれかであること。        
      // ④タレントが30桁以内であること。

      const url = "http://localhost:8080/api/shukanTalentJohoBFF?targetNentsuki=" + this.nentsuki + "&targetShu=" + this.shu + "&talentName=" + this.name;
      this.result = await axios.get(url).then(response => (response.data))
      if(this.result[0].talentId !== null) {
          this.countFlg = true
      } else {
          this.countFlg = false
      }
    },
    btnClear() {
      this.init();
    },
    init(){
      this.nentsuki = ''
      this.shu = ''
      this.name = ''
      this.shuFrom = ''
      this.shuTo = ''
      this.countFlg = false
    }
  },
}
</script>
<style scoped>
</style>
