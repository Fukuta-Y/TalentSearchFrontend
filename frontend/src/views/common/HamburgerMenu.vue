<template>
    <div class="burger-menu" @click="toggleSidebar">
        <div :class="{ 'bar': isSidebarCollapsed, 'plus': !isSidebarCollapsed }"></div>
        <div :class="{ 'bar': isSidebarCollapsed, 'plus': !isSidebarCollapsed }"></div>
        <div :class="{ 'bar': isSidebarCollapsed, 'plus': !isSidebarCollapsed }"></div>
    </div>
</template>

<script>
export default {
    props: {
        isSidebarCollapsed: Boolean,
        toggleSidebar: Function,
    },
};
</script>

<style scoped>
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
</style>
