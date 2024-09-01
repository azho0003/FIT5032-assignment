<template>
    <div class="rating-container">
      <RatingComponent v-model="ratingValue" :stars="5" :cancel="false" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ratingValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
};
  </script>
  
  <style scoped>
  .rating-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    max-width: 400px;
    margin: auto;
  }
  
  .rating-container h2 {
    margin-bottom: 20px;
  }
  
  .rating-container p {
    margin-top: 5px;
    font-size: 20px;
  }
  </style>
  