<template>
  <div id="app" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1;">
      <!-- サイドバー -->
      <SideBar />

      <!-- メインメニュータイトルブロックとコンテンツ -->
      <div style="flex: 1; display: flex; flex-direction: column; padding: 20px;">
        <!-- メインメニュータイトルブロック -->
        <div style="width: 95%; text-align: center; margin-bottom: 20px;" class="boxed-title">
          <p>メインメニュー</p>
        </div>

        <!-- 業務とマスタのコンテンツ -->
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 48%; padding: 4px; box-sizing: border-box;" class="sidebar-link">
            <div class="boxed">
              <p>業務</p>
            </div>
            <div class="gyoumuMenu">
              <GyomuList />
            </div>
          </div>
          <div style="width: 48%; padding: 10px; box-sizing: border-box;" class="sidebar-link">
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

export default {
  components: {
    MasterList,
    GyomuList,
    SideBar,
  },
  data() {
    return {
      isSidebarCollapsed: true, // サイドメニューがデフォルトで閉じている
      expandedSubmenus: [],
    };
  },
  methods: {
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
  #app {
    display: flex;
    flex-direction: column; /* コンテンツを縦に配置するための指定 */
  }

  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }

  .burger-menu {
    cursor: pointer;
    padding: 10px;
    background-color: #333;
    color: #fff;
  }
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .burger-menu {
    cursor: pointer;
    padding: 10px;
    background-color:#696969;
    color: #020000e8;
  }

  .bar, .plus {
    height: 3px;
    width: 25px;
    background-color: #fff;
    margin: 5px 0;
    transition: transform 0.3s ease;
  }

  .plus {
    transform: rotate(45deg);
  }

  .sidebar {
    width: 200px;
    background-color: #696969;
    color: #fff;
    padding: 20px;
    height: 100vh;
    overflow-y: auto;
    transition: width 0.3s ease;
  }

  .sidebar.collapsed {
    width: 60px;
    overflow: hidden;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    color: #fff;
  }

  ul ul {
    margin-top: 5px;
  }
  /* ボックスのスタイル */
  .boxed {
    border: 1px solid #333;
    padding: 3px;
    margin: 20px;
    border-radius: 8px;
    background-color: #f0f8ff;
  }
  .boxed-title {
    border: 1px solid #333;
    padding: 5px;
    margin: 5px; /* 低い値に変更 */
    background-color: #CCFF99;
  }
  /* ボックスのスタイル */
  .gyoumuMenu, .masterMenu {
    border: 1px solid #333;
    padding: 10px;
    margin: 20px;
    min-height: 90%; /* 画面の下の方まで伸ばす */
    box-sizing: border-box;
  }
  .sidebar-link {
    margin-bottom: 10px; /* 適切なマージンを指定 */
  }
</style>