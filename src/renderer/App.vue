<template>  
  <div id="app" class="primary_color">
    <MainPage />
  </div>
</template>

<script>
  import MainPage from "@/views/MainPage.vue";

  export default {
    name: 'lbl-note',
    components: {
      MainPage
    }
  }
</script>

<style>

@font-face {
  font-family: "Harmony";
  src: url("./assets/Harmony.ttf");
}

*{
  font-family: "Harmony";
  user-select: none;
}

html, body{
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

::-webkit-scrollbar{
  display: none;
}
</style>
