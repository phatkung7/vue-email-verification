import { createRouter, createWebHistory } from "vue-router";
import EmailVerification from "../views/EmailVerification.vue";
import OTPVerification from "../views/OTPVerification.vue";
import InsertTicket from "../views/InsertTicket.vue";
const routes = [
  { path: "/", component: EmailVerification },
  {
    path: "/otp/:email",
    name: "OtpPage",
    component: OTPVerification,
    props: true,
  },
  { path: "/req-ticket", component: InsertTicket },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
