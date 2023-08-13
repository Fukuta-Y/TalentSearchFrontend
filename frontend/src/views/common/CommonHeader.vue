<template>
  <div style='text-align:center;'><router-link :to="{ name: 'main' }">TOP</router-link></div>
</template>

<script>
export default {
  name: 'CommonHeader',
  props: {
  },
  data() {
    return {
      title: ''
    }
  },
}
</script>

<style scoped>
</style>
