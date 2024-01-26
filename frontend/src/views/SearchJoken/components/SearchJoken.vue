<template>
  <div>
    <table align="center">
      <tr>
        <td>対象年月： </td>
        <td>
          <Field 
            name="nentsuki" 
            v-model="nentsuki"
            size="11"
            label="対象年月"
            rules="required"
            maxlength="6"
            placeholder="例：202304"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="nentsuki" /> 
        </td> 
      </tr>
      <tr>
        <td>対象週： </td>
        <td>
          <Field 
            name="shu" 
            rules="required"
            v-model="shu"
            label="対象週"
            maxlength="1"
            size="5"
            placeholder="例：3"
          />
        </td>
        <td style="font-size:11px;color:red;" >※月と週はセットで必須入力</td>
      </tr>
      <tr>
        <td colspan="2"> 
          <ErrorMessage style="font-size:12px;color:red;" name="shu" /> 
        </td> 
      </tr>
      <tr>
        <td>タレント名： </td>
        <td>
          <Field 
            name="name" 
            v-model="name"
            label="タレント名"
            size="30"
            maxlength="30"
            placeholder="○○太郎"
          />
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
    <table align="center" v-if="countFlg">
      <tr>
        <td style="text-align: left;">対象年月・週：<router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin', params: { mode:'2' , nentsuki: this.nentsuki, shu: this.shu } }">{{ `${String(this.nentsuki).substring(0, 4)}/${String(this.nentsuki).substring(4, 6)} ${this.shu}週` }}</router-link></td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td style="text-align: left;">対象週：   {{ this.result[0].shuFrom }}  ー   {{ this.result[0].shuTo }}</td>
      </tr>
    </table>
    <table align="center" border="1" style="border-collapse: collapse;" v-if="countFlg">
      <tr>
        <td style="background-color: greenyellow;">タレント名 </td>
        <td style="background-color: greenyellow;">週間出演番組本数 </td>
        <td style="background-color: greenyellow;">出演番組（直近） </td>
        <td style="background-color: greenyellow;">オンエア日（直近） </td>
      </tr>
      <tr v-for="(item, key) in result" :key="key">
        <td><router-link :to="{ name: 'TalentProgramJoken', params: { nentsuki: this.nentsuki, shu: this.shu, talentId: item.talentId } }">{{ item.talentName }}</router-link></td>
        <td>{{ item.shukanShutsuenProgramHonsu + "本"}} </td>
        <td><router-link :to="{ name: 'ProgramShutsuenJoken', params: { programId: item.shutsuenProgramIdChokin, onAirDay: item.onAirDayChokin, nentsuki: this.nentsuki, shu: this.shu } }">{{ item.shutsuenProgramChokin  }}</router-link></td>
        <td>{{ getOnAirDayFormat(item.onAirDayChokin)}} </td>
      </tr>
    </table>
    <br>
  </div>
</template>
<script>
import { Field, ErrorMessage } from 'vee-validate'
import axios from 'axios'
import moment from 'moment';
export default {
  name: 'SearchJoken',
  props: {
    propNentsuki: {
      type: String,
    },
    propShu: {
      type: String,
    },
    propTalentName: {
      type: String,
    },
  },
  components: {
    Field,
    ErrorMessage,
  },
  emits: ['on-message'],
  data() {
    return {
      nentsuki: '',
      shu: '',
      name: '',
      shuFrom: '',
      shuTo: '',
      msg: '',
      countFlg: false,
      result: {}
    }
  },
  async created() {
    this.init();
    if(this.propNentsuki && this.propShu && this.propTalentName) {
      this.nentsuki = this.propNentsuki
      this.shu = this.propShu.toString()
      this.name = this.propTalentName
      this.btnSearch()
    }
  },
  methods: {
    async btnSearch() {

      // ① 対象年月、対象週が必須で入力されていること。
      if(this.nentsuki === "" || this.shu  === "") {
        this.msg = "対象年月、対象週が必須です。"
        this.$emit('on-message', this.msg)
        return 
      }
      // ②対象年月がYYYY / MM形式であること。

      // ③対象週が数値かつ、1～5の数値のいずれかであること。 

      // ④タレントが30桁以内であること。

      const url = "http://localhost:8081/api/shukanTalentJohoBFF?nentsuki=" + this.nentsuki + "&shu=" + this.shu + "&talentName=" + this.name;
      this.result = await axios.get(url).then(response => (response.data.shukanTalent))
      if(this.result[0].talentId !== null) {
          this.countFlg = true
        this.$emit('on-message', "")
      } else {
          this.msg ="検索結果が0件です。"
          this.$emit('on-message', this.msg)
          this.countFlg = false
      }
    },
    getOnAirDayFormat(onAirDay) {
      return moment(onAirDay).format('YYYY-MM-DD HH:mm');
    },
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg)
    },
    init(){
      this.nentsuki = ''
      this.shu = ''
      this.name = ''
      this.shuFrom = ''
      this.shuTo = ''
      this.countFlg = false
      this.msg = ''
      this.result = {}
    },
  },
}
</script>
<style scoped>
</style>