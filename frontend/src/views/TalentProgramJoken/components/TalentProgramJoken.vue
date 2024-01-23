<template>
  <div>
    <table align="center" v-if="countFlg">
      <tr>
        <td>出演者： </td>
        <td><router-link :to="{ name: 'TalentTorokuKoshin', params: { talentId: this.talentId } }">{{ this.result[0].talentName }}</router-link></td>
      </tr>
      <tr>
        <td>出演者ジャンル： </td>
        <td>{{ this.result[0].shutsuenshaGenre }}</td>
      </tr>
    </table>
    <br>
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">対象週：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">出演番組 </td>
        <td style="background-color: greenyellow;">放送局（チャンネル） </td>
        <td style="background-color: greenyellow;">オンエア日</td>
        <td style="background-color: greenyellow;">放送時間</td>
        <td style="background-color: greenyellow;">番組ジャンル</td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'ProgramShutsuenJoken', params: { programId: item.programId, onAirDay: item.onAirDay + ' ' + item.onAirTime, nentsuki: this.nentsuki, shu: this.shu } }">{{ item.shutsuenProgram }}</router-link></td>
        <td>{{ item.hosokyokuChannel }} </td>
        <td>{{ item.onAirDay }} </td>
        <td>{{ item.onAirTime }} </td>
        <td>{{ item.programGenre }} </td>
      </tr>
    </table>
    <table align="center" border="0" style="border-collapse: collapse;" v-if="countFlg==false">
      <tr>
        <font color="red">{{ this.msg }} </font>
      </tr>
    </table>
    <br>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TalentProgramJoken',
  props: {
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    },
    talentId: {
      type: String,
    },
  },
  data() {
    return {
      shuFrom: '',
      shuTo: '',
      msg: '',
      countFlg: false,
      result: {}
    }
  },
  async created() {
    this.search();
  },
  methods: {
    async search() {
      const url = "http://localhost:8081/api/talentShukanShutsuenJohoBFF?nentsuki=" + this.nentsuki + "&shu=" + this.shu + "&talentId=" + this.talentId;
      this.result = await axios.get(url).then(response => (response.data.talentShukanShutsuen))
      if(this.result[0].talentName !== null) {
          this.countFlg = true
      } else {
          this.msg ="検索結果が0件です。"
          this.countFlg = false
      }
    },
    btnClear() {
      this.init();
    },
    init(){
      this.shuFrom = ''
      this.shuTo = ''
      this.countFlg = false
      this.msg = ''
      this.result= { }
    }
  },
}
</script>
<style scoped>
</style>
