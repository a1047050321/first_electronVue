<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
var script1 = document.createElement("script");
    script1.setAttribute("src","../../static/player/sewise.player.min.js");
    script1.setAttribute("type","text/javascript");
    document.body.append(script1);
  export default {
    name: 'my-ev',
    data(){
      return {
        name:"1111"
      }
    }

  }
</script>

<style>
  /* CSS */
</style>
