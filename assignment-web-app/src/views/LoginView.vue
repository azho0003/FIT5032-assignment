<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset md-2">
                <h1 class="text-center">Login</h1>
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

const clearForm = () => {
    formData.value = {
        username: '',
        password: ''
    }
}

</script>
  
<style>
</style>