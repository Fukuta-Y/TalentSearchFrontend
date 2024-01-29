<template>
  <div>
    <table align="center">
      <tr>
        <td>タレントID： </td>
         <td>
          <label>{{ gettalentId }}</label>
        </td>
        <button v-on:click="btnTalentRefDialogOpen()">
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
      </tr>
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
            />
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
import TalentRefDialog from '../../TalentRefDialog/TalentRefDialogBaseForm.vue';
export default {
  name: 'talentTorokuKoshin',
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
      talentRefDialogComponent: false,
    };
  },
  mounted() {
    // APIからデータを取得するメソッドを呼び出す
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // 更新時の場合
      if (this.talentId !== undefined) {
        // タレント情報BFF（更新時のみ）※
        const talentInfoUrl = "http://localhost:8081/api/talentInfoBFF/" + this.talentId;
        const talentInfo = await axios.get(talentInfoUrl).then(response => (response.data));
        if (talentInfo.talentId !== null) {
          this.talentName = talentInfo.talentName;
          this.jyunjyo = talentInfo.genreId;
        }
      }

      // 区分マスタBFF（登録・更新モード共通）
      const genreInfoUrl = "http://localhost:8081/api/kbnMasterBFF/2";
      this.genreInfo = await axios.get(genreInfoUrl).then(response => response.data.mKbnGenre);

    },
    // 初期化ボタン
    btnClear() {
      this.init();
      this.$emit('on-message', this.msg);
    },
    // 登録・更新ボタン
    async btnToroku() {
      // 全項目入力済みでない場合は止める
      if ((this.talentName == '' || this.talentName === null) || (this.jyunjyo === '' || this.jyunjyo === null)) {
        this.msg = "全項目入力必須";
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
      const talentToroku = "http://localhost:8081/api/talentTorokuKoshinBFF";

      // POSTリクエストを行う
      axios.post(talentToroku, postData).then(response => {
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
      this.channelId = null;
    },
    // ジャンル名の表示
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