<template>
  <el-aside>
    <el-menu
      :unique-opened="true"
      background-color="#f7f7f7"
      text-color="black"
      active-text-color="black"
    >
      <el-sub-menu index="1" :show-timeout="100" :hide-timeout="100">
        <template #title>
          <span>Group Chat</span>
        </template>
        <el-menu-item
          v-for="(group, index) in groups"
          :key="index"
          :index="`1-${index + 1}`"
          @click="bus.emit('chooseChat', group)"
          >{{ group.displayName }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        v-for="(chat, index) in chats"
        :key="index"
        :index="`${index + 2}`"
        @click="bus.emit('chooseChat', chat)"
        >{{ chat.displayName }}
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
  import { computed, inject } from "vue";

  const bus = inject("bus");

  const fs = require("fs-extra");
  const { join } = require("path");
  const chatsPath = inject("chatsPath");

  const chatManifest = computed(
    () =>
      fs.readJSONSync(join(chatsPath.value, "manifest.json"), {
        throws: false,
      }) || { chats: [], chatRooms: [] }
  );

  const chats = computed(() => chatManifest.value.chats);
  const groups = computed(() => chatManifest.value.chatRooms);
</script>

<style scoped>
  .el-aside {
    overflow: hidden;
    width: 300px;
    background-color: #f7f7f7;
  }

  .el-menu-item.is-active {
    background-color: #dcdcdc;
  }

  .el-menu-item:hover {
    background-color: #eaeaea;
  }
</style>