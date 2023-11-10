import { createApp } from "vue";
import App from "./App.vue";
import router from "../router";
import VConsole from "vconsole";
import "bootstrap/dist/css/bootstrap.css";
// Initialize vConsole
const vConsole = new VConsole();

// Conditionally initialize vConsole in development
if (process.env.VUE_APP_ENV === "production" && vConsole) {
  vConsole.hideSwitch();
}

createApp(App).use(router).mount("#app");
