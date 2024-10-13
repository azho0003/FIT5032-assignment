<template>
  <div class="container mt-5">
    <h2>Send an Email</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="to" class="form-label">To</label>
        <input type="email" class="form-control" id="to" v-model="email.to" required />
      </div>

      <div class="mb-3">
        <label for="from" class="form-label">From</label>
        <input type="email" class="form-control" id="from" v-model="email.from" required />
      </div>

      <div class="mb-3">
        <label for="subject" class="form-label">Subject</label>
        <input type="text" class="form-control" id="subject" v-model="email.subject" required />
      </div>

      <div class="mb-3">
        <label for="html" class="form-label">Message</label>
        <textarea class="form-control" id="html" v-model="email.html" rows="5" required></textarea>
      </div>

      <div class="mb-3">
        <label for="attachment" class="form-label">Attachment</label>
        <input class="form-control" type="file" id="attachment" @change="handleFileUpload" />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Email' }}
      </button>

      <div v-if="success" class="alert alert-success mt-3" role="alert">
        Email sent successfully!
      </div>

      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SendEmailView',
  data() {
    return {
      email: {
        to: '',
        from: '',
        subject: '',
        html: '',
      },
      attachment: null,
      loading: false,
      success: false,
      error: '',
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Remove the prefix "data:*/*;base64," to get pure base64
          const base64Content = e.target.result.split(',')[1];
          this.attachment = {
            content: base64Content,
            filename: file.name,
            type: file.type,
            disposition: 'attachment',
            content_id: 'attachment1',
          };
        };
        reader.readAsDataURL(file);
      }
    },
    async handleSubmit() {
      this.loading = true;
      this.success = false;
      this.error = '';

      // Prepare the payload
      const payload = {
        ...this.email,
        attachments: this.attachment ? [this.attachment] : [],
      };

      try {
        const response = await axios.post('/api/send-email', payload);
        if (response.data.success) {
          this.success = true;
          this.email = {
            to: '',
            from: '',
            subject: '',
            html: '',
          };
          this.attachment = null;
          this.$refs.attachment.value = ''; // Reset file input
        } else {
          this.error = response.data.message || 'Failed to send email.';
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'An error occurred.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

