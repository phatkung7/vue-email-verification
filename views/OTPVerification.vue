<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">
              OTP Verification {{ appName }}
            </h2>
            <form @submit.prevent="submitOTP" ref="otpForm">
              <div class="mb-3 text-center">
                <label for="otp" class="form-label"
                  >กรุณาใส่รหัสยืนยัน (OTP Code)</label
                >
              </div>
              <div class="d-flex justify-content-center align-items-center">
                <div
                  v-for="(digit, index) in otpArray"
                  :key="index"
                  class="mx-2"
                >
                  <input
                    ref="otpInput"
                    v-model="otpArray[index]"
                    inputmode="numeric"
                    class="form-control text-center"
                    required
                    pattern="\d"
                    maxlength="1"
                    @input="handleInput(index)"
                    @keydown="handleKeydown(index, $event)"
                    :tabindex="index"
                  />
                </div>
              </div>
              <div class="mt-3 text-center">
                <label for="otpMsg" class="form-label text-danger"
                  >***กรุณาอย่าปิดหน้าต่างนี้ ขณะรอ OTP Code &#128241;</label
                >
              </div>
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="text-center mt-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">กำลังประมวลผล...</span>
                </div>
                <div>กำลังประมวลผล...</div>
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-block mt-4"
                :disabled="isInputIncomplete || isLoading"
              >
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
import Swal from "sweetalert2";
const LINE_HOOK_REGISTER_OTP = process.env.VUE_APP_LINE_HOOK_REGISTER_OTP;
const DDC_API = process.env.VUE_APP_DDC_API;
const DDC_API_KEY = process.env.VUE_APP_API_KEY;
const LIFF_ID = process.env.VUE_APP_LIFF_ID_REG;
export default {
  props: ["email"],
  data() {
    return {
      otp: "",
      termsText: "",
      otpArray: ["", "", "", "", "", ""],
      isLoading: false, // New property to track loading state
      appName: process.env.VUE_APP_NAME_CATE,
    };
  },
  computed: {
    isInputIncomplete() {
      return this.otpArray.some((digit) => digit === "");
    },
  },
  beforeCreate() {
    liff.init({ liffId: LIFF_ID }, function () {});
  },
  async mounted() {
    await this.checkLiffLogin();
    this.$refs.otpInput[0].focus();
  },
  watch: {
    otpArray: {
      handler() {
        if (!this.isInputIncomplete && this.$refs.otpForm) {
          // Auto-submit the form when OTP is complete and form reference is available
          //this.submitOTP();
        }
      },
      deep: true,
    },
  },
  methods: {
    handleInput(index) {
      // Sanitize input to allow only integers
      this.otpArray[index] = this.otpArray[index].replace(/\D/g, "");
      // Handle input logic if needed
      //console.log(index);
      if (index < 5 && this.otpArray[index] !== "") {
        // Move to the next input box
        this.$refs.otpInput[index + 1].focus();
      }
    },
    handleKeydown(index, event) {
      // Handle backspace key to maintain cursor position
      if (event.key === "Backspace" && index > 0 && !this.otpArray[index]) {
        this.$refs.otpInput[index - 1].focus();
      }
    },
    async checkLiffLogin() {
      await liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location });
        }
      });
    },
    async SubmitUser(userData) {
      this.isLoading = true; // Set loading state to true
      const idToken = await liff.getIDToken();
      // console.log("<<<<<<<<<<<<<<<<idToken>>>>>>>>>>>>>>>>>>>");
      // console.log(idToken);
      // console.log("<<<<<<<<<<<<<<<< userData >>>>>>>>>>>>>>>>>>>");
      // console.log(userData);
      // console.log('>>>>>>>>>>>>>> LINE_HOOK_REGISTER_OTP <<<<<<<<<<<<');
      // console.log(LINE_HOOK_REGISTER_OTP);
      try {
        // Make an API call using Axios
        const response = await axios.post(
          LINE_HOOK_REGISTER_OTP,
          {
            email: userData.email,
            otp: userData.otp,
          },
          {
            headers: {
              Authorization: idToken,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "ลงทะเบียนใช้งานสำเร็จ",
            confirmButtonText: "ตกลง",
          }).then(async (result) => {
            if (result.isConfirmed) {
              if (
                liff.getContext().type !== "none" &&
                liff.getContext().type !== "external"
              ) {
                // await liff.sendMessages([
                //   {
                //     type: "text",
                //     text: "This message was sent by sendMessages()",
                //   },
                // ]);
                await liff.closeWindow();
              }
            }
          });
        }
      } catch (error) {
        //console.log(error);
        //console.log(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.response.data.message || "An error occurred : SubmitUser",
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            liff.closeWindow();
          }
        });
      } finally {
        this.isLoading = false; // Set loading state to false after completion
      }
    },
    async submitOTP() {
      const enteredOTP = this.otpArray.join("");
      try {
        await axios
          .post(
            DDC_API + "verify-otp",
            {
              email: this.$route.params.email,
              otp: enteredOTP,
            },
            {
              headers: {
                "x-api-key": DDC_API_KEY,
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (response) => {
            //console.log("-------- response verify-otp------");
            //console.log(response.data);
            if (response.data.status === "success") {
              // Check if response.data.data exists and has at least one element
              if (response.data.data && response.data.data.length > 0) {
                // Post Data To SubmitUser
                try {
                  // Call the SubmitUser method with Axios
                  const requestData = {
                    email: response.data.data[0].email,
                    otp: response.data.data[0].otp_code,
                  };
                  //console.log("-------- Verify OK ------");
                  // console.log(requestData);
                  await this.SubmitUser(requestData);
                  //.log("SubmitUser success");
                } catch (error) {
                  //console.error("SubmitUser error:", error);
                }
              } else {
                this.termsText = "No data received from DDC API";
              }
            } else {
              //this.termsText = "เกิดข้อผิดพลาด: " + response.data.message;
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: response.data.message,
                confirmButtonText: "ตกลง",
              }).then((result) => {
                if (result.isConfirmed) {
                  // Reload the page
                  location.reload();
                }
              });
            }
          });
      } catch (error) {
        // Handle the case where the API call fails
        //console.error("Error posting data:", error);
        this.termsText = "เกิดข้อผิดพลาด: API Error";
      }
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
