<template>
    <div class="container mt-3">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3">
          <h1 class="text-center">Login</h1>
  
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-12 col-md-6">
                <label for="username" class="form-label">Email</label>
                <input type="email" id="username" class="form-control" v-model="email" required>
              </div>
              <div class="col-12 col-md-6">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" v-model="password" required>
              </div>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const auth = getAuth()
const router = useRouter()

const submitForm = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    alert('Login successful')
    router.push("/")
    console.log(auth.currentUser)
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
