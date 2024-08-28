<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Register</h1>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">

            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input 
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateUsername(true)"
                @input="() => validateUsername(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="staffCode" class="form-label">Staff Code (optional)</label>
              <input
                type="text"
                class="form-control"
                id="staffCode"
                v-model="formData.staffCode"
              />
            </div>

            <div class="text-center pt-3">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="row mt-5">
    <DataTable :value="submittedCards" table-style="min-width: 50rem">
      <Column field="username" header="Username"></Column>
      <Column field="password" header="Password"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="staffCode" header="Staff Code"></Column>
    </DataTable>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  gender: '',
  staffCode: ''
})

const submittedCards = ref([])

const submitForm = () => {
  validateUsername(true)
  validatePassword(true)
  if (!errors.value.username && !errors.value.password) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    gender: '',
    staffCode: ''
  }
}

const errors = ref({
  username: null,
  password: null,
  gender: null,
  staffCode: null
})

const validateUsername = (blur) => {
  if (formData.value.username.length < 5) {
    if (blur) errors.value.username = 'Username must be at least 5 characters long.'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = ' Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else {
    errors.value.password = null
  }
}
</script>
  
<style>
</style>