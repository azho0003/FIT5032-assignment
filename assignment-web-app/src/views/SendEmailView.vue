<template>
  <div class="container mt-5">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail" enctype="multipart/form-data">
      <div class="row mb-3">
        <label for="toEmail" class="form-label">To</label>
        <input
          type="email"
          class="form-control"
          id="toEmail"
          v-model="emailData.to"
          required
        />
      </div>

      <div class="row mb-3">
        <label for="subject" class="form-label">Subject</label>
        <input
          type="text"
          class="form-control"
          id="subject"
          v-model="emailData.subject"
          required
        />
      </div>

      <div class="row mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea
          class="form-control"
          id="message"
          rows="5"
          v-model="emailData.message"
          required
        ></textarea>
      </div>

      <div class="row mb-3">
        <label for="attachment" class="form-label">Attachment</label>
        <input
          class="form-control"
          type="file"
          id="attachment"
          @change="handleFileUpload"
        />
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
import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

export default {
  name: 'SendEmailView',
  setup() {
    const auth = getAuth();
    const userEmail = ref('');
    const loading = ref(false);
    const success = ref(false);
    const error = ref('');
    const emailData = ref({
      to: '',
      subject: '',
      message: '',
    });
    const attachment = ref(null);

    // Get the currently logged in user's email
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userEmail.value = user.email;
      } else {
        // Handle unauthenticated state if necessary
        userEmail.value = '';
      }
    });

    const handleFileUpload = (event) => {
      attachment.value = event.target.files[0];
    };

    const sendEmail = async () => {
      if (!userEmail.value) {
        error.value = 'User is not authenticated.';
        return;
      }

      loading.value = true;
      success.value = false;
      error.value = '';

      try {
        const formData = new FormData();
        formData.append('from', userEmail.value);
        formData.append('to', emailData.value.to);
        formData.append('subject', emailData.value.subject);
        formData.append('message', emailData.value.message);
        if (attachment.value) {
          formData.append('attachment', attachment.value);
        }

        const response = await axios.post('/api/send-email', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });

        if (response.data.success) {
          success.value = true;
          emailData.value = { to: '', subject: '', message: '' };
          attachment.value = null;
          // Reset file input
          document.getElementById('attachment').value = '';
        } else {
          error.value = response.data.message || 'Failed to send email.';
        }
      } catch (err) {
        console.error(err);
        error.value =
          err.response?.data?.message || 'An error occurred while sending email.';
      } finally {
        loading.value = false;
      }
    };

    return {
      emailData,
      sendEmail,
      handleFileUpload,
      loading,
      success,
      error,
    };
  },
};
</script>

