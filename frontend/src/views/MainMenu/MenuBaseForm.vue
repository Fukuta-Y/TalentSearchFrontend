<template>
  <table align="center" border="1" style="border-collapse: collapse;">
      <tr>
        <td> <GyomuList /></td>
        <td> <MasterList /></td>
      </tr>
  </table>
</template>
<script>
import GyomuList from './components/GyomuList.vue'
import MasterList from './components/MasterList.vue'

export default {
  name: 'MenuBaseForm',
  props: {
  },
  components: {
    MasterList,
    GyomuList,
  },
  data() {
    return {
    }
  },
methods: {
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
