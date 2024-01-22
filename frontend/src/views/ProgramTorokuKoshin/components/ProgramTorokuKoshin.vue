<template>
  <div>
    <table align="center">
      <tr>
        <td>番組ID： </td>
         <td>
          <label>{{ getProgramId }}</label>
        </td>
      </tr>
      <tr>
        <td>番組名： </td>
        <td>
            <Field 
              name="programName" 
              rules="required"
              v-model="programName"
              label="番組名"
              maxlength="30"
              size="20"
              placeholder="例：ぽかぽか"
            />
        </td>
      </tr>
      <tr>
        <td>チャンネルID： </td>
        <td>
          <div>
              <select id="channelDropdown" v-model="channelId" class="custom-select">
                <option value="" disabled style="display: none;"></option>
                <option v-for="channel in this.channelInfo" :key="channel.channelId" :value="channel.channelId">
                  {{ channel.channelId }}
                </option>
              </select>
          </div>
        </td>
       </tr>
        <tr>
          <td>チャンネル名： </td>
           <td>
            {{ getChannelName(channelId) }}
           </td>
        </tr>
        <tr>
          <td>ジャンルID： </td>
          <td>
            <div>
                <select id="genreDropdown" v-model="jyunjyo" class="custom-select">
                  <option value="" disabled style="display: none;"></option>
                  <option v-for="genre in this.genreInfo" :key="genre.jyunjyo" :value="genre.jyunjyo">
                    {{ genre.jyunjyo }}
                  </option>
                </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>ジャンル名： </td>
            <td>
            {{ getGenreName(jyunjyo) }}
            </td>
        </tr>
    </table>
    </div>
    <br/>
    <br/>
    <div>
      <button v-on:click="btnToroku()">
        登録・更新
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()">
        クリア
      </button>
  </div>
</template>

<script>
import { Field} from 'vee-validate'
import axios from 'axios'
export default {
  name: 'ProgramTorokuKoshin',
  props: {
    programId: {
      type: String,
    },
  },
  computed: {
    getProgramId() {
      // this.programIdが空文字の場合とそうでない場合でラベルを変更
      return this.programId === undefined ? '（新規登録）' : this.programId;
    },
  },
  components: {
    Field,
  },
  data() {
    return {
      tmpId: '',
      programName: '',
      channelInfo: [],
      channelId: null, // チャンネルID
      genreInfo: [],
      jyunjyo: null, //ジャンルID
    };
  },
  mounted() {
    // APIからデータを取得するメソッドを呼び出す
    this.fetchData();
  },
  async created() {
    return this.programId === '' ? this.countToroku = true : this.countToroku=  false;
  },
  methods: {
    async fetchData() {
      // 更新時の場合
      if (this.programId !== undefined) {
        // 番組情報BFF（更新時のみ）※
        const programInfo = "http://localhost:8081/api/programInfoBFF/" + this.programId;
        this.result = await axios.get(programInfo).then(response => (response.data))
        if (this.result.talentId !== null) {
          this.programName = this.result.programName;
          this.channelId = this.result.channelId;
          this.jyunjyo = this.result.genreId;
        }
      }

      // チャンネル情報BFF（登録・更新時）
      const channelInfoUrl = "http://localhost:8081/api/channelInfoBFF";
      this.channelInfo = await axios.get(channelInfoUrl).then(response => response.data.channelInfo);

      // 区分マスタBFF（登録・更新モード共通）
      const genreInfoUrl = "http://localhost:8081/api/kbnMasterBFF/1";
      this.genreInfo = await axios.get(genreInfoUrl).then(response => response.data.mKbnGenre);

    },
    btnClear() {
      this.init();
    },
    btnToroku() {
      this.tmpId = '';
      // 更新時の場合
      if (this.programId !== undefined) {
        this.tmpId = this.programId;

      } else {
        // 登録時
        this.tmpId = '00000000';
      }

      // データオブジェクトを作成
      const postData = {
        programId: this.tmpId,
        programName: this.programName,
        channelId: this.channelId,
        genreId: this.jyunjyo,
        deleteFlg: '0',
        torokuDay: "",
        koushinDay: ""
      };

      // 番組登録・更新BFF（登録・更新モード共通）
      const programToroku = "http://localhost:8081/api/programTorokuKoshinBFF";

      // POSTリクエストを行う
      axios.post(programToroku, postData).then(response => {
          // 成功時の処理
          console.log(response.data);
        })
        .catch(error => {
          // エラー時の処理
          console.error('POSTリクエストエラー:', error);
        });
    },
    init(){
      this.programName = ''
      this.jyunjyo = ''
      this.channelId = ''
    },
    getChannelName(channelId) {
      const selectedChannel = this.channelInfo.find(channel => channel.channelId === channelId);
      return selectedChannel ? selectedChannel.channelName : '未選択';
    },
    getGenreName(jyunjyo) {
      const selectedGenre = this.genreInfo.find(genre => genre.jyunjyo === jyunjyo);
      return selectedGenre ? selectedGenre.genre : '未選択';
    }
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
</style>