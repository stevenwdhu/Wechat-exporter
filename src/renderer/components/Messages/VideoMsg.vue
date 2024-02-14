<template>
  <div class="message-video-box">
    <img class="message-video" :src="getThumb(msg)" />
    <img class="play-btn" :src="wechatImg.playBtn" alt="" />
  </div>
</template>

<script setup>
  defineProps(["msg", "getThumb", "wechatImg"]);
</script>

<style scoped>
  .message-video-box {
    cursor: pointer;
    position: relative;
  }

  .message-video {
    width: 240px;
    border-radius: 2px;
    /*margin: 0px 10px;*/
  }

  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 25%;
    max-height: 40%;
    filter: opacity(80%);
  }
</style>
