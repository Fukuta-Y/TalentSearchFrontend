<template>
  <div>
    <table align="center" v-if="countFlg">
      <tr>
        <td>番組名： </td>
         <td>{{ this.result[0].programName }}</td>
      </tr>
      <tr>
        <td>オンエア日： </td>
        <td>{{ this.onairDay }}</td>
      </tr>
      <tr>
        <td>番組ジャンル： </td>
        <td>{{ this.result[0].programGenre }}</td>
      </tr>
    </table>
    <br>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">タレント名 </td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'TalentProgramJoken', params: { nentsuki: this.nentsuki, shu: this.shu, talentId: item.talentId }}">{{ item.talentName }}</router-link></td>
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
  name: 'ProgramShutsuenJoken',
  props: {
    programId: {
      type: String,
    },
    onairDay: {
      type: String,
    },
    nentsuki: {
      type: String,
    },
    shu: {
      type: String,
    }
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
      const url = "http://localhost:8081/api/programShutsuenBFF?programId=" + this.programId + "&onairDay=" + this.onairDay +"&nentsuki=" + this.nentsuki + "&shu=" + this.shu +  "&talentId=" + this.talentId;
      this.result = await axios.get(url).then(response => (response.data))
      if(this.result[0].talentId !== null) {
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
