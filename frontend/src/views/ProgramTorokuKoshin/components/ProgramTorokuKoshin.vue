<template>
  <div>
    <table align="center">
      <tr>
        <td>番組ID： </td>
         <td>
          <label>{{ getProgramId }}</label>
        </td>
        <button v-on:click="btnProgramRefDialogOpen()">
          <label>参照</label>
        </button>
        <ProgramRefDialog 
          v-bind:prop-program-id="programId"
          v-bind:prop-program-name="programName"
          v-bind:is-program-toroku="true"
          :is-open="programRefDialogComponent" 
          @close="btnProgramRefDialogClose()" 
          v-on:on-select-program="handleSelectProgram" 
        />
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
        <td>チャンネル局ID： </td>
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
        <label>{{ getTorokuKoshinName }}</label>
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button 
        v-on:click="btnClear()">
        クリア
      </button>
  </div>
</template>

<script>
import { Field } from 'vee-validate'
import axios from 'axios'
import ProgramRefDialog from '../../ProgramRefDialog/ProgramRefDialogBaseForm.vue';
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import msgList from '../../../router/msgList';

export default {
  name: 'ProgramTorokuKoshin',
  props: {
    propProgramId: {
      type: String,
    },
  },
  computed: {
    getProgramId() {
      // this.programIdが空文字の場合とそうでない場合でラベルを変更
      return this.programId === undefined ? '（新規登録）' : this.programId;
    },
    // ラベルの木切り替え
    getTorokuKoshinName() {
      // this.programIdが空文字の場合とそうでない場合でラベルを変更
      return this.programId === undefined ? '登録' : '更新';
    },
  },
  components: {
    Field,
    ProgramRefDialog,
  },
  emits: ['on-message'],
  data() {
    return {
      programId: this.propProgramId,
      programName: null,
      channelInfo: [],
      channelId: null, // チャンネルID
      channelName: '',
      genreInfo: [],
      jyunjyo: null, //ジャンルID
      jyunjyoName: '',//ジャンル名
      programRefDialogComponent: false,
      msg: '',
    };
  },
  async created() {
    // 更新モードの場合
    if (this.programId !== undefined) {
      // ① 前画面からのパラメータは番組IDは必須で入力されていること。
      if (this.programId.trim() === '') {
        this.$emit('on-message', msgList['MSG006']);
        return;
      }
      // ② 番組IDが8桁以内であること。
      if (!this.isValidMaxLength(this.programId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組ID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // 番組情報BFF（更新時のみ）※
      const programInfoUrl = "http://localhost:8081/api/programInfoBFF/" + this.programId;
      const programInfo = await axios.get(programInfoUrl).then(response => (response.data))
      if (programInfo.talentId !== null) {
        this.programName = programInfo.programName;
        this.channelId = programInfo.channelId;
        this.jyunjyo = programInfo.genreId;
      }
   }
    // 前画面からの値で検索処理を行う。
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // チャンネル情報BFF（登録・更新時）
      const channelInfoUrl = "http://localhost:8081/api/channelInfoBFF";
      this.channelInfo = await axios.get(channelInfoUrl).then(response => response.data.channelInfo);
      // 区分マスタBFF（登録・更新モード共通）
      const genreInfoUrl = "http://localhost:8081/api/kbnMasterBFF/1";
      this.genreInfo = await axios.get(genreInfoUrl).then(response => response.data.mKbnGenre);
    },
    // 初期化ボタン
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    // 番組IDの参照時の戻り
    handleSelectProgram(selectedData) {
      this.$emit('on-message', "");
      this.programId = selectedData.programId;
      this.programName = selectedData.programName;
      this.channelId = selectedData.channelKyokuId;
      this.jyunjyo = selectedData.genreId;
    },
    // 番組参照ボタン
    btnProgramRefDialogOpen() {
      // ダイアログができたら作成
      this.programRefDialogComponent = true;
    },
    // 番組参照ボタン
    btnProgramRefDialogClose() {
      // ダイアログができたら作成
      this.programRefDialogComponent = false;
    },
    // 登録・更新ボタン
    async btnToroku() {
      // ① 全項目が必須で入力されていること。
      if (this.programName === '' ||
        this.channelId === null || this.channelName.trim() === '' ||
        this.jyunjyo === null || this.jyunjyoName.trim() === '') {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      // 更新時の場合
      if (this.programId !== undefined) {
        // ② 番組IDが8桁以内であること。
        if (!this.isValidMaxLength(this.programId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "番組ID");
          this.msg = this.msg.replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ③ 番組名が30桁以内であること。
      if (!this.isValidMaxLength(this.programName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ④ チャンネル局IDが数値であること。
      if (!this.isValidNumber(Number(this.channelId))) {
        this.msg = msgList['MSG003'].replace('{0}', "チャンネル局ID");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ チャンネル局IDが2桁以内であること。
      console.log('this.channelId:' + this.channelId);
      if (!this.isValidRange(this.channelId, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "チャンネル局ID");
        this.msg = this.msg.replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ チャンネル名が30桁以内であること。
      if (!this.isValidMaxLength(this.channelName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "チャンネル名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑦ ジャンルIDが数値であること。
      if (!this.isValidNumber(Number(this.jyunjyo))) {
        this.msg = msgList['MSG003'].replace('{0}', "ジャンルID");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑧ ジャンルIDが2桁以内であること。
      if (!this.isValidRange(this.jyunjyo, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンルID");
        this.msg = this.msg.replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑨ ジャンル名が30桁以内であること。
      if (!this.isValidMaxLength(this.jyunjyoName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンル名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // チャンネル局IDに紐づく、チャンネルIDを取得
      this.channel = this.channelInfo.find(item => item.channelId === this.channelId);
      const kbnMasterChannelUrl = "http://localhost:8081/api/kbnMasterBFF/3";
      this.kbnMasterChannel = await axios.get(kbnMasterChannelUrl).then(response => response.data.mKbnGenre);

      // チャンネル名と同一のジャンルを取得し、順序をチャンネルIDに設定
      const matchingGenre = this.kbnMasterChannel.find(item => item.genre === this.channelName);
      this.channelId = matchingGenre.jyunjyo;

      // データオブジェクトを作成
      const postData = {
        programId: this.programId !== undefined ? this.programId : '00000000',
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
          console.log("成功時の戻り値:" + JSON.stringify(response));
          this.$router.push({ name: 'main', })
        })
        .catch(error => {
          // エラー時の処理
          console.log("失敗パラメータ:" + JSON.stringify(postData));
          alert("登録失敗しました！", error);
        });
    },
    // 初期化
    init(){
      this.programId = undefined;
      this.programName = null;
      this.channelId = null;
      this.channelName = null;
      this.jyunjyo = null;
      this.jyunjyoName = null;
      this.msg = '';
    },
    isValidDate(dateString) {
      return isNaN(Date.parse(dateString));
    },
    isValidateDate(dateString) {
      // 有効日付チェック
      const parsedDate = parseISO(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
      return isValid(parsedDate);
    },
    isValidNumber(value) {
      // 数値であるかどうかをチェック
      return typeof value === 'number';
    },
    isValidRange(value, min, max) {
      // minからmaxの範囲内にあるかどうかをチェック
      return value >= min && value <= max;
    },
    isValidMaxLength(value, maxLength) {
      // 文字列の長さが【maxLength】文字以内であるかどうかをチェック
      return value.length <= maxLength;
    },
    // チャンネル名の表示
    getChannelName(channelId) {
      const selectedChannel = this.channelInfo.find(channel => channel.channelId === channelId);
      this.channelName = selectedChannel ? selectedChannel.channelName : '未選択';
      return this.channelName;
    },
    // ジャンル名の表示
    getGenreName(jyunjyo) {
      const selectedGenre = this.genreInfo.find(genre => genre.jyunjyo === jyunjyo);
      this.jyunjyoName = selectedGenre ? selectedGenre.genre : '未選択';
      return this.jyunjyoName;
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