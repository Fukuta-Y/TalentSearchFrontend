<template>
  <div>
    <div v-if="isLoading || isSubmitting" class="loading-overlay">
      <div class="loading-content">
        <div class="loader-overlay"></div>
        <p v-if="isLoading">データを取得しています...</p>
        <p v-else>{{ getTorokuKoshinName }}処理中です...</p>
      </div>
    </div>

    <div v-show="!isLoading">
      <table align="center">
        <tr>
          <td>番組ID： </td>
          <td>
            <label>{{ getProgramId }}</label>
          </td>
          <button v-on:click="btnProgramRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
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
        </tr><br/>
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
        </tr><br/>
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
        </tr><br/>
        <tr>
          <td>チャンネル名： </td>
          <td>
            {{ getChannelName(channelId) }}
          </td>
        </tr><br/>
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
        </tr><br/>
        <tr>
          <td>ジャンル名： </td>
          <td>
            {{ getGenreName(jyunjyo) }}
          </td>
        </tr><br/>
      </table>

      <br/>
      <br/>
      <div>
        <button v-on:click="btnToroku()" class="rounded-button" :disabled="isSubmitting">
          <label>{{ getTorokuKoshinName }}</label>
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button v-on:click="btnClear()" class="rounded-button" :disabled="isSubmitting">
          クリア
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field } from 'vee-validate'
import { PROGRAM_INFO_URL, CHANNEL_INFO_URL, KBN_MASTER_URL, PROGRAM_TOROKU_KOSHIN_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import axios from 'axios'
import ProgramRefDialog from '../../ProgramRefDialog/ProgramRefDialogBaseForm.vue';
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'ProgramTorokuKoshin',
  props: {
    propProgramId: { type: String },
  },
  computed: {
    getProgramId() {
      return this.programId === undefined ? '（新規登録）' : this.programId;
    },
    getTorokuKoshinName() {
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
      channelId: null, // チャンネル局ID
      channelName: '',
      genreInfo: [],
      jyunjyo: null, // ジャンルID
      jyunjyoName: '', // ジャンル名
      programRefDialogComponent: false,
      msg: '',
      url: '',
      isLoading: false,    // ★初期データ読込用オーバーレイ制御
      isSubmitting: false, // ★登録・更新処理用オーバーレイ制御
    };
  },
  async created() {
    this.init();
    
    // ★初期データ取得開始
    this.isLoading = true;
    try {
      if (this.propProgramId !== undefined) {
        this.programId = this.propProgramId;
        // ① パラメータ必須チェック
        if (this.programId.trim() === '') {
          this.$emit('on-message', msgList['MSG006']);
          this.isLoading = false;
          return;
        }
        // ② 番組ID桁数チェック
        if (!commonUtils.isValidMaxLength(this.programId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "番組ID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          this.isLoading = false;
          return;
        }

        // 番組詳細情報取得（更新時）
        this.url = PROGRAM_INFO_URL.replace("{1}", this.programId);
        const programInfo = await axios.get(this.url).then(response => response.data);
        if (programInfo && programInfo.programName !== null) {
          this.programName = programInfo.programName;
          this.channelId = programInfo.channelId;
          this.jyunjyo = programInfo.genreId;
        }
      }
      // マスタ情報取得
      await this.fetchData();
    } catch (error) {
      console.error(error);
      this.$emit('on-message', "データの取得に失敗しました。");
    } finally {
      this.isLoading = false; // ★ロード終了
    }
  },
  methods: {
    async fetchData() {
      // チャンネル情報取得
      this.url = CHANNEL_INFO_URL;
      this.channelInfo = await axios.get(this.url).then(response => response.data.channelInfo);
      
      // 区分マスタ（番組ジャンル: 1）
      this.url = KBN_MASTER_URL.replace("{1}", "1");
      this.genreInfo = await axios.get(this.url).then(response => response.data.mKbnGenre);
    },
    btnClear() {
      this.init();
      this.$emit('on-message', "");
    },
    handleSelectProgram(selectedData) {
      this.$emit('on-message', "");
      this.programId = selectedData.programId;
      this.programName = selectedData.programName;
      this.channelId = selectedData.channelKyokuId;
      this.jyunjyo = selectedData.genreId;
    },
    btnProgramRefDialogOpen() {
      this.programRefDialogComponent = true;
    },
    btnProgramRefDialogClose() {
      this.programRefDialogComponent = false;
    },
    async btnToroku() {
      // ① 必須チェック
      if (this.programName === '' || this.programName === null ||
        this.channelId === null || this.channelName === '未選択' ||
        this.jyunjyo === null || this.jyunjyoName === '未選択') {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      // ② 更新時ID桁数チェック
      if (this.programId !== undefined) {
        if (!commonUtils.isValidMaxLength(this.programId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "番組ID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      // ③ 番組名桁数チェック
      if (!commonUtils.isValidMaxLength(this.programName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "番組名").replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ④ チャンネル局ID数値チェック
      if (!commonUtils.isValidNumber(Number(this.channelId))) {
        this.msg = msgList['MSG003'].replace('{0}', "チャンネル局ID").replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ チャンネル局ID範囲チェック
      if (!commonUtils.isValidRange(this.channelId, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "チャンネル局ID").replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ チャンネル名桁数チェック
      if (!commonUtils.isValidMaxLength(this.channelName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "チャンネル名").replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑦ ジャンルID数値チェック
      if (!commonUtils.isValidNumber(Number(this.jyunjyo))) {
        this.msg = msgList['MSG003'].replace('{0}', "ジャンルID").replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑧ ジャンルID範囲チェック
      if (!commonUtils.isValidRange(this.jyunjyo, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンルID").replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑨ ジャンル名桁数チェック
      if (!commonUtils.isValidMaxLength(this.jyunjyoName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンル名").replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ★送信処理開始（オーバーレイ）
      this.isSubmitting = true;
      this.$emit('on-message', "");

      try {
        // チャンネル局IDから内部用チャンネルIDを補完（区分マスタ 3）
        this.url = KBN_MASTER_URL.replace("{1}", "3");
        const kbnResponse = await axios.get(this.url);
        const kbnMasterChannel = kbnResponse.data.mKbnGenre;

        const matchingGenre = kbnMasterChannel.find(item => item.genre === this.channelName);
        const submitChannelId = matchingGenre ? matchingGenre.jyunjyo : this.channelId;

        const postData = {
          programId: this.programId !== undefined ? this.programId : '00000000',
          programName: this.programName,
          channelId: submitChannelId,
          genreId: this.jyunjyo,
          deleteFlg: '0',
          torokuDay: "",
          koushinDay: ""
        };

        this.url = PROGRAM_TOROKU_KOSHIN_URL;
        await axios.post(this.url, postData);
        
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error("失敗:", error);
        alert("登録に失敗しました。");
        this.isSubmitting = false; 
      }
    },
    init(){
      this.programId = this.propProgramId;
      this.programName = null;
      this.channelId = null;
      this.channelName = '未選択';
      this.jyunjyo = null;
      this.jyunjyoName = '未選択';
      this.msg = '';
      this.isLoading = false;
      this.isSubmitting = false;
    },
    getChannelName(channelId) {
      const selectedChannel = this.channelInfo.find(channel => channel.channelId === channelId);
      this.channelName = selectedChannel ? selectedChannel.channelName : '未選択';
      return this.channelName;
    },
    getGenreName(jyunjyo) {
      const selectedGenre = this.genreInfo.find(genre => genre.jyunjyo === jyunjyo);
      this.jyunjyoName = selectedGenre ? selectedGenre.genre : '未選択';
      return this.jyunjyoName;
    }
  },
}
</script>

<style scoped>
/* ★登録・更新・初期読込共通オーバーレイ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 30px 50px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.loader-overlay {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rounded-button:disabled, .rounded-ref-button:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed;
}
</style>
