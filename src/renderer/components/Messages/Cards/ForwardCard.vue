<template>
  <span class="arrow"></span>
  <div class="card">
    <h4 ref="cardTitle">
      {{ appmsg.title }}
    </h4>
    <div class="description">
      <span>{{ appmsg.des }}...</span>
    </div>
    <div class="bottom">Chat History</div>
  </div>
</template>

<script setup>
  import { inject, nextTick, onMounted, ref } from "vue";

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo },
  } = defineProps(["props"]);
</script>

<style lang="less" scoped>
  .arrow {
    filter: brightness(100);
  }

  .description span {
    height: 60px !important;
    white-space: pre-wrap;
    margin-right: 12px;
    font-size: 10px !important;
  }
</style>
