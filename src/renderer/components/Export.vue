<template>
  <div class="export-container">
    <div class="dir-path">
      <span class="dir-path-title">iTunes Backup Folder</span>
      <el-tooltip class="item" effect="light" :content="dir">
        <el-input readonly size="medium" :model-value="dir.split('/').at(-1)" />
      </el-tooltip>
      <el-button
        type="primary"
        size="medium"
        :loading="buttons.choose.loading"
        @click="chooseDir"
        >Choose
      </el-button>
    </div>
    <div class="account-list">
      <span class="account-list-title">Choose WeChat Account</span>
      <el-select
        v-model="chosenAccount"
        size="medium"
        placeholder="Select your backup directory before choosing an account"
      >
        <el-option v-for="a in accounts" :value="a.id">
          {{ `${a.name} (${a.id})` }}
        </el-option>
      </el-select>
      <el-button
        type="primary"
        size="medium"
        :loading="buttons.parse.loading"
        :disabled="buttons.parse.disabled"
        @click="parseAccount"
        >Parse
      </el-button>
    </div>
    <div class="search-export">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="Search"
        size="small"
        v-model="tableSearch"
      />
      <!--<el-progress :percentage="50"/>-->
      <div class="export-button">
        <el-icon color="#67C23A" v-if="exportSuccess">
          <circle-check />
        </el-icon>
        <el-button
          type="primary"
          size="medium"
          :loading="buttons.export.loading"
          :disabled="buttons.export.disabled"
          @click="exportChats"
          >Export
        </el-button>
      </div>
    </div>
    <el-table
      ref="resultTable"
      size="medium"
      border
      :data="
        filteredChats.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      "
      :row-key="row => row.id"
      :header-row-style="{ height: '50px' }"
      :row-style="{ height: '50px' }"
      @row-click="rowClick"
      @selection-change="handleSelection"
      @sort-change="handleSort"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        reserve-selection
      />
      <el-table-column prop="index" label="Index" width="60" align="center" />
      <el-table-column
        prop="displayName"
        label="Wechat Name"
        header-align="center"
        resizable
      />
      <el-table-column
        prop="id"
        label="Wechat ID"
        header-align="center"
        resizable
      />
      <el-table-column
        prop="msgNum"
        width="150"
        header-align="center"
        align="right"
        sortable="custom"
        label="Message Count"
      />
    </el-table>
    <el-pagination
      style="margin: 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      layout="total, prev, pager, next,jumper,sizes"
      :total="filteredChats.length"
      :page-sizes="[5, 8, 10, 20, 50]"
      :small="true"
    >
    </el-pagination>
  </div>
</template>

<script setup>
  import { computed, inject, onMounted, reactive, ref, toRaw } from "vue"
  import { CircleCheck } from "@element-plus/icons"

  const rootPaths = inject("rootPaths")
  const { join } = require("path")
  const { ipcRenderer } = require("electron/renderer")
  const bus = inject("bus")

  const dir = ref("")
  const accounts = ref([])
  const chosenAccount = ref()
  const chatList = ref([])
  const buttons = reactive({
    choose: {},
    parse: {},
    export: { disabled: true },
  })
  const exportSuccess = ref()
  const tableSearch = ref()
  const resultTable = ref()
  let chosenChats

  // const visibleIdx = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // const filteredChats = computed({
  //   get: () =>
  //     chatList.value &&
  //     chatList.value.filter(
  //       chat =>
  //         !tableSearch.value ||
  //         chat.displayName
  //           .toLowerCase()
  //           .includes(tableSearch.value.toLowerCase()) ||
  //         chat.id.toLowerCase().includes(tableSearch.value.toLowerCase())
  //     ),
  //   set: v => (chatList.value = v),
  // })
  const filteredChats = computed(
    () =>
      chatList.value &&
      chatList.value.filter(
        chat =>
          !tableSearch.value ||
          chat.displayName
            .toLowerCase()
            .includes(tableSearch.value.toLowerCase()) ||
          chat.id.toLowerCase().includes(tableSearch.value.toLowerCase())
      )
  )

  function chooseDir() {
    ipcRenderer.on("chosenDir", (e, dirPath) => {
      dir.value = dirPath
    })

    ipcRenderer.invoke("getAccounts").then(result => {
      if (result) {
        accounts.value = result
        chosenAccount.value = result[0].id
      }
    })
  }

  function parseAccount() {
    if (chosenAccount.value) {
      buttons.parse.loading = true
      ipcRenderer.invoke("getChatList", chosenAccount.value).then(l => {
        chatList.value = l.map((chat, idx) => {
          chat.index = idx + 1
          return chat
        })
        buttons.parse.loading = false
      })
    }
  }

  function rowClick(row) {
    resultTable.value.toggleRowSelection(row)
  }

  function handleSelection(val) {
    chosenChats = val
    buttons.export.disabled = !val.length
  }

  function handleSort({ order }) {
    switch (order) {
      case "descending":
        chatList.value = chatList.value.sort((a, b) => b.msgNum - a.msgNum)
        break
      case "ascending":
        chatList.value = chatList.value.sort((a, b) => a.msgNum - b.msgNum)
        break
      default:
        chatList.value = chatList.value.sort((a, b) => a.index - b.index)
    }
  }

  function exportChats() {
    if (chosenChats) {
      buttons.export.loading = true
      ipcRenderer
        .invoke(
          "exportChats",
          chosenChats.map(chat => toRaw(chat))
        )
        .then(path => {
          buttons.export.loading = false
          if (path) {
            exportSuccess.value = true
            bus.emit("changePath", path)
          }
        })
    }
  }
</script>

<style lang="less" scoped>
  .export-container {
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

      span {
        width: 210px;
        margin-right: 15px;
        font-size: 18px;
        flex: none;
        color: #606266;
        text-align: end;
      }
    }
  }

  .dir-path .el-input {
    position: relative;
    top: 1px;
    margin-right: 20px;
    flex: 1;
  }

  .el-select {
    margin-right: 20px;
    flex: 1;
  }

  .el-button {
    padding: 10px;
    width: 90px;
    flex-shrink: 0;
  }

  .export-button {
    display: flex;
    align-items: center;

    .el-icon {
      font-size: 18px;
    }

    .el-button {
      margin-left: 15px;
    }
  }

  .search-export {
    display: flex;
    flex: 0;
    margin-bottom: 0;
    width: 100%;
    justify-content: space-between;

    .el-input {
      flex: 1;
      margin-right: 20px;
      max-width: 300px;
    }
  }

  .el-table {
    min-height: 250px;
    flex-direction: column;

    :deep(.el-checkbox) {
      height: 23px;
    }

    //:deep(.el-checkbox__input){
    //  height: 23px;
    //}

    :deep(.is-right.el-table__cell) {
      padding-right: 10px;
    }

    :deep(.el-table__header),
    :deep(.el-table__body) {
      width: 100% !important;
      table-layout: auto !important;
    }

    :deep(.el-table__body-wrapper) {
      flex: 1;
      overflow: scroll;
    }
  }
</style>