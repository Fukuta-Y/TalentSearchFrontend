<template>
  <div id="app" class="fixed-viewport-container">
    
    <div class="fixed-layout-inner">
      <SideBar />

      <div class="main-content-area">
        <ErrorMessage v-if="message" v-bind:prop-message="message" />

        <div class="boxed-title-wrapper">
          <div class="boxed-title">
            <p>メインメニュー</p>
          </div>
        </div>

        <div class="menu-columns-container">
          <div class="menu-column sidebar-link">
            <div class="boxed">
              <p>業務</p>
            </div>
            <div class="gyoumuMenu">
              <GyomuList />
            </div>
          </div>

          <div class="menu-column sidebar-link">
            <div class="boxed">
              <p>マスタ</p>
            </div>
            <div class="masterMenu">
              <MasterList />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GyomuList from './components/GyomuList.vue';
import MasterList from './components/MasterList.vue';
import SideBar from '../common/SideBar.vue';
// ErrorMessageのインポートが必要な場合は追加してください
// import ErrorMessage from '../common/ErrorMessage.vue';

export default {
  components: {
    MasterList,
    GyomuList,
    SideBar,
    // ErrorMessage,
  },
  data() {
    return {
      message: '',
      isSidebarCollapsed: true,
      expandedSubmenus: [],
    };
  },
  methods: {
    receiveMessage(value) {
      this.message = value;
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleSubmenu(itemId) {
      if (this.expandedSubmenus.includes(itemId)) {
        this.expandedSubmenus = this.expandedSubmenus.filter(id => id !== itemId);
      } else {
        this.expandedSubmenus.push(itemId);
      }
    },
  },
};
</script>

<style scoped>
/* --- 固定レイアウトのコア設定 --- */

.fixed-viewport-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-x: auto; /* 横スクロールを許可 */
  overflow-y: auto;
  background-color: white;
}

.fixed-layout-inner {
  display: flex;
  flex: 1;
  /* PCでは広々と(100%)、スマホでも1200pxを死守 */
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;
}

.main-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-width: 0; /* flex内の縮み防止 */
}

/* --- コンテンツのスタイル調整 --- */

.boxed-title-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.boxed-title {
  width: 95%;
  text-align: center;
  border: 1px solid #333;
  padding: 5px;
  margin: 5px 0 20px 0;
  background-color: #CCFF99;
  font-weight: bold;
}

.menu-columns-container {
  display: flex;
  justify-content: space-between;
  flex: 1; /* 下まで伸ばす */
}

.menu-column {
  width: 48%;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.gyoumuMenu, .masterMenu {
  border: 1px solid #333;
  padding: 10px;
  margin: 0 20px 20px 20px;
  flex: 1; /* コンテンツエリアを下に伸ばす */
  box-sizing: border-box;
  background-color: #fff;
}

.boxed {
  border: 1px solid #333;
  padding: 3px;
  margin: 20px;
  border-radius: 8px;
  background-color: #f0f8ff;
  text-align: center;
}

/* --- サイドバー関連の既存スタイル（維持） --- */
#app {
  font-family: 'Arial', sans-serif;
}
/* その他、既存のstyleはそのまま適用されます */
</style>