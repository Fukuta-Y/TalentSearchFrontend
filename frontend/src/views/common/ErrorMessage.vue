<template>
  <div>
    <br>
    <center>
      <table style="width: 100%; background-color: #ffe6e6; border-collapse: collapse; border: 1px solid #ff6666;">
        <colgroup>
          <col style="width: 33%;" />
          <col style="width: 33%;" />
          <col style="width: 33%;" />
        </colgroup>
        <tr>
          <td colspan="3" style="text-align: center; color: red;">{{ propMessage }}</td>
        </tr>
      </table>
    </center>
    <br>
  </div>
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

<style scoped></style>
