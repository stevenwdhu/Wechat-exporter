<template>
  <div class="modal">
    <div class="zoom-in" v-if="msg.Type === 3">
      <img class="back-img" :src="getThumb(msg)" v-show="expired" />
      <img class="front-img" :class="expired" :src="src" />
    </div>
    <div class="zoom-in" v-else-if="msg.Type === 43">
      <video controls autoplay :src="src" @click.stop v-if="!expired"></video>
      <template v-else>
        <img class="back-img" :src="getThumb(msg)" />
        <img class="front-img" :class="expired" :src="src" />
      </template>
    </div>
  </div>
</template>

<script setup>
  const fs = require("fs");
  const { join } = require("path");
  const { msg, getThumb, getContent, chatChosen, wechatImg } = defineProps([
    "msg",
    "getThumb",
    "getContent",
    "chatChosen",
    "wechatImg",
  ]);

  let src;
  let expired;

  if (fs.existsSync(getContent(msg, false))) {
    src = getContent(msg);
  } else {
    src = msg.Type === 43 ? wechatImg.vidExpired : wechatImg.picExpired;
    expired = "expired";
  }
</script>

<style lang="less" scoped>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .zoom-in {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: auto;

    * {
      position: absolute;
      flex: none;
      justify-self: center;
    }

    img {
      cursor: -webkit-zoom-out;
    }

    .front-img,
    video {
      z-index: 1;
      min-width: 35%;
      min-height: 35%;
      max-width: 90%;
      max-height: 90%;
    }

    .front-img.expired {
      width: 20%;
      min-width: auto;
      min-height: auto;
    }

    .back-img {
      min-width: 40%;
    }
  }
</style>
