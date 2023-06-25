<template>
  <div>
    <label>{{ this.title }}</label>
  </div>
</template>

<script>
export default {
  name: 'HosokuSetsumei',
  props: {
  },
  data() {
    return {
      title: '※次画面へ表示させる条件を上記へ入力してください。'
    }
  },
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
