<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">การแจ้งปัญหาการใช้งานระบบ</h5>
            <form @submit.prevent="insertTicket">
            <div class="form-group mt-3 mb-3">
                <label class="control-label" for="systemType">ชื่อระบบ</label>
                <select
                  v-model="selectedSystemType"
                  id="systemType"
                  class="form-control custom-select"
                >
                  <option
                    v-for="systemType in systemTypes"
                    :key="systemType.id"
                    :value="systemType.id"
                  >
                    {{ systemType.sys_name }}
                  </option>
                </select>
              </div>
              <div class="form-group mt-3 mb-3">
                <label for="description">ปัญหาที่พบ</label>
                <textarea
                  v-model="description"
                  id="description"
                  class="form-control"
                  placeholder="โปรดระบุปัญหาที่ท่านพบ"
                  required
                  @input="updateCharacterCount"
                  :maxlength="maxCharacterCount"
                  style="height: 150px;"
                ></textarea>
                <small class="text-muted"
                  >Character count: {{ characterCount }}/{{
                    maxCharacterCount
                  }}</small
                >
              </div>
              <button type="submit" class="btn btn-warning">
                แจ้งปัญหา
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import liff from '@line/liff';
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      description: "",
      selectedSystemType: null,
      systemTypes: [], // Array to hold the fetched system types
      characterCount: 0,
      maxCharacterCount: 300, // You can adjust the maximum character count
    };
  },
  mounted() {
    // Fetch categories and system types when the component is mounted
    this.fetchSystemTypes();
  },
  methods: {
    async fetchSystemTypes() {
      const apiUrl = process.env.VUE_APP_BASE_URL+'list-system-types';
      try {
        // Adjust the URL based on your API endpoint
        const response = await axios.get(apiUrl);
        this.systemTypes = response.data;
        // Preselect the first option
        if (this.systemTypes.length > 0) {
          this.selectedSystemType = this.systemTypes[0].id;
        }
      } catch (error) {
        console.error("Error fetching system types:", error);
      }
    },
    insertTicket() {
      // Implement logic to insert the ticket
      // For simplicity, let's log the data for now
      console.log("Description:", this.description);
      console.log("System Type ID:", this.selectedSystemType); // Use this for the system type ID
      const selectedSystemType = this.systemTypes.find(
        (system) => system.value === this.selectedSystemType
      );
      console.log(
        "System Type Name:",
        selectedSystemType ? selectedSystemType.text : ""
      );
      // You can perform an API call or other logic here to insert the ticket
    },
    updateCharacterCount() {
      if (this.description.length > this.maxCharacterCount) {
        // Trim the text to the maximum character count
        this.description = this.description.substring(
          0,
          this.maxCharacterCount
        );
      }
      this.characterCount = this.description.length;
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
  max-width: 400px;
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
