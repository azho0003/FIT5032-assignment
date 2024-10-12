<template>
    <div class="container mt-3">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3">
          <h1 class="text-center">Login</h1>
  
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-12 col-md-6">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="formData.username"
                />
              </div>

              <div class="col-12 col-md-6">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                />
              </div>
            </div>
            <div class="d-grid mt-3">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <div class="d-grid mt-3">
              <button type="button" class="btn btn-secondary"><router-link to="/register" class="nav-link" active-class="active">Register</router-link></button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'

const formData = ref ({
    username: '',
    password: ''
})



</script>
  
<style>
</style>