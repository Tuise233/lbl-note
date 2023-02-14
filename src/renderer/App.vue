<template>
  <div id="app">
    <MainPage />
  </div>
</template>

<script>
  import MainPage from "@/components/MainPage.vue";

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
  width: 350px;
  height: 450px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

::-webkit-scrollbar{
  display: none;
}
</style>
