import { createApp } from "vue";
import App from "./App.vue";
import router from "../router";
import VConsole from "vconsole";
import "bootstrap/dist/css/bootstrap.css";

// Conditionally initialize vConsole in development
if (process.env.NODE_ENV !== "production") {
  const vConsole = new VConsole();
}

createApp(App).use(router).mount("#app");
