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
          <td>タレントID： </td>
          <td>
            <label>{{ gettalentId }}</label>
          </td>
          <button v-on:click="btnTalentRefDialogOpen()" class="rounded-ref-button" :disabled="isSubmitting">
            <label>参照</label>
          </button>
          <TalentRefDialog 
            v-bind:prop-talent-id="talentId"
            v-bind:prop-talent-name="talentName"
            v-bind:is-talent-toroku="true"
            :is-open="talentRefDialogComponent" 
            @close="btnTalentRefDialogClose()" 
            v-on:on-select-talent="handleSelectTalent" 
          />
        </tr><br/>
        <tr>
          <td>タレント名： </td>
          <td>
            <Field 
              name="talentName" 
              v-model="talentName"
              label="タレント名"
              maxlength="30"
              size="20"
              placeholder="例：タモリ"
              class="rounded-textbox"
            />
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
        </tr>
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
import { TALENT_TOROKU_KOSHIN_URL, TALENT_INFO_URL, KBN_MASTER_URL } from '../../../router/constList';
import { commonUtils } from '../../../router/utils/sysCom/VeeValidateSettings';
import axios from 'axios'
import TalentRefDialog from '../../TalentRefDialog/TalentRefDialogBaseForm.vue';
import msgList from '../../../router/msgList';
import '../../../router/styles/common.css';

export default {
  name: 'TalentTorokuKoshin',
  props: {
    propTalentId: { type: String },
  },
  computed: {
    gettalentId() {
      return this.talentId === undefined ? '（新規登録）' : this.talentId;
    },
    getTorokuKoshinName() {
      return this.talentId === undefined ? '登録' : '更新';
    },
  },
  components: {
    Field,
    TalentRefDialog,
  },
  emits: ['on-message'],
  data() {
    return {
      talentId: this.propTalentId,
      talentName: null,
      genreInfo: [],
      msg: '',
      url: '',
      jyunjyo: null, // ジャンルID
      jyunjyoName: '', // ジャンル名
      talentRefDialogComponent: false,
      isLoading: false,    // ★初期データ読込用オーバーレイ制御
      isSubmitting: false, // ★登録・更新処理用オーバーレイ制御
    };
  },
  async created() {
    this.init();
    this.isLoading = true; // ロード開始
    try {
      if (this.talentId !== undefined) {
        if (this.talentId.trim() === '') {
          this.$emit('on-message', msgList['MSG006']);
          this.isLoading = false;
          return;
        }
        if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "タレントID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          this.isLoading = false;
          return;
        }
        this.url = TALENT_INFO_URL.replace("{1}", this.talentId);
        const talentInfo = await axios.get(this.url).then(response => response.data);
        if (talentInfo && talentInfo.talentId !== null) {
          this.talentName = talentInfo.talentName;
          this.jyunjyo = talentInfo.genreId;
        }
      }
      await this.fetchData();
    } catch (error) {
      console.error("読込失敗:", error);
      this.$emit('on-message', "データの取得に失敗しました。");
    } finally {
      this.isLoading = false; // ロード終了
    }
  },
  methods: {
    async fetchData() {
      this.url = KBN_MASTER_URL.replace("{1}", "2");
      const response = await axios.get(this.url);
      this.genreInfo = response.data.mKbnGenre;
    },
    btnClear() {
      this.init();
      this.$emit('on-message', "");
    },
    async btnToroku() {
      if (this.talentName === '' || this.talentName === null ||
        this.jyunjyo === null || this.jyunjyoName === '未選択') {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      if (this.talentId !== undefined) {
        if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "タレントID").replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }

      if (!commonUtils.isValidMaxLength(this.talentName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレント名").replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      if (!commonUtils.isValidNumber(Number(this.jyunjyo))) {
        this.msg = msgList['MSG003'].replace('{0}', "ジャンルID").replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      if (!commonUtils.isValidRange(this.jyunjyo, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンルID").replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      if (!commonUtils.isValidMaxLength(this.jyunjyoName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンル名").replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      this.isSubmitting = true;
      this.$emit('on-message', "");

      const postData = {
        talentId: this.talentId !== undefined ? this.talentId : '00000000',
        talentName: this.talentName,
        genreId: this.jyunjyo,
        deleteFlg: '0',
        torokuDay: "",
        koushinDay: ""
      };

      try {
        this.url = TALENT_TOROKU_KOSHIN_URL;
        await axios.post(this.url, postData);
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error("失敗:", error);
        alert("登録に失敗しました。");
        this.isSubmitting = false; 
      }
    },
    btnTalentRefDialogOpen() {
      this.talentRefDialogComponent = true;
    },
    btnTalentRefDialogClose() {
      this.talentRefDialogComponent = false;
    },
    handleSelectTalent(selectedData) {
      this.$emit('on-message', "");
      this.talentId = selectedData.talentId;
      this.talentName = selectedData.talentName;
      this.jyunjyo = selectedData.genreId;
    },
    init(){
      this.talentId = this.propTalentId;
      this.talentName = null;
      this.jyunjyo = null;
      this.jyunjyoName = '未選択';
      this.msg = '';
      this.isLoading = false;
      this.isSubmitting = false;
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
/* ★共通オーバーレイ（登録・更新・初期読込） */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* 半透明背景 */
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
