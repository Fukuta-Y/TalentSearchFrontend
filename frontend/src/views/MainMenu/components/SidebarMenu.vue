<template>
    <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <ul v-show="!isSidebarCollapsed">
            <li v-for="item in sidebarLinks" :key="item.id">
                <span v-if="item.children" @click="toggleSubmenu(item.id)">
                    {{ item.text }}
                    <span :class="{ 'expanded': isSubmenuExpanded(item.id) }">&#9660;</span>
                </span>
                <a v-else :href="item.url">{{ item.text }}</a>

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
</style>
