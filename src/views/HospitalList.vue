<template>
  <div class="container">
    <h1 class="title is-size-3 is-size-4-mobile">{{ $t('hospitals.whereto') }}</h1> <!-- Welcome in Kalaallisut -->
    <p class="p-content">{{ $t("hospitals.para1") }} </p>
    <div class="columns is-multiline">
      <!-- Loop through hospitals and display each as a card -->
      <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile" v-for="hospital in hospitals"
        :key="hospital.id" @click="navigateToForm(hospital.id)">
        <div class="card hospital-card">
          <div class="card-image logo-wrapper">
            <figure class="image">
              <div class="logo-container">
                <img v-if="hospital.image_path" :src="getImagePath(hospital.image_path)" :alt="hospital.hospital_name"
                  class="hospital-logo" />
              </div>
            </figure>
          </div>

          <!-- Card Content -->
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
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL

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
        const response = await axios.get(`${apiUrl}/api/hospitals/`);
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
      this.$router.push({ name: 'HospitalForm', params: { id: hospitalId } }); // Navigate to form
    },
  },
};
</script>

<style scoped>
.card {
  cursor: pointer;
  min-height: 320px;
  height: auto;
  /* transition: transform 0.3s ease, box-shadow 0.3s ease; */
  border-radius: 4px;
  overflow: hidden;
  /* box-shadow: none; */
  /* opacity: 0; */
  /* transform: translateY(20px); */
  /* animation: fadeInUp 0.5s ease-in-out forwards; */
  /* background-color: #34495E; */
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
  /* background: linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(0, 165, 207, 0.5)); */
  background-color: var(--bulma-primary-light);
  /* backdrop-filter: blur(10px); */
  height: 160px;
  padding: 0.75rem;
  /* height: 200px; */
  /* Fixed height for logo container */
  /* padding: 10px; */
  /* Padding around the logo */
}

.hospital-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
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
    /* or whatever looks balanced on your content */
  }

  .logo-wrapper {
    height: 160px;
  }
}
</style>