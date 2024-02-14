<template>
  <img class="message-img" :src="getThumb(msg)" :style="style" />
</template>

<script setup>
  import { computed } from "vue";

  const {
    props: { msg, wechatImg, getThumb },
  } = defineProps(["props"]);
  const style = computed(() => {
    if (getThumb(msg) === wechatImg.noPic) {
      return "cursor: default;";
    }
  });
</script>

<style scoped>

</style>
