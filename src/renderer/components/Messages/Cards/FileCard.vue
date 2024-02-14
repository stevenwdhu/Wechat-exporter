<template>
  <span class="arrow"></span>
  <a class="card file-card" target="_blank" :href="cardFile">
    <div class="title">
      <h4 ref="cardTitle">
        {{ title }}
      </h4>
      <img class="icon" :src="icon()" />
    </div>
    <div class="description">
      <span>{{ size }}</span>
    </div>
  </a>
</template>

<script setup>
  import { inject, nextTick, onMounted, ref } from "vue";

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo, cardFile },
  } = defineProps(["props"]);
  const cardTitle = ref();

  const size = require("filesize")(
    Array.isArray(appmsg.appattach.totallen)
      ? appmsg.appattach.totallen[0]
      : appmsg.appattach.totallen
  ).toUpperCase();

  const icon = () => {
    const table = {
      doc: ["doc", "docx"],
      xls: ["xls", "xlsx"],
      ppt: ["ppt", "pptx"],
      pages: ["pages"],
      numbers: ["numbers"],
      keynote: ["key"],
      pdf: ["pdf"],
      zip: ["zip", "rar", "7z"],
      txt: ["txt", "css", "csv", "htm", "html", "js", "json"],
      music: ["aac", "mp3", "wav", "weba"],
      movie: ["avi", "mp4", "mpg", "mpeg", "ts", "webm", "3gp", "mkv", "rmvb"],
    };
    for (const item of Object.entries(table)) {
      if (item[1].includes(appmsg.appattach.fileext)) {
        return `/img/wechat/files/${item[0]}.png`;
      }
    }
    return "/img/wechat/files/unknown.png";
  };

  const title = ref(appmsg.title);
  let tmpTitle = appmsg.title;

  async function ellipsizeTitle() {
    if (cardTitle.value.offsetHeight <= 45) return;
    title.value =
      tmpTitle.slice(0, tmpTitle.length / 2) +
      "..." +
      tmpTitle.slice(tmpTitle.length / 2 + 1);
    tmpTitle =
      tmpTitle.slice(0, tmpTitle.length / 2) +
      tmpTitle.slice(tmpTitle.length / 2 + 1);
    await nextTick();
    await ellipsizeTitle();
  }

  onMounted(async () => {
    await ellipsizeTitle();
  });
</script>

<style lang="less" scoped>
  .arrow {
    filter: brightness(100);
  }

  .file-card {
    width: 220px;

    .title {
      display: flex;
      align-items: start;

      h4 {
        flex: 1;
        max-width: 170px;
      }

      img {
        margin-left: 5px;
        width: 50px;
        object-fit: contain;
      }
    }

    .description span {
      height: 15px;
    }
  }
</style>