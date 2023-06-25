<template>
  <div>
    <table align="center">
      <tr>
        <td>年月： </td>
        <td><input type="text" v-model="nentsuki" size="30" placeholder="例：202304"></td>
      </tr>
      <tr>
        <td>週： </td>
        <td><input type="text" v-model="shu" size="30" placeholder="例：3"></td>
      </tr>
      <tr>
        <td>タレント名： </td>
        <td><input type="text" v-model="name" size="30" placeholder="○○太郎"></td>
      </tr>
    </table>
    <br>
    <button 
      v-on:click="btnClear()">
      クリア
    </button>
    &nbsp;&nbsp;&nbsp;
    <button v-on:click="btnSearch()">
      検索
    </button>
    <br>
    <br>
    【結果】
    <br>
      週開始日：   {{ this.shuFrom }}    〜     週終了日：   {{ this.shuTo }}
    <br>
      タレントID：   {{ this.talentId }}
    <br>
      タレント名：   {{ this.talentName }}
    <br>
      週間出演番組本数：   {{ this.shukanShutsuenProgramHonsu }}
    <br>
      出演番組直近：   {{ this.shutsuenProgramChokin }}
    <br>
      オンエア日直近：   {{ this.onAirDayChokin }}
    <br>
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
      info: null,
      talentId: '',
      talentName: '',
      shukanShutsuenProgramHonsu: '',
      shutsuenProgramChokin: '',
      onAirDayChokin: '',
      shuFrom: '',
      shuTo: '',
    }
  },
  mount() {
    this.init();
  },
  methods: {
    async btnSearch() {
      const url = "http://localhost:8080/api/shukanTalentJohoBFF?targetNentsuki=" + this.nentsuki + "&targetShu=" + this.shu + "&talentName=" + this.name;
      const data = await axios
        .get(url)
        .then(response => (response.data[0]))
      this.talentId = data.talentId
      this.talentName = data.talentName
      this.shukanShutsuenProgramHonsu = data.shukanShutsuenProgramHonsu
      this.shutsuenProgramChokin = data.shutsuenProgramChokin
      this.onAirDayChokin = data.onAirDayChokin
      this.shuFrom = data.shuFrom
      this.shuTo = data.shuTo
    },
    btnClear() {
      this.init();
    },
    init(){
      this.nentsuki = ''
      this.shu = ''
      this.name = ''
      this.info = null
      this.talentId = ''
      this.talentName = ''
      this.shukanShutsuenProgramHonsu = ''
      this.shutsuenProgramChokin = ''
      this.onAirDayChokin = ''
      this.shuFrom = ''
      this.shuTo = ''
    }
  },
}
</script>
<style scoped>
</style>
