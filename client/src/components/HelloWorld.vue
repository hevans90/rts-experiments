<template>
  <div class="nav">
    <router-link to="/game">Play {{ msg }}</router-link>
    <router-link to="/isometric">What the hell is this?</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nav {
  display: flex;
  flex-direction: column;
}

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
  font-size: 50px;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
