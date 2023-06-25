<template>
  <div>
    <table align="center">
      <tr>
        <td>お名前： </td>
        <td>{{ this.nameJoken }}</td>
      </tr>
      <tr>
        <td>性別：</td>
        <td>{{ seibetsu }}</td>
      </tr>
      <tr>
        <td>ご住所： </td>
        <td>{{ this.addressJoken }}</td>
      </tr>
    </table>
    <br>
  </div>
  <br>
  <button v-on:click="btnReturn()">
    戻る
  </button>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    nameJoken: {
      type: String,
    },  
    seibetsuJoken: {
      type: String,
    },
    addressJoken: {
      type: String,
    },
  },
  data() {
    return {
    }
  },
  created: function () {
  },
  methods: {
    btnReturn() {
      this.$router.push('/')
    }
  },
  computed: {
    seibetsu: function () {
      return this.seibetsuJoken === "1"?'男':"女"
    }
  }
}
</script>
<style scoped>
</style>
