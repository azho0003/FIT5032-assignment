<template>
    <div class="container mt-3">
      <div class="row">
        <div class="col-12 col-md-8 offset-md-2">
          <h1 class="text-center">Send Email</h1>

          <form @submit.prevent="submitEmailForm">
            <div class="mb-3">
              <label for="email" class="form-label">Recipient Email Address</label>
              <input type="email" id="email" class="form-control" v-model="email" required>
            </div>
            <div class="mb-3">
              <label for="subject" class="form-label">Subject</label>
              <input type="text" id="subject" class="form-control" v-model="subject" required>
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">Message</label>
              <textarea id="message" class="form-control" rows="4" v-model="message" required></textarea>
            </div>
            <div class="mb-3">
              <label for="attachment" class="form-label">Attachment</label>
              <input type="file" id="attachment" class="form-control" @change="handleFileUpload">
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Send Email</button>
            </div>
            <div v-if="successMessage" class="text-success mt-3">{{ successMessage }}</div>
            <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const email = ref('')
  const subject = ref('')
  const message = ref('')
  const attachment = ref(null)
  const successMessage = ref('')
  const errorMessage = ref('')
  
  const handleFileUpload = (event) => {
    attachment.value = event.target.files[0]
  }
  
  const submitEmailForm = async () => {
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('subject', subject.value)
    formData.append('message', message.value)
    if (attachment.value) {
      formData.append('attachment', attachment.value)
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      if (response.ok) {
        successMessage.value = 'Email sent successfully!'
        errorMessage.value = ''
      } else {
        throw new Error(result.message || 'Failed to send email')
      }
    } catch (error) {
      errorMessage.value = error.message
      successMessage.value = ''
    }
  }
  </script>