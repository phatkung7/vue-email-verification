<template>
  <div class="container mt-2">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">
              การลงทะเบียนใช้งาน
              <p>Line DDC-Helpdesk</p>
            </h2>
            <form @submit.prevent="submitEmail">
              <div class="mb-3">
                <label for="email" class="form-label"
                  >กรุณากรอกอีเมล์ที่ใช้ลงทะเบียนระบบ DDC 4.0</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                />
              </div>
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="agreeCheckbox"
                  required
                />
                <label class="form-check-label" for="agreeCheckbox">
                  ยินยอมที่จะให้เก็บข้อมูล
                  <a href="#" @click.prevent="showTermsModal"
                    >ข้อกำหนดและเงื่อนไข</a
                  >.
                </label>
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Send Verification Code
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
import axios from "axios";
import Swal from "sweetalert2";
import liff from "@line/liff";
export default {
  data() {
    return {
      email: "",
      termsText: "", // New data property for terms and conditions text
      termsLink: process.env.VUE_APP_AGREEMENT_URL,
    };
  },
  beforeCreate() {
    liff.init({ liffId: process.env.VUE_APP_LIFF_ID }, function () {});
  },
  async mounted() {
    await this.checkLiffLogin();
  },
  methods: {
    async checkLiffLogin() {
      await liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location });
        }
      });
    },
    async submitEmail() {
      // Check if the checkbox is checked
      const isAgreed = document.getElementById("agreeCheckbox").checked;

      if (!isAgreed) {
        // Handle the case where the user hasn't agreed to terms
        //console.log("Please agree to the terms and conditions.");
        this.termsText = "กรุณาเลือกการยินยอมที่จะให้เก็บข้อมูล.";
        return;
      }
      // Call your backend API to send the verification code to the email
      const api_verify_user = process.env.VUE_APP_BASE_URL + "verify-sso-user";
      try {
        const response_verify_user = await axios.post(
          api_verify_user,
          {
            email: this.email,
          },
          {
            headers: {
              // Your headers go here
              "x-api-key": process.env.VUE_APP_API_KEY,
              "Content-Type": "application/json",
              // Add more headers as needed
            },
          }
        );
        //console.log(response_verify_user.data.status);
        // Check if the status is success
        if (response_verify_user.data.status === "success") {
          // This is where you'd typically make an API request to your server
          //console.log(`Verification code sent to ${this.email}`);
          // Show SweetAlert success message
          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "กรุณาตรวจสอบ Inbox อีเมล์ของท่าน",
            confirmButtonText: "ตกลง",
          });
          // Now, navigate to the OTP component
          //this.$router.push('/otp');
          this.$router.push({ name: "OtpPage", params: { email: this.email } });
        } else {
          // Handle the case where the API call was not successful
          console.error("User not found or other error occurred");
          this.termsText = "เกิดข้อผิดพลาด : กรุณาลองอีกครั้ง.";
        }
      } catch (error) {
        // Handle the case where the API call fails
        console.error("Error posting data:", error);
        this.termsText = "เกิดข้อผิดพลาด : ไม่พบอีเมล์ของท่านในระบบ.";
      }
    },
    showTermsModal() {
      window.open(this.termsLink, "_blank");
    },
  },
};
</script>

<style scoped>
.container {
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