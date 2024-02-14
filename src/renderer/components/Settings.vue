<template>
  <div class="settings-container">
    <div class="chat-path">
      <span>Chat Path</span>
      <el-input size="medium" readonly :model-value="chatsPath" />
      <el-button type="primary" size="medium" @click="changePath"
        >Change
      </el-button>
    </div>
  </div>
</template>

<script setup>
  import { inject } from "vue";

  const { ipcRenderer } = require("electron");

  const chatsPath = inject("chatsPath");
  const bus = inject("bus");

  function changePath() {
    ipcRenderer.invoke("chooseDir").then(path => {
      if (!path) return;
      bus.emit("changePath", path);
    });
  }
</script>

<style lang="less" scoped>
  .settings-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 600px;

    & > * {
      margin: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .el-input {
        position: relative;
        top: 1px;
        margin-right: 20px;
        flex: 1;
      }

      span {
        width: 100px;
        margin-right: 15px;
        font-size: 18px;
        flex: none;
        color: #606266;
        text-align: end;
      }
    }
  }

  .el-button {
    padding: 10px;
    width: 90px;
    flex-shrink: 0;
  }
</style>