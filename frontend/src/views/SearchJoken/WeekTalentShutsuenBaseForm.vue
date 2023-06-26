<template>
  <ErrorMessage
  />
  <SearchJoken 
    @on-search-joken="onSearchJoken"
  />
</template>

<script>
import ErrorMessage from './components/ErrorMessage.vue'
import SearchJoken from './components/SearchJoken.vue'

export default {
  name: 'WeekTalentShutsuenBaseForm',
  components: {
    ErrorMessage,
    SearchJoken,
  },
  data() {
    return {
      searchJoken: {},
    }
  },
methods: {
    onSearchJoken(data) {
      this.searchJoken = data
      this.$router.push({ name: 'SearchListBaseForm', params: { name: this.searchJoken.name, seibetsu: this.searchJoken.seibetsu, address: this.searchJoken.address, }, })
    }
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
