<template>
    <div style='text-align:center;font-size:15px;'><router-link :to="{ name: 'ProgramTorokuKoshinTop' }">番組登録</router-link></div><br/>
    <div style='text-align:center;font-size:15px;'><router-link :to="{ name: 'TalentTorokuKoshinTop' }">タレント登録</router-link></div><br/>
    <div style='text-align:center;font-size:15px;'><router-link :to="{ name: 'NetsukiShuKanriTorokuKoshin' }">年月週管理登録</router-link></div><br/>
    <div style='text-align:center;font-size:15px;'><router-link :to="{ name: 'OnAirKanriTorokuKoshin' }">オンエア管理登録</router-link></div><br/>
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
