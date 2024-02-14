<template>
  <div class="side-bar">
    <label for="export">
      <input
        type="radio"
        id="export"
        name="side-bar"
        v-model="currentTab"
        value="export"
      />
      <img class="side-bar-icon" :src="exportSrc" alt="" />
    </label>
    <label for="chat">
      <input
        type="radio"
        id="chat"
        name="side-bar"
        v-model="currentTab"
        value="chat"
      />
      <img class="side-bar-icon" :src="chatSrc" alt="" />
    </label>
    <label for="settings">
      <input
        type="radio"
        id="settings"
        name="side-bar"
        v-model="currentTab"
        value="settings"
      />
      <img class="side-bar-icon" :src="settingSrc" alt="" />
    </label>
  </div>
</template>

<script setup>
  import { computed, inject, watch} from "vue";

  const bus = inject("bus");
  const currentTab = inject("currentTab");
  watch(currentTab, () => {
    localStorage.setItem("tab", currentTab.value === "chat" ? 1 : 0);
  });

  const exportSrc = computed(() =>
    currentTab.value === "export" ? "img/export_active.png" : "img/export.png"
  );
  const chatSrc = computed(() =>
    currentTab.value === "chat" ? "img/chat_active.png" : "img/chat.png"
  );
  const settingSrc = computed(() =>
    currentTab.value === "settings"
      ? "img/settings_active.png"
      : "img/settings.png"
  );
</script>

<style scoped>
  .side-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
    width: 60px;
    background-color: #dedfe0;
    flex: none;
  }

  .side-bar-icon {
    width: 30px;
    margin-bottom: 30px;
  }

  input {
    display: none;
  }
</style>