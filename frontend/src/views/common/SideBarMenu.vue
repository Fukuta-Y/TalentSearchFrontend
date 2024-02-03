<template>
    <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <ul v-show="!isSidebarCollapsed">
            <!-- TOP link when the sidebar is collapsed -->
            <router-link v-if="!isSidebarCollapsed" :to="{ name: 'main' }" class="top-link">
                TOP
            </router-link>
            <br/>
            <li v-for="item in sidebarLinks" :key="item.id">
                <span v-if="item.children" @click="toggleSubmenu(item.id)">
                    <span class="menu-text">{{ item.text }}</span>
                    <span :class="{ 'expanded': isSubmenuExpanded(item.id) }">&#9660;</span>
                </span>
                <a v-else :href="item.url"><span class="menu-text">{{ item.text }}</span></a>

                <ul v-if="item.children && isSubmenuExpanded(item.id)">
                    <li v-for="child in item.children" :key="child.id">
                        <a :href="child.url">{{ child.text }}</a>
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
.sidebar a,
.menu-text {
    font-size: 15px;
    /* 適切なサイズに調整 */
    display: block;
    /* テキストをブロック要素として表示 */
}

.sidebar ul {
    list-style-type: none;
    /* デフォルトのバレットポイントを削除 */
    padding-left: 0;
    /* デフォルトのパディングを削除 */
}

.sidebar li {
    margin-bottom: 15px;
    /* マージンを増やして項目を離す */
}

.expanded {
    transform: rotate(180deg);
    /* 開いたサブメニューの矢印を反転させる */
}</style>
