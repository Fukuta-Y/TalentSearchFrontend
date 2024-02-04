<template>
  <div>
    <table align="center">
      <tr>
        <td>タレントID： </td>
         <td>
          <label>{{ gettalentId }}</label>
        </td>
        <button v-on:click="btnTalentRefDialogOpen()" class="rounded-ref-button">
          <label>参照</label>
        </button>
        <TalentRefDialog 
          v-bind:prop-talent-id="talentId"
          v-bind:prop-talent-name="talentName"
          v-bind:is-talent-toroku="true"
          :is-open="talentRefDialogComponent" 
          v-on:click="btnTalentRefDialogClose()"
          v-on:on-select-talent="handleSelectTalent" 
        />
      </tr><br/>
      <tr>
        <td>タレント名： </td>
        <td>
            <Field 
              name="talentName" 
              rules="required"
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
    </div>
    <br/>
    <br/>
    <div>
      <button v-on:click="btnToroku()" class="rounded-button">
        <label>{{ getTorokuKoshinName }}</label>
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button  v-on:click="btnClear()" class="rounded-button">
        クリア
      </button>
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
    propTalentId: {
      type: String,
    },
  },
  computed: {
    gettalentId() {
      // this.talentIdが空文字の場合とそうでない場合でラベルを変更
      return this.talentId === undefined ? '（新規登録）' : this.talentId;
    },
    // ラベルの木切り替え
    getTorokuKoshinName() {
      // this.talentIdが空文字の場合とそうでない場合でラベルを変更
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
      jyunjyo: null, //ジャンルID
      jyunjyoName: '',
      talentRefDialogComponent: false,
    };
  },
  async created() {
    // 更新モードの場合
    if (this.talentId !== undefined) {
      // ① 前画面からのパラメータはタレントIDは必須で入力されていること。
      if (this.talentId.trim() === '') {
        this.$emit('on-message', msgList['MSG006']);
        return;
      }
      // ② タレントIDが8桁以内であること。
      if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレントID");
        this.msg = this.msg.replace('{1}', "8文字");
        this.$emit('on-message', this.msg);
        return;
      }
      // タレント情報BFF（更新時のみ）※
      this.url = TALENT_INFO_URL;
      this.url = this.url.replace("{1}", this.talentId);
      const talentInfo = await axios.get(this.url).then(response => (response.data));
      if (talentInfo.talentId !== null) {
        this.talentName = talentInfo.talentName;
        this.jyunjyo = talentInfo.genreId;
      }
    }
    // 前画面からの値で検索処理を行う。
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // 区分マスタBFF（登録・更新モード共通）
      this.url = KBN_MASTER_URL;
      this.url = this.url.replace("{1}", "2");
      this.genreInfo = await axios.get(this.url).then(response => response.data.mKbnGenre);
    },
    // 初期化ボタン
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    // 登録・更新ボタン
    async btnToroku() {
      // ① 全項目が必須で入力されていること。
      if (this.talentName === '' ||
        this.jyunjyo === null || this.jyunjyoName.trim() === '') {
        this.msg = msgList['MSG007'];
        this.$emit('on-message', this.msg);
        return;
      }

      // 更新時の場合
      if (this.talentId !== undefined) {
        // ② タレントIDが8桁以内であること。
        if (!commonUtils.isValidMaxLength(this.talentId, 8)) {
          this.msg = msgList['MSG005'].replace('{0}', "タレントID");
          this.msg = this.msg.replace('{1}', "8文字");
          this.$emit('on-message', this.msg);
          return;
        }
      }
      // ③ タレント名が30桁以内であること。
      if (!commonUtils.isValidMaxLength(this.talentName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "タレント名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // ④ ジャンルIDが数値であること。
      if (!commonUtils.isValidNumber(Number(this.jyunjyo))) {
        this.msg = msgList['MSG003'].replace('{0}', "ジャンルID");
        this.msg = this.msg.replace('{1}', "数値");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑤ ジャンルIDが2桁以内であること。
      if (!commonUtils.isValidRange(this.jyunjyo, 1, 99)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンルID");
        this.msg = this.msg.replace('{1}', "2桁");
        this.$emit('on-message', this.msg);
        return;
      }

      // ⑥ ジャンル名が30桁以内であること。
      if (!commonUtils.isValidMaxLength(this.jyunjyoName, 30)) {
        this.msg = msgList['MSG005'].replace('{0}', "ジャンル名");
        this.msg = this.msg.replace('{1}', "30文字");
        this.$emit('on-message', this.msg);
        return;
      }

      // データオブジェクトを作成
      const postData = {
        talentId: this.talentId !== undefined ? this.talentId : '00000000',
        talentName: this.talentName,
        genreId: this.jyunjyo,
        deleteFlg: '0',
        torokuDay: "",
        koushinDay: ""
      };

      // タレント登録・更新BFF（登録・更新モード共通）
      // POSTリクエストを行う
      this.url = TALENT_TOROKU_KOSHIN_URL;
      axios.post(this.url, postData).then(response => {
          console.log("成功時の戻り値:" + JSON.stringify(response.data));
          this.$router.push({ name: 'main', })
        })
        .catch(error => {
          // エラー時の処理
          console.log("失敗パラメータ:" + JSON.stringify(postData));
          alert("登録失敗しました！", error);
        });
    },
    // タレント参照ボタン
    btnTalentRefDialogOpen() {
      // ダイアログができたら作成
      this.talentRefDialogComponent = true;
    },
    // タレント参照ボタン
    btnTalentRefDialogClose() {
      // ダイアログができたら作成
      this.talentRefDialogComponent = false;
    },
    // タレントIDの参照時の戻り
    handleSelectTalent(selectedData) {
      this.$emit('on-message', "");
      this.talentId = selectedData.talentId;
      this.talentName = selectedData.talentName;
      this.jyunjyo = selectedData.genreId;
    },
    // 初期化
    init(){
      this.msg = ''
      this.talentId = undefined;
      this.talentName = null;
      this.jyunjyo = null;
      this.jyunjyoName = null;
      this.channelId = null;
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
</style>