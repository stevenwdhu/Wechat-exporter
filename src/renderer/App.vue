<template>
  <el-container>
    <SideBar />
    <MainArea />
  </el-container>
</template>

<script setup>
  import { computed, provide, ref } from "vue";

  provide("bus", require("mitt")());
  provide(
    "currentTab",
    ref(parseInt(localStorage.getItem("tab")) ? "chat" : "export")
  );
</script>

<style>
  html {
    height: 100%;
  }

  body {
    font-family: "Hiragino Sans Hybrid", Helvetica, "Noto Sans CJK TC",
      "Noto Sans CJK SC", "Microsoft YaHei", Arial, sans-serif;
    min-width: 600px;
    width: 100%;
    /*max-width: 1600px;*/
    height: 100%;
    margin: 0 auto;
    font-size: 14px;
    color: #333;
    background-attachment: fixed;
  }

  #app {
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    color: #2c3e50;
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  .text-nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
