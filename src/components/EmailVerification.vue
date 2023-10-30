<template>
  <div>
    <h2>Email Verification</h2>
    <form @submit.prevent="verifyEmail">
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
      <button type="submit">Verify Email</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
    };
  },
  methods: {
    verifyEmail() {
      // Make an API call to verify the email
      // Upon success, navigate to the OTPInput component
      // For simplicity, let's assume a successful API call
      this.$router.push("/otp-input");
    },
  },
};
</script>

<style scoped>
/* Add your component styles here */
</style>
