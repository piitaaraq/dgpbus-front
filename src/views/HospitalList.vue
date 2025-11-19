<template>
  <div class="container">
    <h1 class="title is-size-3 is-size-4-mobile">{{ $t('hospitals.whereto') }}</h1> <!-- Welcome in Kalaallisut -->
    <p class="p-content">{{ $t("hospitals.para1") }} </p>
    <div class="columns is-multiline">
      <!-- Loop through hospitals and display each as a card -->
      <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile" v-for="hospital in hospitals"
        :key="hospital.id" @click="navigateToForm(hospital.id)">
        <div class="card">
          <div class="card-image logo-wrapper">
            <figure class="image">
              <font-awesome-icon :icon="['far', 'fa-hospital']" class="icons" />
            </figure>
          </div>
          <div class="card-content">
            <p class="title is-4 has-text-primary">{{ hospital.hospital_name }}</p>
            <p class="subtitle is-6 has-text-info pt-2">{{ hospital.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      hospitals: [],
    };
  },
  mounted() {
    this.fetchHospitals();
  },
  methods: {
    async fetchHospitals() {
      try {
        const response = await api.get('hospitals/');
        this.hospitals = response.data.filter(hospital => hospital.id !== 8); // Assign the hospital data to the component's state
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      }
    },
    // Method to get the full path to the image
    getImagePath(imageFilename) {
      // Use require to dynamically load images from assets
      return require(`@/assets/hospitals/${imageFilename}`);
    },
    navigateToForm(hospitalId) {
      this.$router.push({ name: 'HospitalAppointmentFlow', params: { id: hospitalId } }); // Navigate to form
    },
  },
};
</script>

<style scoped>
.card {
  cursor: pointer;
  min-height: 320px;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
}

.card-content .title {
  font-family: 'Roboto Flex', sans-serif;
  font-weight: 300;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:hover {
  transform: none;
  box-shadow: none;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bulma-primary-light);
  height: 160px;
  padding: 0.75rem;
}

.fa-hospital {
  font-size: 5rem;
}

.subtitle {
  font-family: 'Roboto', sans-serif;
  color: #004E64;
}

.container {
  padding: 2rem 0.25rem;
}

@media (max-width: 768px) {
  .card {
    min-height: 260px;
  }

  .logo-wrapper {
    height: 160px;
  }
}
</style>