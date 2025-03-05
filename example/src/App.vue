<template>
  <div class="container">
    <h1>{{ message }}</h1>
    <button @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'ContentInjector Webpack Plugin Demo',
      count: 0
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
}
button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
