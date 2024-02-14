<template>
  <span class="arrow"></span>
  <div class="message-audio" @click="toggleAudioPlay(this)">
    <audio
      ref="audio"
      :src="getContent(msg)"
      @ended="audioPaused = true"
    ></audio>
    <span class="voice-time" :style="getAudioWidth(audioDuration)"
      >{{ audioDuration }}''</span
    >
    <img
      class="voice-img"
      :src="audioImg"
      :style="`float: ${getLR(msg)}; margin-${getLR(msg, true)}: 7px;`"
      @click="getAudioWidth(msg)"
    />
  </div>
</template>

<script setup>
  import { ref, watch, inject } from "vue";

  const rootPaths = inject("rootPaths");
  const { toJson } = require(rootPaths.vue + "/../main/helper/tools");

  const {
    props: { msg, getContent, getLR },
  } = defineProps(["props"]);
  const audioDuration = Math.round(
    toJson(msg.Message).msg.voicemsg.voicelength / 1000
  );
  const audioPaused = ref(true);
  const audioImg = ref(`/img/wechat/voice_${getLR(msg)}.png`);

  function getAudioWidth(duration) {
    return `margin-${getLR(msg, true)}: ${duration * 5}px;`;
  }

  function toggleAudioPlay($this) {
    const audio = $this.$refs.audio;
    if (audio.paused) {
      audioPaused.value = false;
      audio.play();
    } else {
      audioPaused.value = true;
      audio.pause();
      audio.currentTime = 0;
    }
  }

  watch(audioPaused, newVal => {
    if (newVal) {
      audioImg.value = `/img/wechat/voice_${getLR(msg)}.png`;
    } else {
      audioImg.value = `/img/wechat/voice_${getLR(msg)}_click.gif`;
    }
  });
</script>

<style scoped>
  .message-audio {
    display: inline-block;
    max-width: 420px;
    padding: 9px 10px;
    border-radius: 6px;
    line-height: 1.2;
    cursor: pointer;
  }

  .voice-img {
    max-width: 240px;
    height: 16px;
    vertical-align: middle;
    position: relative;
    top: 1px;
  }

  .voice-time {
    display: inline-block;
    line-height: 20px;
    vertical-align: middle;
  }
</style>