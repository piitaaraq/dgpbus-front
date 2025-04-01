<template>
  <nav class="navbar " role="navigation" aria-label="main navigation">
    <div class="navbar-brand ">
      <a class="navbar-item heading is-size-1 has-text-primary-light" @click="goHome">
        Patientkørsel
      </a>

      <!-- Burger icon for mobile -->
    </div>

    <!-- Navbar menu -->
    <div :class="{ 'is-active': isActive }" class="navbar-menu">
      <!-- Navbar start (left side) -->
      <div class="navbar-start">
      </div>

      <!-- Navbar end (right side) -->
      <div class="navbar-end">
        <!-- Logo -->
        <router-link to="/" class="navbar-item">
          <img src="@/assets/logo.png" alt="Logo" class="logo">
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'HomePage' });
    }
  }
};
</script>

<style scoped>
/* Logo Styling */
.logo {
  max-height: 50px;
}

a:hover {
  background-color: #34495E;
}

.button {
  background-color: #34495E;
}

.button:hover {
  background-color: #2C3E50;

}

.icons {
  margin-right: 0.5rem;
}

.heading {
  font-family: 'Poppins';
  font-weight: 200;
  font-size: 3rem;
}

@media (max-width: 768px) {
  .heading {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .heading {
    font-size: 1rem;
  }
}
</style>
