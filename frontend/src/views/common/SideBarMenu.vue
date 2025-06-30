<template>
    <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <ul v-show="!isSidebarCollapsed">
            <router-link v-if="!isSidebarCollapsed" :to="{ name: 'main' }" class="top-link">
                TOP
            </router-link>
            <br/>
            <li v-for="item in sidebarLinks" :key="item.id">
                <span v-if="item.children"  v-on:click="toggleSubmenu(item.id)">
                    <span class="menu-text">{{ item.text }}</span>
                    <span :class="{ 'expanded': isSubmenuExpanded(item.id) }">&#9660;</span>
                </span>
                <router-link v-else :to="{ name: item.routeName }"><span class="menu-text">{{ item.text }}</span></router-link>

                <ul v-if="item.children && isSubmenuExpanded(item.id)">
                    <li v-for="child in item.children" :key="child.id">
                        <router-link :to="{ name: child.routeName }">{{ child.text }}</router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        isSidebarCollapsed: Boolean,
        sidebarLinks: Array,
        expandedSubmenus: Array,
    },
    methods: {
        toggleSubmenu(itemId) {
            this.$emit('toggleSubmenu', itemId);
        },
        isSubmenuExpanded(itemId) {
            return this.expandedSubmenus.includes(itemId);
        },
    },
};
</script>

<style scoped>
/* router-link要素にもスタイルが正しく適用されるように調整 */
.sidebar a,
.menu-text {
    font-size: 15px;
    display: block; /* テキストをブロック要素として表示 */
}

/* router-link要素がリンクスタイルを継承するように */
.sidebar a {
    color: #fff; /* リンクのテキスト色を白に */
    text-decoration: none; /* 下線をなくす */
    padding: 8px 0; /* クリックしやすいようにパディングを追加 */
}

.sidebar ul {
    list-style-type: none; /* デフォルトのバレットポイントを削除 */
    padding-left: 0; /* デフォルトのパディングを削除 */
}

.sidebar li {
    margin-bottom: 15px; /* 項目間のマージンを増やす */
}

.expanded {
    transform: rotate(180deg); /* 開いたサブメニューの矢印を反転させる */
    transition: transform 0.3s ease; /* スムーズな回転アニメーション */
}

/* 矢印を右に配置するためのスタイルを追加 */
.sidebar span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
}
</style>
