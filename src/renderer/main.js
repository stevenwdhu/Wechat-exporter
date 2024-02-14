import { createApp } from "vue";
import App from "./App.vue";

const { ipcRenderer } = require("electron/renderer");

const app = createApp(App);

app.provide("rootPaths", ipcRenderer.sendSync("rootPaths"));

app.mount("#app");

ipcRenderer.on("log", (e, v) => console.log(v));
