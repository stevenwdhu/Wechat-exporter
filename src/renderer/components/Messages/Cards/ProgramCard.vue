<template>
  <span class="arrow"></span>
  <div class="card">
    <div class="logo">
      <img :src="icon" />
      <span>{{ appmsg.sourcedisplayname }}</span>
    </div>
    <h4 ref="cardTitle">
      {{ appmsg.title }}
    </h4>
    <div class="page">
      <img :src="page" />
    </div>
    <div class="bottom">
      <img :src="wechatImg.appLogo" />
      <span>Mini Program</span>
    </div>
  </div>
</template>

<script setup>
  import { inject, nextTick, onMounted, ref } from "vue";

  const { ipcRenderer } = require("electron");
  const { join } = require("path");
  const fs = require("fs");

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo, chatInfo, msg },
  } = defineProps(["props"]);

  const icon = `file://${chatInfo.path}/ProgramImg/${msg.MesLocalID}/icon.pic`;

  const page = fs.existsSync(
    `${chatInfo.path}/ProgramImg/${msg.MesLocalID}/page.pic`
  )
    ? `file://${chatInfo.path}/ProgramImg/${msg.MesLocalID}/page.pic`
    : wechatImg.appPage;

  if (!fs.existsSync(`file://${chatInfo.path}/ProgramImg/${msg.MesLocalID}`)) {
    ipcRenderer.invoke(
      "getProgramImg",
      chatInfo.path,
      msg.MesLocalID.toString(),
      appmsg
    );
  }
</script>

<style lang="less" scoped>
  .arrow {
    filter: brightness(100);
  }

  .page {
    margin: 5px 0;
    img {
      width: 240px;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    img {
      height: 20px;
    }

    span {
      position: relative;
      top: 1px;
      font-size: 11px;
      color: #bababa;
      padding: 0 5px;
      line-height: 1;
    }
  }

  .bottom {
    display: flex;
    align-items: center;

    img {
      height: 12px;
    }

    span {
      position: relative;
      top: 1px;
      font-size: 11px;
      color: #bababa;
      padding: 0 5px;
      line-height: 1;
    }
  }
</style>