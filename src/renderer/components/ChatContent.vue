<template>
  <el-container>
    <el-header>{{ chatInfo.displayName }}</el-header>
    <main
      class="chat-container"
      ref="main"
      v-if="chatMsgs"
      @scroll="partialLoad($event.target, chatMsgs, visibleIdx, 50, 10)"
    >
      <div
        class="message-box"
        v-for="msg in chatMsgs.slice(visibleIdx, visibleIdx + 50)"
        :class="getLR(msg)"
        :key="msg.MesLocalID"
        :msgid="msg.MesLocalID"
      >
        <img class="avatar" :src="getAvatar(msg)" alt="" />

        <div class="name-box">
          <span v-if="chatInfo.chatRoom && msg.Des">
            {{ getMemberName(msg) }}&nbsp
          </span>
          <span>{{ parseTime(msg.CreateTime) }}</span>
        </div>

        <div class="content-box">
          <TextMsg v-if="msg.Type === 1" :msg="msg" />

          <ImageMsg
            v-else-if="msg.Type === 3"
            :props="{ msg, wechatImg, getThumb }"
            @click="showModal(msg)"
          />

          <EmoticonMsg
            v-else-if="msg.Type === 47"
            :props="{ msg, wechatImg, getContent }"
          />

          <AudioMsg
            v-else-if="msg.Type === 34"
            :props="{ msg, getContent, getLR }"
          />

          <VideoMsg
            v-else-if="msg.Type === 43"
            :msg="msg"
            :getThumb="getThumb"
            :wechatImg="wechatImg"
            @click="showModal(msg)"
          />

          <CardMsg
            v-else-if="msg.Type === 49"
            :props="{ msg, getLR, chatInfo, wechatImg }"
          />
        </div>
      </div>
      <teleport to="body">
        <Modal
          v-if="modal.show"
          :msg="modal.msg"
          :chatChosen="chatChosen"
          :getThumb="getThumb"
          :getContent="getContent"
          :wechatImg="wechatImg"
          @click="modal.show = false"
        />
      </teleport>
    </main>
  </el-container>
</template>

<script setup>
  import { reactive, ref, provide, inject} from "vue";

  const { join, resolve, relative } = require("path");
  const fs = require("fs-extra");
  const dayjs = require("dayjs");
  const bus = inject("bus");
  const rootPaths = inject("rootPaths");
  const chatsPath = inject("chatsPath");
  const { toJson } = require(rootPaths.vue + "/../main/helper/tools");

  const wechatImg = {
    picExpired: "/img/wechat/pic_expired.png",
    vidExpired: "/img/wechat/vid_expired.png",
    noPic: "/img/wechat/pic_not_found.png",
    noEmo: "/img/wechat/emo_not_found.png",
    noVid: "/img/wechat/vid_not_found.png",
    playBtn: "/img/wechat/playbtn.png",
    redPacket: "/img/wechat/redpacket.png",
    link: "/img/wechat/link.png",
    appLogo: "/img/wechat/app_logo.png",
    appPage: "/img/wechat/app_page.png",
  };
  provide("wechatImg", wechatImg);

  const visibleIdx = ref(0);
  function partialLoad(
    el,
    list,
    startIdx,
    itemLimit,
    loadNum,
    threshold = 0.7
  ) {
    const scrollPercent = el.scrollTop / (el.scrollHeight - el.clientHeight);
    if (scrollPercent > threshold) {
      if (startIdx + itemLimit + loadNum > list.length) {
        startIdx = list.length - itemLimit;
      } else {
        startIdx += loadNum;
      }
    } else if (scrollPercent < 1 - threshold) {
      if (startIdx - loadNum < 0) {
        startIdx = 0;
      } else {
        startIdx -= loadNum;
      }
    }
    visibleIdx.value = startIdx;
  }

  const chatMsgs = ref([]);
  const chatInfo = ref({});
  const modal = reactive({ show: false });

  bus.on("chooseChat", chatChosen => {
    if (chatChosen) {
      const file = fs.readJSONSync(
        join(chatsPath.value, chatChosen.id, "message.json")
      );
      chatMsgs.value = file.message.filter(
        chat =>
          [1, 3, 47, 34, 43].includes(chat.Type) ||
          [1, 3, 5, 6, 19, 33, 36, 2000, 2001].includes(chat.AppType)
      );
      chatInfo.value = file.info;
      chatInfo.value.path = join(chatsPath.value, chatChosen.id);
    } else {
      chatMsgs.value = [];
      chatInfo.value = {};
    }
  });

  function parseTime(timestamp) {
    return dayjs(timestamp * 1000).format("YYYY-MM-DD HH:mm");
  }

  function getLR(msg, reversed) {
    let des = msg.Des;
    if (reversed) des = !des;
    return des ? "left" : "right";
  }

  function getAvatar(msg) {
    const path = msg.Des
      ? chatInfo.value.chatRoom
        ? join(chatInfo.value.path, "Image", msg.Sender) + ".pic" ||
          join(chatInfo.value.path, "Image", msg.Sender) + ".pic_thum"
        : join(chatInfo.value.path, "Image", "0.pic") ||
          join(chatInfo.value.path, "Image", "0.pic_thum")
      : join(chatsPath.value, "avatar.pic");
    return "file://" + path;
  }

  function getThumb(msg) {
    let result;
    switch (msg.Type) {
      case 3:
        result = join(
          chatInfo.value.path,
          "Image",
          `${msg.MesLocalID}.pic_thum`
        );
        if (fs.existsSync(result)) return "file://" + result;
        return wechatImg.noPic;
      case 43:
        result = join(
          chatInfo.value.path,
          "Video",
          `${msg.MesLocalID}.video_thum`
        );
        if (fs.existsSync(result)) return "file://" + result;
        return wechatImg.noVid;
    }
  }

  function getContent(msg, html = true) {
    let result;
    switch (msg.Type) {
      case 3:
      case 47:
        result = join(chatInfo.value.path, "Image", `${msg.MesLocalID}.pic`);
        break;
      case 34:
        result = join(chatInfo.value.path, "Audio", `${msg.MesLocalID}.mp3`);
        break;
      case 43:
        result = join(chatInfo.value.path, "Video", `${msg.MesLocalID}.mp4`);
        break;
    }
    if (html) return "file://" + result;
    return result;
  }

  function getMemberName(msg) {
    const person = chatInfo.value.chatRoom.members.find(
      m => m.id === msg.Sender
    );
    if (!person) debugger;
    return person.displayName || person.alias || person.name;
  }

  function showModal(msg) {
    if ((msg.Type === getThumb(msg)) === wechatImg.noPic) {
      return;
    }
    modal.msg = msg;
    modal.show = true;
  }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #f3f3f3;
    color: var(--el-text-color-primary);
    text-align: left;
    line-height: 60px;
    border-bottom: #e0e0e0 1px solid;
    padding-left: 30px;
    font-size: 15px;
    font-weight: normal;
  }

  .chat-container {
    background-color: #f3f3f3;
    padding: 10px 25px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    flex: 1;
  }

  .message-time {
    margin: 15px auto 20px;
    width: 110px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 4px;
    line-height: 18px;
    font-size: 12px;
    color: #ffffff;
  }

  .message-tip-container {
    max-width: 40%;
    margin: 15px auto 20px;
  }

  .message-tip {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 5px 10px;
    line-height: 18px;
    font-size: 12px;
    color: white;
  }

  .message-box {
    display: block;
    margin: 10px 0;
  }

  /*region avatar*/
  .avatar {
    .left & {
      float: left;
    }

    .right & {
      float: right;
    }

    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-image: url("../public/img/wechat/person.jpg");
    background-size: 100% auto;
  }

  /*endregion*/

  .content-box,
  .name-box {
    display: flex;
    flex: none;

    .right & {
      flex-direction: row-reverse;
    }
  }

  .name-box {
    color: #848484;
    font-size: 70%;
    padding: 0 13px;
  }

  /*region arrow*/
  :deep(.arrow) {
    .message-box & {
      width: 0;
      height: 0;
      border: 6px solid transparent;

      position: relative;
      top: 9px;
    }

    .left & {
      border-right-color: white;
    }

    .right & {
      border-left-color: #a9ea7a;
    }
  }

  /*endregion*/

  /*region msg-background*/
  :deep(.message-text),
  :deep(.message-audio) {
    .left & {
      background-color: white;
    }

    .right & {
      background-color: #a9ea7a;
    }
  }

  /*endregion*/
  :deep(.message-img) {
    margin: 0 12px;
    width: 180px;
    border-radius: 5px;
    cursor: pointer;
    cursor: -webkit-zoom-in;
    cursor: -moz-zoom-in;
    vertical-align: top;
  }
</style>