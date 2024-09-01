<template>
    <div class="container-fluid mt-3">
        <div class="text-center">
            <h1>Please Rate Us!</h1>
        </div>
        <RatingComponent v-model="userRating"/>
        <div class="text-center pt-3">
            <p>Your Rating: {{ userRating }} star(s)</p>
            <button @click="submitRating" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="resetRating">Clear</button>
        </div>

        <h3 class="text-center pt-3">User Ratings</h3>
        <div class="text-center pt-3">
            <div v-if="ratings.length > 0">
                <p>Average Rating: {{ averageRating.toFixed(1) }} stars</p>
                <RatingComponent :modelValue="averageRating" :stars="5" :cancel="false" />
                <p>Total Ratings: {{ ratings.length }}</p>
            </div>
            <div v-else>
                <p>No ratings submitted yet. Be the first to rate!</p>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import RatingComponent from '@/components/RatingComponent.vue';
import { computed, ref } from 'vue';


const userRating = ref()

const ratings = ref([])

const submitRating = () => {
    if (userRating.value !== null) {
        ratings.value.push(userRating.value)  
    }
}

const resetRating = () => {
    userRating.value = null
}

const averageRating = computed(() => {
    const sum = ratings.value.reduce((acc, rating) => acc += rating, 0)
    return sum / ratings.value.length
})

</script>
  
<style>
</style>