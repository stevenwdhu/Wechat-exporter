<template>
  <span class="arrow"></span>
  <a class="card link-card" target="_blank" :href="appmsg.url">
    <h4 ref="cardTitle">
      {{ title }}
    </h4>
    <div class="description">
      <span>{{ appmsg.des }}</span>
      <img :src="cardLinkPic" />
    </div>
    <div class="bottom" v-if="appinfo.appname">
      {{ appinfo.appname }}
    </div>
  </a>
</template>

<script setup>
  import {inject, nextTick, onMounted, ref} from "vue";

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo, cardLinkPic },
  } = defineProps(["props"]);
  const cardTitle = ref();
  const title = ref(appmsg.title);
  let tmpTitle = appmsg.title

  async function ellipsizeTitle() {
    if (cardTitle.value.offsetHeight <= 45) return;
    tmpTitle = tmpTitle.slice(0, -1);
    title.value = tmpTitle + "...";
    await nextTick()
    await ellipsizeTitle();
  }

  onMounted(async () => {
    await ellipsizeTitle();
  });

</script>

<style scoped>
  .arrow {
    filter: brightness(100);
  }
</style>