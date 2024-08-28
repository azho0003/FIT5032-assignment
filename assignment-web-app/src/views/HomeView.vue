<template>
  <div class="main-container">
    <header>
      <NavigationHeader />
    </header>

    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>
  
<script setup>
import NavigationHeader from '../components/NavigationHeader.vue';

</script>
  
<style>
</style>