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
//const LINE_DDC_HOOK = process.env.LINE_DDC_HOOK
const VUE_APP_API_KEY = process.env.VUE_APP_API_KEY;
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
    async SubmitUser(userData) {
      const idToken = await liff.getIDToken();
      console.log('-----idToken----');
      console.log(idToken);
      console.log('---------');
      console.log('-----userData----');
      console.log(userData.email);
      console.log(userData.otp);
      console.log('---------');
      try {
        // Make an API call using Axios
        const response = await axios({
          method: "post",
          url: "https://e0d5-203-156-15-252.ngrok-free.app/webhook-ddc-helpdesk-51c5f/asia-northeast1/register-auth",
          headers: {
            Authorization: idToken,
          },
          data: {
            email: userData.email,
            otp: userData.otp,
          },
        });
        // Handle the response as needed
        console.log("API Response:", response.data);
        if (response.data) {
          alert("Message sent");
          liff.closeWindow();
          // if (
          //   liff.getContext().type !== 'none' &&
          //   liff.getContext().type !== 'external'
          // ) {
          //   await liff.sendMessages([
          //     {
          //       type: 'text',
          //       text: 'This message was sent by sendMessages()',
          //     },
          //   ]);
          console.log("----- Close Liff Here -----");
        }
      } catch (error) {
        // Handle errors
        console.error("API Error on SubmitUser:", error.message);
        //throw error; // Re-throw the error if needed
      }
    },
    async submitOTP() {
      try {
        await axios
          .post(
            "https://api.ddc.moph.go.th/api-helpdesk/verify-otp",
            {
              email: this.$route.params.email,
              otp: this.otp,
            },
            {
              headers: {
                "x-api-key": VUE_APP_API_KEY,
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (response) => {
            if (response.data.status == "success") {
              console.log("Log from DDC API:", response.data.data[0].email);
              // Post Data To SubmitUser
              try {
                // Call the SubmitUser method with Axios
                const requestData = {
                  email: response.data.data[0].email,
                  otp: response.data.data[0].otp_code,
                };
                console.log(requestData);
                await this.SubmitUser(requestData);
                console.log("SubmitUser success");
              } catch (error) {
                console.error("SubmitUser error:", error);
              }
            } else {
              this.termsText = "เกิดข้อผิดพลาด: " + response.data.message;
            }
          });
      } catch (error) {
        // Handle the case where the API call fails
        console.error("Error posting data:", error);
        this.termsText = "เกิดข้อผิดพลาด: API Error";
      }

      // const api_verify_otp =
      //   "https://e0d5-203-156-15-252.ngrok-free.app/webhook-ddc-helpdesk-51c5f/asia-northeast1/register-auth";
      // console.log("API URL:", api_verify_otp);
      // await axios({
      //   method: "post",
      //   url: api_verify_otp,
      //   headers: {
      //     Authorization: idToken,
      //   },
      //   data: {
      //     email: this.$route.params.email,
      //     otp: this.otp,
      //   },
      // })
      //   .then((response) => {
      //     // handle success
      //     console.log(response);
      //     //alert("Message sent");
      //     //liff.closeWindow();
      //   })
      //   .catch((error) => {
      //     // handle errors
      //     //alert("Error Message sent");
      //     console.log(error);
      //   });

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
      // } catch (error) {
      //   // Handle the case where the API call fails
      //   console.error("Error posting data:", error);
      //   this.termsText = "เกิดข้อผิดพลาดไม่พบอีเมล์ของท่านในระบบ.";
      // }

      //const idToken = await liff.getIDToken();
      //   const getLiffemail = await liff.getDecodedIDToken().email;
      //console.log("------ Start App Logs ----");
      //console.log("idToken", idToken);
      //   console.log("email", getLiffemail);
      //console.log(`OTP ${this.$route.params.email} verified successfully`);
      // Call your backend API to verify the OTP
      // This is where you'd typically make an API request to your server
      //console.log(`OTP ${this.otp} verified successfully`);
      // Handle success or failure accordingly
      //console.log("------ End App Logs ----");
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
