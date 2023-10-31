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
              <div class="text-center text-danger mt-3">
                {{ termsText }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liff from "@line/liff";
import axios from "axios";
//import Swal from "sweetalert2";
export default {
  props: ["email"],
  data() {
    return {
      otp: "",
      termsText: "",
    };
  },
  beforeCreate() {
    liff.init({ liffId: process.env.VUE_APP_LIFF_ID }, function () {});
  },
  async mounted() {
    await this.checkLiffLogin();
    // Access the email parameter from the route
    //const email = this.$route.params.email;
    //console.log("Email received in /otp:", email);
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

      const api_verify_otp = process.env.LINE_HOOK_REGISTER_OTP;
      try {
        await axios.post(
          api_verify_otp,
          {
            headers: {
              // Your headers go here
              "Authorization": idToken,
              // Add more headers as needed
            },
          },{
            email: this.$route.params.email,
            otp: this.otp
          },
        ).then((response) => {
          console.log(response);
        });
        //console.log(response_verify_user.data.status);
        // Check if the status is success
        //if (response_verify_otp.data.status === "success") {
          // This is where you'd typically make an API request to your server
          //console.log(`Verification code sent to ${this.email}`);
          // Show SweetAlert success message
          // Swal.fire({
          //   icon: "success",
          //   title: "สำเร็จ!",
          //   text: "กรุณาตรวจสอบ Inbox อีเมล์ของท่าน",
          //   confirmButtonText: "ตกลง",
          // });
          // Now, navigate to the OTP component
          //this.$router.push('/otp');
          //this.$router.push({ name: "OtpPage", params: { email: this.email } });
        // } else {
        //   // Handle the case where the API call was not successful
        //   console.error("User not found or other error occurred");
        //   this.termsText = "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง.";
        // }
      } catch (error) {
        // Handle the case where the API call fails
        console.error("Error posting data:", error);
        this.termsText = "เกิดข้อผิดพลาดไม่พบอีเมล์ของท่านในระบบ.";
      }

      //const idToken = await liff.getIDToken();
      //   const getLiffemail = await liff.getDecodedIDToken().email;
      console.log('------ Start App Logs ----');
      console.log("idToken", idToken);
      //   console.log("email", getLiffemail);
      console.log(`OTP ${this.$route.params.email} verified successfully`);
      // Call your backend API to verify the OTP
      // This is where you'd typically make an API request to your server
      console.log(`OTP ${this.otp} verified successfully`);
      // Handle success or failure accordingly
      console.log('------ End App Logs ----');
    },
  },
};
</script>

<style scoped>.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add box-shadow for a subtle shadow effect */
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

a {
  color: #007bff;
  text-decoration: underline;
}

a:hover {
  color: #0056b3;
}
</style>
