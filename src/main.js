import { createApp } from "vue";
import App from "./App.vue";
import router from "../router";

import "bootstrap/dist/css/bootstrap.css";

// Your vConsole hide code
if (process.env.VUE_APP_ENV === "production") {
  if (window.vConsole) {
    window.vConsole.hideSwitch();
  }
}

createApp(App).use(router).mount("#app");
