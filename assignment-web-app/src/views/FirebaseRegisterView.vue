<template>
    <div class="container mt-3">
        <div class="row">
            <div class="col-12 col-md-6 offset-md-3">
                <h1 class="text-center">Register</h1>

                <form @submit.prevent="submitForm">
                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" class="form-control" v-model="email" required>
                        </div>
                        <div class="col-12 col-md-6">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" class="form-control" v-model="password" required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required>
                        </div>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                    <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = getAuth()

const submitForm = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    alert('Registration successful')
    router.push("/Login")
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
  