<!--suppress JSIncompatibleTypesComparison -->
<template>
  <LinkCard :props="{ appmsg, appinfo, cardLinkPic }" v-if="type === 'link'" />
  <RedPacketCard
    :props="{ appmsg, appinfo, LR }"
    v-else-if="type === 'red-packet'"
  />
  <TransferCard
    :props="{ appmsg, appinfo, LR }"
    v-else-if="type === 'transfer'"
  />
  <FileCard
    :props="{ appmsg, appinfo, cardFile, msg }"
    v-else-if="type === 'file'"
  />
  <ForwardCard :props="{ appmsg, appinfo }" v-else-if="type === 'forward'" />
  <ProgramCard
    :props="{ appmsg, appinfo, chatInfo, msg }"
    v-else-if="type === 'program'"
  />
</template>

<script setup>
  import { computed, inject } from "vue";

  const { join } = require("path");
  const fs = require("fs-extra");
  const rootPaths = inject("rootPaths");
  const { toJson } = require(rootPaths.vue + "/../main/helper/tools");

  const {
    props: { msg, getLR, chatInfo, wechatImg },
  } = defineProps(["props"]);
  const LR = getLR(msg);
  const {
    msg: { appmsg, appinfo = {} },
  } = toJson(msg.Message);

  const type = computed(() => {
    switch (parseInt(appmsg.type)) {
      case 1:
      case 3:
      case 5:
        return "link";
      case 6:
        return "file";
      case 19:
        return "forward";
      case 33:
      case 36:
        return "program";
      case 2000:
        return "transfer";
      case 2001:
        return "red-packet";
    }
  });

  const cardLinkPic = fs.existsSync(
    join(chatInfo.path, "Files", `${msg.MesLocalID}.pic_thum`)
  )
    ? "file://" + join(chatInfo.path, "Files", `${msg.MesLocalID}.pic_thum`)
    : wechatImg.link;
  const cardFile =
    "file://" +
    join(chatInfo.path, "Files", `${msg.MesLocalID}.${appmsg.fileext}`);
</script>

<style lang="less">
  .card {
    display: inline-flex;
    flex-direction: column;

    width: 240px;
    min-height: 50px;
    padding: 12px 12px 5px 12px;
    border-radius: 5px;

    text-decoration: none;
    color: black;
    background-color: white;
    line-height: 1.5;

    h4 {
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 5px;
      font-weight: 500;
      line-break: loose;
      word-break: break-all;
      hyphens: auto;
    }

    .description {
      margin: 0 0 5px 0;
      display: flex;
      flex: auto;

      span {
        height: 54px;
        font-size: 12px;
        color: #9f9f9f;
        word-break: break-word;
        overflow: hidden;
        flex: auto;
      }

      img {
        margin-left: 10px;
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
    }

    .bottom {
      font-size: 10px;
      color: #999;
      border-top: 1px solid #e4e4e4;
      padding-top: 5px;
      line-height: 1;
    }
  }
</style>