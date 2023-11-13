<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">การแจ้งปัญหาการใช้งานระบบ</h4>
            <form @submit.prevent="insertTicket">
              <div class="form-group mt-3 mb-3">
                <label style="text-align: left" for="systemType"
                  >ชื่อระบบ</label
                >
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
                <label class="control-label" for="fileUpload"
                  >อัพโหลดไฟล์ภาพ</label
                >
                <input
                  type="file"
                  id="fileUpload"
                  class="form-control"
                  @change="handleFileUpload"
                  accept=".jpg, .jpeg, .png, .gif"
                />
                <small class="text-muted">
                  รองรับไฟล์รูปภาพ: JPEG, JPG, PNG, GIF
                </small>
                <small class="text-muted">
                  ขนาดไฟล์สูงสุด:
                  {{ (maxFileSize / (1024 * 1024)).toFixed(2) }} MB
                </small>
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
                  style="height: 150px"
                ></textarea>
                <small class="text-muted"
                  >Character count: {{ characterCount }}/{{
                    maxCharacterCount
                  }}</small
                >
              </div>
              <button type="submit" class="btn btn-warning">แจ้งปัญหา</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liff from '@line/liff';
import axios from "axios";
const LIFF_ID = process.env.VUE_APP_LIFF_ID;
export default {
  data() {
    return {
      description: "",
      selectedSystemType: null,
      systemTypes: [], // Array to hold the fetched system types
      characterCount: 0,
      maxCharacterCount: 500, // You can adjust the maximum character count
      selectedFile: null,
      maxFileSize: 5 * 1024 * 1024, // 5 MB (adjust as needed)
    };
  },
  beforeCreate() {
    liff.init({ liffId: LIFF_ID }, function () {});
  },
  async mounted() {
    // Fetch categories and system types when the component is mounted
    await this.fetchSystemTypes();
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
    async fetchSystemTypes() {
      const apiUrl = process.env.VUE_APP_DDC_API + "list-system-types";
      const api_key = process.env.VUE_APP_API_KEY;
      try {
        // Adjust the URL based on your API endpoint
        const response = await axios.get(apiUrl, {
          headers: {
            "x-api-key": api_key,
          },
        });
        console.log(response);
        this.systemTypes = response.data.data;
        // Preselect the first option
        if (this.systemTypes.length > 0) {
          this.selectedSystemType = this.systemTypes[0].id;
        }
      } catch (error) {
        console.error("Error fetching system types:", error);
      }
    },
    async insertTicket() {
      //init Line Liff
      const idToken = await liff.getIDToken();
      console.log('--------- idToken -----------');
      console.log(idToken);
      console.log('-----------------------------');
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
      const formData = new FormData();
      formData.append("systemTypeId", this.selectedSystemType);
      formData.append("files", this.selectedFile);
      formData.append("id_token", idToken);
      formData.append("description", this.description);
      // Adjust the URL based on your API endpoint for file upload
      const apiUrl = process.env.VUE_APP_DDC_API + "tickets-line";
      const api_key = process.env.VUE_APP_API_KEY;
      axios
        .post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": api_key,
            "Authorization" : idToken,
          },
        })
        .then((response) => {
          console.log("Ticket inserted successfully:", response.data);
          // Add any additional logic or handling here
        })
        .catch((error) => {
          console.error("Error inserting ticket:", error);
          // Handle errors appropriately
        });
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
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (!this.isValidFileType(file)) {
          alert("รองรับเฉพาะไฟล์รูปภาพ: JPEG, JPG, PNG, GIF");
          event.target.value = null; // Clear the file input
          return;
        }

        if (!this.isValidFileSize(file)) {
          alert(`ขนาดไฟล์เกิน ${this.maxFileSize / 1024} KB`);
          event.target.value = null; // Clear the file input
          return;
        }

        this.selectedFile = file;
      }
    },
    isValidFileType(file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      return allowedTypes.includes(file.type);
    },
    isValidFileSize(file) {
      return file.size <= this.maxFileSize;
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
  max-width: 500px;
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
