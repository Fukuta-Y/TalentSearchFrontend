<template>
  <br>
  <center>
    <table border="1">
      <colgroup>
        <col style="background-color: #FFFFEE" />
        <col span="2" />
      </colgroup>
      <tr>
        <font color="red">{{ propMessage }}</font>
      </tr>
    </table>
  </center>
  <br>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    propMessage: {
      type: String,
    },
  },
  data() {
    return {
      title: 'エラーメッセージ'
    }
  },
}
</script>

<style scoped>
</style>
