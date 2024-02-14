<template>
  <span class="arrow"></span>
  <span class="message-text">
    {{ msg.Message }}
  </span>
</template>

<script setup>
  const { msg } = defineProps(["msg"]);
</script>

<style scoped>
  .message-text {
    display: inline-block;
    max-width: 420px;
    word-wrap: break-word;
    word-break: break-all;
    padding: 10px;
    border-radius: 6px;
    line-height: 1.5;
  }
</style>
