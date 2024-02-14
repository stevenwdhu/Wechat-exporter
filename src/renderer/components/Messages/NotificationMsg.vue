<template></template>

<script setup>
  import {inject} from "vue";

  const rootPaths = inject("rootPaths");
  const {toJson} = require(rootPaths.vue + "/../main/helper/tools");
  const {
    props: { msg, chatInfo },
  } = defineProps(["props"]);
  console.log(msg.Type,toJson(msg.Message));
</script>

<style scoped></style>