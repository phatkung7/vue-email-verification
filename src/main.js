import { createApp } from "vue";
import App from "./App.vue";
import router from "../router";

import "bootstrap/dist/css/bootstrap.css";

// Initialize vConsole
var vConsole = new window.VConsole();
// Your vConsole hide code
if (process.env.NODE_ENV === "production" && vConsole) {
  vConsole.hideSwitch();
}

createApp(App).use(router).mount("#app");
