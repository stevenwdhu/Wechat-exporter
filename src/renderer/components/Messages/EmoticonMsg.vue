<template>
  <img class="message-img emoticon" :src="src" :style="emoStyle"/>
</template>

<script setup>
  import {computed, ref} from "vue";

  const fs = require("fs");
  const emoStyle = ref()

  const {
    props: { msg, wechatImg, getContent },
  } = defineProps(["props"]);

  const src = computed(() => {
    if (fs.existsSync(getContent(msg, false))) {
      return getContent(msg);
    } else {
      emoStyle.value = 'width: 18%;'
      return wechatImg.noEmo;
    }
  });
</script>

<style scoped>
  .message-img.emoticon {
    border-radius: 0;
    cursor: auto;
  }
</style>
