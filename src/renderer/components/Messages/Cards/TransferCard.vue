<template>
  <div class="transfer-box completed">
    <span class="arrow"></span>
    <div>
      <div class="transfer">
        <div class="transfer-main">
          <div class="transfer-icon-circle">
            <!--<sort class="transfer-icon pending" />-->
            <check class="transfer-icon completed" />
          </div>
          <h4 class="transfer-title">
            {{ appmsg.wcpayinfo.feedesc }}
          </h4>
          <p class="transfer-des">Accepted</p>
        </div>
      </div>
      <div class="bottom">
        {{ appmsg.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject } from "vue";
  import { Sort, Check } from "@element-plus/icons";

  const wechatImg = inject("wechatImg");
  const {
    props: { appmsg, appinfo, LR },
  } = defineProps(["props"]);

  const title =
    LR === "right"
      ? appmsg.wcpayinfo.sendertitle
      : appmsg.wcpayinfo.receivertitle;
  const des =
    LR === "right" ? appmsg.wcpayinfo.senderdes : appmsg.wcpayinfo.receiverdes;
  const bgColor = "#FDE0C1";
</script>

<style scoped>
  .transfer-box {
    display: flex;
  }

  .right .transfer-box {
    flex-direction: row-reverse;
  }

  .left .arrow {
    border-right-color: v-bind(bgColor) !important;
  }

  .right .arrow {
    border-left-color: v-bind(bgColor) !important;
  }

  .transfer {
    display: flex;
    flex-direction: column;

    width: 200px;
    /*height: 60px;*/
    padding: 12px 12px 10px 12px;
    border-radius: 5px 5px 0 0;
    background-color: v-bind(bgColor);
    color: white;
  }

  .transfer-main {
    height: 40px;
    filter: opacity(0.9);
  }

  .transfer-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: fit-content;
    margin: 2px 0 0 0;
    font-size: 15px;
    line-height: 1.2;
  }

  .transfer-des {
    display: inline;
    font-size: 12px;
    margin-left: 4px;
  }

  .transfer-icon-circle {
    margin: 0 10px 0 5px;
    position: relative;
    /*left: 0;*/
    float: left;
    border: 3px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }

  .transfer-icon {
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }

  .transfer-icon.pending {
    transform: translate(-50%, -50%) rotate(90deg);
    height: 20px;
  }

  .transfer-icon.completed {
    height: 22px;
  }

  .transfer-icon :deep(path) {
    stroke: white;
    stroke-width: 50;
  }

  .bottom {
    border-radius: 0 0 5px 5px;
    padding: 5px 12px;
    color: rgba(255, 255, 255, 0.7);
    background-color: v-bind(bgColor);
    border: none;
  }

  .bottom::before {
    content: "";
    display: block;
    position: relative;
    top: -5px;
    height: 0;
    border-top: 1px rgba(255, 255, 255, 0.1) solid;
  }

  /*.card-bottom.right {*/
  /*  color: #868686;*/
  /*  background-color: white;*/
  /*  !*background-color: #f99c3b;*!*/
  /*}*/
</style>
