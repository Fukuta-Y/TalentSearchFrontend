<template>
    <div>
        <div class="sidebar-container">
            <div :style="{ width: isSidebarCollapsed ? '60px' : '200px' }" class="sidebar">
                <router-link v-if="isSidebarCollapsed" :to="{ name: 'main' }" class="top-link">
                    TOP
                </router-link>
                <HamburgerMenu :isSidebarCollapsed="isSidebarCollapsed" :toggleSidebar="toggleSidebar" />
                <SidebarMenu :isSidebarCollapsed="isSidebarCollapsed" :sidebarLinks="sidebarLinks"
                    :expandedSubmenus="expandedSubmenus" @toggleSubmenu="toggleSubmenu" />
            </div>
        </div>
    </div>
</template>
<script>
import HamburgerMenu from './HamburgerMenu.vue';
import SidebarMenu from './SideBarMenu.vue';
// constList からの import は、もはや直接 router-link に渡さないので、必要なくなる可能性がありますが、
// 他の場所で使われている場合は残してください。今回は一旦残します。
import { WEEK_TALENT_SHUTSUEN, PROGRAM_TOROKU_KOSHIN, TALENT_TOROKUKOSHIN, NETSUKI_SHU_KANRI_TOROKU_KOSHIN, ON_AIR_KANRI_TOROKU_KOSHIN } from '../../router/constList'
export default {
    components: {
        HamburgerMenu,
        SidebarMenu,
    },
    data() {
        return {
            isSidebarCollapsed: true, // サイドメニューがデフォルトで閉じている
            expandedSubmenus: [],
            sidebarLinks: [
                {
                    id: 1,
                    text: '業務',
                    children: [
                        // router/index.js で定義されている name を設定
                        { id: 2, text: '週間タレント出演検索', url: WEEK_TALENT_SHUTSUEN, routeName: 'WeekTalentShutsuen' },
                    ]
                },
                {
                    id: 10,
                    text: 'マスタ',
                    children: [
                        // router/index.js で定義されている name を設定
                        { id: 11, text: '番組登録', url: PROGRAM_TOROKU_KOSHIN, routeName: 'ProgramTorokuKoshinTop' },
                        { id: 12, text: 'タレント登録', url: TALENT_TOROKUKOSHIN, routeName: 'TalentTorokuKoshinTop' },
                        { id: 13, text: '年月週管理登録', url: NETSUKI_SHU_KANRI_TOROKU_KOSHIN, routeName: 'NetsukiShuKanriTorokuKoshin' },
                        { id: 14, text: 'オンエア管理登録', url: ON_AIR_KANRI_TOROKU_KOSHIN, routeName: 'OnAirKanriTorokuKoshin' },
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
/* スタイルは変更なし */
#app {
    display: flex;
    flex-direction: column;
    /* コンテンツを縦に配置するための指定 */
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
    background-color: #696969;
    color: #020000e8;
}

.bar,
.plus {
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
    margin: 5px;
    /* 低い値に変更 */
    background-color: #CCFF99;
}

/* ボックスのスタイル */
.gyoumuMenu,
.masterMenu {
    border: 1px solid #333;
    padding: 10px;
    margin: 20px;
    min-height: 90%;
    /* 画面の下の方まで伸ばす */
    box-sizing: border-box;
}

.sidebar-link {
    margin-bottom: 10px;
    /* 適切なマージンを指定 */
}
.sidebar-container {
  display: flex;
  align-items: center;
}

.top-link {
  text-align: center;
  font-size: 12px;
  padding: 10px;
  background-color: #696969;
  color: #fff;
  cursor: pointer;
  flex-grow: 1; /* Expand the background around TOP link */
}
</style>