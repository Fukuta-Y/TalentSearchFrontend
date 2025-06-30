<template>
    <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <ul v-show="!isSidebarCollapsed">
            <router-link v-if="!isSidebarCollapsed" :to="{ name: 'main' }" class="top-link">
                TOP
            </router-link>
            <br />
            <li v-for="item in sidebarLinks" :key="item.id">
                <span v-if="item.children" v-on:click="toggleSubmenu(item.id)" class="menu-item-wrapper">
                    <span class="menu-text">{{ item.text }}</span>
                    <span :class="{ 'expanded': isSubmenuExpanded(item.id) }">&#9660;</span>
                </span>
                <router-link v-else :to="{ name: item.routeName }" class="menu-item-wrapper">
                    <span class="menu-text">{{ item.text }}</span>
                </router-link>

                <ul v-if="item.children && isSubmenuExpanded(item.id)">
                    <li v-for="child in item.children" :key="child.id">
                        <router-link :to="{ name: child.routeName }" class="submenu-item">
                            {{ child.text }}
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
// (スクリプト部分は変更なし)
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
/* 基本的なスタイルは維持しつつ、隙間を調整 */

/* 矢印とテキストを含む親要素 (新しいクラス) */
.menu-item-wrapper {
    display: flex;
    /* Flexboxを適用 */
    justify-content: space-between;
    /* テキストと矢印を両端に配置 */
    align-items: center;
    /* 垂直方向中央揃え */
    padding: 10px 15px;
    /* 上下のパディングを増やし、左右にも少しパディングを追加 */
    cursor: pointer;
    background-color: #696969;
    /* 背景色（見やすくするため） */
    color: #fff;
    /* 文字色 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    /* 区切り線を追加 (境界線) */
    margin-bottom: 10px;
    /* 各メニュー項目の下部に隙間 */
    box-sizing: border-box;
    /* パディングを幅に含める */
}

/* サブメニューのリンクスタイル */
.submenu-item {
    display: block;
    /* ブロック要素にして、パディングを適用できるようにする */
    padding: 8px 15px 8px 30px;
    /* パディングを増やし、左にインデント */
    color: #eee;
    text-decoration: none;
    background-color: #555;
    /* サブメニューの背景色を少し暗く */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    /* サブメニューの区切り線 */
    margin-bottom: 5px;
    /* サブメニュー項目間の隙間 */
}


/* リンクの基本スタイル (router-linkにも適用されるように調整) */
.sidebar a {
    text-decoration: none;
    /* 下線をなくす */
    color: #fff;
    /* 文字色 */
}

/* テキスト部分のスタイル */
.menu-text {
    font-size: 15px;
    /* 適切なサイズに調整 */
    /* display: block; は .menu-item-wrapper が flex になったので不要 */
}

/* 矢印の回転アニメーション */
.expanded {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
    /* スムーズな回転 */
}

/* その他の既存スタイル（必要に応じて残す） */
.sidebar ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    /* ul自体の上下マージンをリセット */
}

.sidebar li {
    /* 個々の li の下マージンは .menu-item-wrapper の margin-bottom で調整されるため、
       ここでは大きなマージンは不要になるか、調整が必要です。
       今回は .menu-item-wrapper に margin-bottom を移動しました。 */
    margin-bottom: 0;
    /* ここはゼロにするか、ごく小さな値に */
}


/* Collapsed sidebar adjustments */
.sidebar.collapsed {
    width: 60px;
    overflow: hidden;
}

/* collapsed時のtop-linkも調整 */
.sidebar.collapsed .top-link {
    padding: 10px;
    font-size: 12px;
    text-align: center;
    display: block;
    /* to apply padding and text-align */
    background-color: #696969;
    color: #fff;
    cursor: pointer;
    /* flex-grow: 1; は親がflexboxでないと意味がないので削除 */
}
</style>