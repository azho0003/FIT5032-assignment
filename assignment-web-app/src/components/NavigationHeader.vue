<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item"><router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link></li>
            <li class="nav-item"><router-link to="/about" class="nav-link" active-class="active">About</router-link></li>
            <li class="nav-item"><router-link to="/login" class="nav-link" active-class="active">Login</router-link></li>
            <li class="nav-item"><router-link to="/register" class="nav-link" active-class="active">Register</router-link></li>
            <li class="nav-item"><router-link to="/email" class="nav-link" active-class="active">Email</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
  
  <style scoped>
  .b-example-divider {
    height: 3rem;
    background-color: rgba(0, 0, 0, 0.1);
    border: solid rgba(0, 0, 0, 0.15);
    border-width: 1px 0;
    box-shadow:
      inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
      inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
  }
  
  .form-control-dark {
    color: #fff;
    background-color: var(--bs-dark);
    border-color: var(--bs-gray);
  }
  .form-control-dark:focus {
    color: #fff;
    background-color: var(--bs-dark);
    border-color: #fff;
    box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
  }
  
  .bi {
    vertical-align: -0.125em;
    fill: currentColor;
  }
  
  .text-small {
    font-size: 85%;
  }
  
  .dropdown-toggle {
    outline: 0;
  }
  </style>