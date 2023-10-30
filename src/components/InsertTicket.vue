<!-- InsertTicket.vue -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <b-card>
          <b-card-body>
            <h5 class="card-title">Insert Ticket</h5>
            <form @submit.prevent="insertTicket">
              <div class="form-group">
                <label for="title">Title</label>
                <b-form-input
                  v-model="title"
                  type="text"
                  id="title"
                  required
                ></b-form-input>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <b-form-textarea
                  v-model="description"
                  id="description"
                  required
                ></b-form-textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                Insert Ticket
              </button>
            </form>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      description: "",
    };
  },
  methods: {
    insertTicket() {
      // Implement logic to insert the ticket
      // For simplicity, let's log the data for now
      console.log("Title:", this.title);
      console.log("Description:", this.description);

      // You can perform an API call or other logic here to insert the ticket
    },
  },
};
</script>
