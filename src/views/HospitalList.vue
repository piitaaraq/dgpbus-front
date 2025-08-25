<template>
  <section class="page-start">
    <div class="container is-fluid is-flex is-justify-content-space-between has-background-primary has-text-light">
      <div class="is-flex is-flex-direction-column is-justify-content-space-between">
        <p class="title is-size-3 mb-1 has-text-light">Patientkørsel</p>
        <p class="subtitle is-size-6 mt-0 has-text-light">Nakorsiartunik napparsimavinnut angallassineq</p>
      </div>
      <div class="is-flex is-align-items-flex-end toggler" @click="toggleLanguage">
        <font-awesome-icon :icon="['fa', 'globe']" class="icons 2xl" />ka/da <!-- Language icon -->
        <img src="https://www.svgrepo.com/show/529616/global.svg" class="is-light" width="24" alt="">
        <p class="ml-2 has-text-weight-light">ka / da</p>
      </div>
    </div>

    <div class="container">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos, quia quisquam adipisci doloremque rem,
        fugiat harum repudiandae aut rerum, quas similique veniam? Accusantium dignissimos dicta cupiditate rerum!
        Reprehenderit, neque in.
      </p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus repellendus laudantium eius repudiandae,
        ipsa amet suscipit officia nisi est eos autem esse illum in molestias incidunt ratione qui itaque cumque. Lorem
        ipsum dolor sit amet consectetur, adipisicing elit. Unde iusto quod, totam laudantium molestias fuga! Ipsum
        explicabo, assumenda non fugit dolores maiores ullam quia nulla quae odio praesentium, excepturi necessitatibus.
      </p>
    </div>
    <div class="container nav-boxes">
      <div class="nav-box-link" @click="scrollToDestinations">
        <div class="nav-box">
          <font-awesome-icon :icon="['far', 'calendar']" class="icons fa-2xl" />
          <p class="title is-size-4">Inniminniigit</p>
          <p>
            Nakorsiarnissat nalunaarutigiuk, napparsimavimmullu bussinik taxanilluunniit ingerlanneqarnissat
            inniminneerlugu.
          </p>
        </div>
      </div>
      <div class="nav-box">
        <font-awesome-icon :icon="['far', 'clock']" class="icons fa-2xl" />
        <p class="title is-size-4">Ullumi nakorsiartussat</p>
        <p>
          Ullumi nakorsiassaguit qassinut <a href="#">bussinut</a>, <a href="#">taxanulluunniit</a> ilaassanerlutit
          takusinnaavat.
        </p>
      </div>
      <div class="nav-box-link" @click="toSchedule">
        <div class="nav-box">
          <font-awesome-icon :icon="['far', 'bus']" class="icons fa-2xl" />
          <p class="title is-size-4">Bussit ingerlaffii</p>
          <p>
            Bussit Kalaallit Peqqissartut Illuannit bussit aallartarfii.
          </p>
        </div>
      </div>

    </div>

  </section>
  <div class="container" id="destinations">
    <p class="title is-size-3 is-size-4-mobile">{{ $t('hospitals.whereto') }}</p> <!-- Welcome in Kalaallisut -->
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
            <p class="title is-4">{{ hospital.hospital_name }}</p>
            <p class="subtitle is-6 pt-2">{{ hospital.address }}</p>
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
      currentLanguage: this.$i18n.locale, // Track the current language
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
    scrollToDestinations() {
      const el = document.getElementById('destinations');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    toSchedule() {
      this.$router.push({ name: 'BusSchedule' });
      this.isActive = false;
    },
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'da' ? 'kl' : 'da';
      this.$i18n.locale = this.currentLanguage;
    }
  },
};
</script>

<style scoped>
/* Layout and outer structure */
.container {
  padding: 2rem 0.25rem;
}

/* .page-start {
  min-height: 100vh;
} */

.nav-boxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* Nav Box */
.nav-box {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.nav-box:hover {
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.nav-box .icons {
  padding-bottom: 10px;
}

/* Nav Box Link */
.nav-box-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.nav-box-link:hover .nav-box {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* Card component */
.card {
  cursor: pointer;
  min-height: 320px;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
}

.card:hover {
  transform: none;
  box-shadow: none;
}

.card img {
  max-width: 50%;
}

/* Card content */
.card-content .title {
  font-family: 'Roboto Flex', sans-serif;
  font-weight: 300;
}

/* Toggler */
.toggler {
  cursor: pointer;
  border-bottom: 1px dotted #373F51;
  align-self: flex-end;
  color: #D8DBE2;
}

/* Logo wrapper */
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  padding: 0.75rem;
  background-color: #D8DBE2;
}

/* Typography */
.subtitle {
  font-family: 'Roboto', sans-serif;
}

/* Font Awesome icon */

.fa-hospital {
  font-size: 5rem;
}

/* Animation */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media Queries */
@media (max-width: 1024px) {
  .card img {
    max-height: 60%;
  }
}

@media (max-width: 768px) {
  .card {
    min-height: 260px;
  }

  .logo-wrapper {
    height: 160px;
  }

  .card img {
    max-height: 70%;
  }
}
</style>