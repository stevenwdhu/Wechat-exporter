<template>
  <Export v-show="currentTab === 'export'" />
  <ChatList v-show="currentTab === 'chat'" />
  <ChatContent v-show="currentTab === 'chat'" />
  <Settings v-if="currentTab === 'settings'" />
</template>

<script setup>
  import { inject, provide, ref } from "vue";

  const { join, relative, resolve } = require("path");

  const bus = inject("bus");
  const currentTab = inject("currentTab");

  const rootPaths = inject("rootPaths");
  const chatsPath = ref(localStorage.getItem("chatsPath") || rootPaths.app);
  provide("chatsPath", chatsPath);

  bus.on("changePath", path => {
    chatsPath.value = null
    chatsPath.value = path;
    localStorage.setItem("chatsPath", path);
    bus.emit("chooseChat", null);
  });
</script>

<style scoped></style>
