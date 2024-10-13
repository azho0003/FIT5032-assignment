<template>
  <div class="container mt-5">
    <h2>Send an Email</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="to" class="form-label">To (seperate multiple emails with commas)</label>
        <input type="text" class="form-control" id="to" v-model="email.to" required />
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
import { getAuth } from 'firebase/auth';

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

      // Split the 'to' field by commas and trim whitespace
      const recipientsArray = this.email.to
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Validate email addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = recipientsArray.filter(email => !emailRegex.test(email));

      if (invalidEmails.length > 0) {
        this.error = `Invalid email addresses: ${invalidEmails.join(', ')}`;
        this.loading = false;
        return;
      }

      const payload = {
        to: recipientsArray, // Now an array
        from: this.email.from,
        subject: this.email.subject,
        html: this.email.html,
        attachments: this.attachment ? [this.attachment] : []
      };

      try {
        // check if user is logged on
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated.');
        }

        const idToken = await user.getIdToken();

        const cloudFunctionURL = 'https://us-central1-azho0003-5032.cloudfunctions.net/sendEmail';

        const response = await axios.post(cloudFunctionURL, payload, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.data.success) {
          this.success = true;
          this.email = {
            to: '',
            from: '',
            subject: '',
            html: '',
          };
          this.attachment = null;
          this.$refs.attachment.value = '';
        } else {
          this.error = response.data.error || 'Failed to send email.';
        }
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'An error occurred.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

