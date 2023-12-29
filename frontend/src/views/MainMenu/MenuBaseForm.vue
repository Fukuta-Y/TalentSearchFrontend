<template>
  <div id="app">
      <table>
          <tr colspan="3">
            <!-- ハンバーガーメニュー -->
            <div class="burger-menu" @click="toggleSidebar">
              <div :class="{ 'bar': !isSidebarCollapsed, 'plus': isSidebarCollapsed }"></div>
              <div :class="{ 'bar': !isSidebarCollapsed, 'plus': isSidebarCollapsed }"></div>
              <div :class="{ 'bar': !isSidebarCollapsed, 'plus': isSidebarCollapsed }"></div>
            </div>
          </tr>
        <tr colspan="3">
          <td>
           <!-- サイドバー -->
          <SidebarMenu :isSidebarCollapsed="isSidebarCollapsed" :sidebarLinks="sidebarLinks" :expandedSubmenus="expandedSubmenus"
            @toggleSubmenu="toggleSubmenu" />
          </td>
          <td>
            <table align="center" border="1" style="border-collapse: collapse;">
              <tr>
                <td>
                  <GyomuList />
                </td>
                <td>
                  <MasterList />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
import GyomuList from './components/GyomuList.vue';
import MasterList from './components/MasterList.vue';
import SidebarMenu from './components/SidebarMenu.vue';

export default {
  components: {
    MasterList,
    GyomuList,
    SidebarMenu,
  },
  data() {
    return {
      isSidebarCollapsed: false,
      expandedSubmenus: [],
      sidebarLinks: [
        { id: 1, text: 'Dashboard', url: '#' },
        {
          id: 2,
          text: 'Profile',
          children: [
            { id: 3, text: 'Overview', url: '#' },
            { id: 4, text: 'Settings', url: '#' }
          ]
        },
        {
          id: 5,
          text: 'Projects',
          children: [
            { id: 6, text: 'Project A', url: '#' },
            { id: 7, text: 'Project B', url: '#' }
          ]
        }
      ],
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
    background-color: #333;
    color: #fff;
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
    background-color: #333;
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

  .main-container {
    display: flex;
    width: 100%;
  }

  .main-content {
    flex: 1;
    padding: 20px;
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

  .expanded {
    transform: rotate(-90deg);
    transition: transform 0.3s ease;
  }
</style>