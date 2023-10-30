<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">OTP Verification</h2>
            <form @submit.prevent="submitOTP">
              <div class="mb-3">
                <label for="otp" class="form-label">Enter OTP</label>
                <input
                  type="text"
                  class="form-control"
                  id="otp"
                  v-model="otp"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liff from "@line/liff";
//import axios from "axios";
//import Swal from "sweetalert2";
export default {
  props: ["email"],
  data() {
    return {
      otp: "",
    };
  },
  beforeCreate() {
    liff.init({ liffId: process.env.VUE_APP_LIFF_ID }, function () {});
  },
  async mounted() {
    await this.checkLiffLogin();
    // Access the email parameter from the route
    const email = this.$route.params.email;
    console.log("Email received in /otp:", email);
  },
  methods: {
    async checkLiffLogin() {
      await liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location });
        }
      });
    },
    async submitOTP() {
      const idToken = await liff.getIDToken();
      //   const getLiffemail = await liff.getDecodedIDToken().email;
      console.log("idToken", idToken);
      //   console.log("email", getLiffemail);
      console.log(`OTP ${this.$route.params.email} verified successfully`);
      // Call your backend API to verify the OTP
      // This is where you'd typically make an API request to your server
      console.log(`OTP ${this.otp} verified successfully`);
      // Handle success or failure accordingly
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  width: 100%;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
