<template>
  <SearchResult 
    v-bind:name-joken="name"
    v-bind:seibetsu-joken="seibetsu"
    v-bind:address-joken="address"
   />    
</template>

<script>
import SearchResult from './components/SearchResult.vue'
export default {
  name: 'SearchListBaseForm',
  props: {
    name: {
      type: String,
    },
    seibetsu: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  components: {
    SearchResult,
  },
  data() {
    return {
    }
  },
  created: function () {
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
