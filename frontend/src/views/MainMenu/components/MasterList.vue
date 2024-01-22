<template>
    <div style='text-align:center;font-size:12px;'><router-link :to="{ name: 'ProgramTorokuKoshinTop' }">番組登録</router-link></div>
    <div style='text-align:center;font-size:12px;'>
        <router-link
            :to="{ name: '' }">タレント登録</router-link></div>
    <div style='text-align:center;font-size:12px;'>
        <router-link
            :to="{ name: '' }">年月週管理登録</router-link></div>
    <div style='text-align:center;font-size:12px;'>
        <router-link
            :to="{ name: '' }">オンエア管理登録</router-link></div>
</template>
<script>
export default {
    name: 'MasterList',
    props: {
    },
    data() {
        return {
        }
    },
}
</script>
<style scoped></style>
