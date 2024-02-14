<template>
  <div class="red-packet-box">
    <span class="arrow"></span>
    <div>
      <div class="red-packet">
        <div class="red-packet-main">
          <img class="red-packet-icon" :src="wechatImg.redPacket" />
          <h4 class="red-packet-title" :class="LR">
            {{ title }}
          </h4>
        </div>
      </div>
      <div class="bottom" :class="LR">
        {{ appmsg.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject } from "vue";

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo, LR },
  } = defineProps(["props"]);

  const title =
    LR === "right"
      ? appmsg.wcpayinfo.sendertitle
      : appmsg.wcpayinfo.receivertitle;
</script>

<style scoped>
  .red-packet-box {
    display: flex;
  }

  .right .red-packet-box {
    flex-direction: row-reverse;
  }

  .left .arrow {
    border-right-color: #f99c3b !important;
  }

  .right .arrow {
    border-left-color: #f99c3b !important;
  }

  .red-packet {
    display: flex;
    flex-direction: column;

    width: 200px;
    /*height: 60px;*/
    padding: 12px 12px 10px 12px;
    border-radius: 5px 5px 0 0;

    color: white;
    background-color: #f99c3b;
  }

  .red-packet-main {
    display: flex;
    align-items: center;
    height: 40px;
  }

  .red-packet-title {
    /*display: inline-block;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: fit-content;
    margin: 0;
    /*padding-left: 5px;*/
    line-height: 35px;
  }

  .red-packet-icon {
    height: 35px;
    margin: 0 10px 0 5px;
  }

  .bottom {
    font-size: 10px;
    border-radius: 0 0 5px 5px;
    padding: 5px 12px;
    color: rgba(255, 255, 255, 0.7);
    background-color: #f99c3b;
    border: none;
  }

  .bottom.left::before {
    content: "";
    display: block;
    position: relative;
    top: -5px;
    height: 0;
    border-top: 1px rgba(255, 255, 255, 0.1) solid;
  }

  .bottom.right {
    color: #868686;
    background-color: white;
    /*background-color: #f99c3b;*/
  }
</style>
